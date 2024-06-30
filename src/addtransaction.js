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
	width: 30%;
	background-color: white;
	line-height: 200%;

	@media (max-width: 1400px) {
		padding: 0px;
		width: 30%;
	}
	@media (max-width: 1200px) {
		padding: 0px;
		width: 30%;
	}
	@media (max-width: 992px) {
		padding: 0px;
		width: 40%;
	}
	@media (max-width: 768px) {
		padding: 0px;
		width:60%;
	}

	@media (max-width: 576px) {
		padding: 20px;
		width: 90%;
		
	}
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
	align-items: center;

	flex-direction: column;
`

const Firstdiv = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
`
const Seconddiv = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: end;
	transform: translateY(-4px);
	line-height: 1.3;
`

const SecondCell = styled.div`
	display: flex;
`

const NewTextInput = styled.input`
	height: 20px;
	width: 100px;
	border: 2px solid black;
	transform: translateY(2px);
`
const NewRadioInput = styled.input`
	margin-left: 30px;
	height: 20px;
	cursor: pointer;
	border-radius: 5px;
	transform: translateY(2px);

	@media (max-width: 576px) {
		margin-left: 0px;
	}
`

const NewSelect = styled.select`
	cursor: pointer;
	height: 25px;
	width: 107px;
	border: 2px solid black;
	transform: translateY(2px);
`

const NewButton = styled.button`
	border: 2px solid black;
	margin-top: 20px;
	padding: 5px 20px;
	cursor: pointer;
	border-radius: 5px;
`

const AddTransactionWindow = prop => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth * 1)
	const [windowHeight, setWindowHeight] = useState(window.innerHeight * 0.3)
	const [currencySuffix, setCurrencySuffix] = useState('') // Stan do przechowywania skrótu waluty

	useEffect(() => {
		const handleResize = () => {
			if (windowWidth <= 900) {
				setWindowWidth(window.innerWidth * 1)
				setWindowHeight(window.innerHeight * 0.3)
			} 
			 else {
				setWindowWidth(window.innerWidth * 1)
				setWindowHeight(window.innerHeight * 0.3)
			}
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
						<Firstdiv>
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
							</InputContainer>
						</Firstdiv>
						<Seconddiv>
							{formik.errors.data && formik.touched.data && <ErrorMessage>{formik.errors.data}</ErrorMessage>}
						</Seconddiv>
					</OneCell>
					<OneCell>
						<Firstdiv>
							<label htmlFor='password'>
								Wartość transakcji w <span>{currencySuffix}</span>:
							</label>

							<NewTextInput
								id='value'
								name='value'
								type='number'
								onChange={formik.handleChange}
								value={formik.values.value}
								error={formik.errors.value && formik.touched.value}
							/>
						</Firstdiv>
						<Seconddiv>
							{formik.errors.value && formik.touched.value && <ErrorMessage>{formik.errors.value}</ErrorMessage>}
						</Seconddiv>
					</OneCell>
					<OneCell>
						<Firstdiv>
							<label>Typ transakcji:</label>

							<label>
								<NewRadioInput
									type='radio'
									name='transactionType'
									value='buy'
									checked={formik.values.transactionType === 'buy'}
									onChange={handleTransactionTypeChange}
								/>
								Kup
							</label>
							<label>
								<NewRadioInput
									type='radio'
									name='transactionType'
									value='sell'
									checked={formik.values.transactionType === 'sell'}
									onChange={handleTransactionTypeChange}
								/>
								Sprzedaj
							</label>
						</Firstdiv>
						<Seconddiv>
							{formik.errors.transactionType && formik.touched.transactionType && (
								<ErrorMessage>{formik.errors.transactionType}</ErrorMessage>
							)}
						</Seconddiv>
					</OneCell>

					<OneCell>
						<Firstdiv>
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
						</Firstdiv>
					</OneCell>
					<OneCell>
						<Firstdiv>
							<NewButton type='submit'>Potwierdź transakcję</NewButton>
							<NewButton onClick={prop.close}>Zamknij</NewButton>
						</Firstdiv>
					</OneCell>
				</form>
			</SubWindow>
		</Window>
	)
}

export default AddTransactionWindow
