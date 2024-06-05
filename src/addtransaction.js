import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { Timestamp } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems, listenForItems, addItems, deleteItem } from './actions.js'
import styled from 'styled-components'
import * as Yup from 'yup'

const Window = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: white;
	height: ${props => props.height}px; // Użycie propsa height
	width: ${props => props.width}px; // Użycie propsa width
	z-index: 30;
`
const SubWindow = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;

	padding: 20px;
	width: 40%;
	background-color: white;
	line-height: 200%;
`

const ErrorMessage = styled.div`
	color: red;
	font-size: 12px;

`

const InputContainer = styled.div`
display: flex;
flex-direction: row;

`

const OneCell = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
const SecondCell = styled.div`
	display: flex;
`

const NewTextInput = styled.input`
	height: 20px;
	width: 100px;
	border: 2px solid black;
`
const NewRadioInput = styled.input`
	margin-left: 30px;
	height: 20px;
	cursor: pointer;
	border-radius: 5px;
`

const NewSelect = styled.select`
	cursor: pointer;
	height: 25px;
	width: 107px;
	border: 2px solid black;
`

const NewButton = styled.button`
	border: 2px solid black;
	margin-top: 20px;
	padding: 5px 20px;
	cursor: pointer;
	border-radius: 5px;
`

const Polediv = styled.div`
display: flex;
flex-direction: column;
`

const AddTransactionWindow = prop => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth * 1)
	const [windowHeight, setWindowHeight] = useState(window.innerHeight * 0.4)
	const [currencySuffix, setCurrencySuffix] = useState('') // Stan do przechowywania skrótu waluty

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth * 1)
			setWindowHeight(window.innerHeight * 0.4)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const dispatch = useDispatch()

	const validationSchema = Yup.object({
		data: Yup.date()
			.max(new Date(new Date().setDate(new Date().getDate() - 1)), 'Data musi być wcześniejsza niż dzisiaj')
			.required('Data jest wymagana'),
		value: Yup.number()
			.positive('Wartość transakcji musi być większa od 0')
			.required('Wartość transakcji jest wymagana'),
		transactionType: Yup.string()
			.oneOf(['buy', 'sell'], 'Typ transakcji jest wymagany')
			.required('Typ transakcji jest wymagany'),
		currency: Yup.string().required('Waluta jest wymagana'),
	})

	const formik = useFormik({
		initialValues: {
			data: '',
			value: '',
			transactionType: '',
			currency: 'EUR',
			fromCurrency: '',
			toCurrency: '',
		},
		validationSchema, //Dodaeni chematu walidacji

		onSubmit: (values, { resetForm }) => {
			const date = new Date(values.data)
			const timestamp = Timestamp.fromDate(date)
			const dateString = date.toISOString().split('T')[0]

			// Przetwarzanie walut przed przesłaniem
			let fromCurrency, toCurrency
			if (values.transactionType === 'buy') {
				fromCurrency = 'PLN'
				toCurrency = values.currency
			} else {
				fromCurrency = values.currency
				toCurrency = 'PLN'
			}

			const updatedValues = {
				...values,
				data: timestamp,
				stringdata: dateString,
				fromCurrency,
				toCurrency,
			}

			dispatch(addItems(updatedValues, 'orders'))
			resetForm()
			{
				prop.close()
			}
		},
	})

	const handleTransactionTypeChange = event => {
		formik.handleChange(event)
		const transactionType = event.target.value
		if (transactionType === 'buy') {
			setCurrencySuffix('PLN')
		} else if (transactionType === 'sell') {
			setCurrencySuffix(formik.values.currency)
		}
	}

	const handleCurrencyChange = event => {
		formik.handleChange(event)
		if (formik.values.transactionType === 'sell') {
			setCurrencySuffix(event.target.value)
		}
	}

	return (
		<Window width={windowWidth} height={windowHeight}>
			<SubWindow>
				<h2 style={{ textAlign: 'center' }}>Dodaj nową transakcję:</h2>
				<form onSubmit={formik.handleSubmit}>
					<OneCell>
						<label htmlFor='data'>Data transakcji:</label>
						<InputContainer>
							<NewTextInput
								id='data'
								name='data'
								type='date'
								onChange={formik.handleChange}
								value={formik.values.data}
								error={formik.errors.data && formik.touched.data}
							/>
							{formik.errors.data && formik.touched.data && <ErrorMessage>{formik.errors.data}</ErrorMessage>}
						</InputContainer>
					</OneCell>
					<OneCell>
						<label htmlFor='password'>
							Wartość transakcji w <span>{currencySuffix}</span>:
						</label>
						<Polediv>
							
								<NewTextInput
									id='value'
									name='value'
									type='number'
									onChange={formik.handleChange}
									value={formik.values.value}
									error={formik.errors.value && formik.touched.value}
								/>
								{formik.errors.value && formik.touched.value && <ErrorMessage>{formik.errors.value}</ErrorMessage>}
								
								</Polediv>
								
							
						
					</OneCell>
					<OneCell>
						<label>Typ transakcji:</label>
						<div>
							<label>
								<NewRadioInput
									type='radio'
									name='transactionType'
									value='buy'
									checked={formik.values.transactionType === 'buy'}
									onChange={handleTransactionTypeChange}
								/>
								Kupno
							</label>
							<label>
								<NewRadioInput
									type='radio'
									name='transactionType'
									value='sell'
									checked={formik.values.transactionType === 'sell'}
									onChange={handleTransactionTypeChange}
								/>
								Sprzedaż
							</label>
						</div>
						{formik.errors.transactionType && formik.touched.transactionType && (
							<ErrorMessage>{formik.errors.transactionType}</ErrorMessage>
						)}
					</OneCell>

					<OneCell>
						<label htmlFor='currency'>What Currency:</label>
						<NewSelect name='currency' onChange={handleCurrencyChange} value={formik.values.currency}>
							<option value='EUR'>EUR</option>
							<option value='USD'>USD</option>
							<option value='JPY'>JPY</option>
							<option value='BGN'>BGN</option>
							<option value='CZK'>CZK</option>
							<option value='DKK'>DKK</option>
							<option value='GBP'>GBP</option>
							<option value='HUF'>HUF</option>
							<option value='RON'>RON</option>
							<option value='SEK'>SEK</option>
							<option value='CHF'>CHF</option>
							<option value='ISK'>ISK</option>
							<option value='NOK'>NOK</option>
							<option value='HRK'>HRK</option>
							<option value='RUB'>RUB</option>
							<option value='TRY'>TRY</option>
							<option value='AUD'>AUD</option>
							<option value='BRL'>BRL</option>
							<option value='CAD'>CAD</option>
							<option value='CNY'>CNY</option>
							<option value='HKD'>HKD</option>
							<option value='IDR'>IDR</option>
							<option value='ILS'>ILS</option>
							<option value='INR'>INR</option>
							<option value='KRW'>KRW</option>
							<option value='MXN'>MXN</option>
							<option value='MYR'>MYR</option>
							<option value='NZD'>NZD</option>
							<option value='PHP'>PHP</option>
							<option value='SGD'>SGD</option>
							<option value='THB'>THB</option>
							<option value='ZAR'>ZAR</option>
						</NewSelect>
					</OneCell>
					<OneCell>
						<NewButton type='submit'>Submit</NewButton>
						<NewButton onClick={prop.close}>Close</NewButton>
					</OneCell>
				</form>
			</SubWindow>
		</Window>
	)
}

export default AddTransactionWindow
