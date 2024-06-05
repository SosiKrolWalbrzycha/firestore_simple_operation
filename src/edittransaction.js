import React, { useState, useEffect, useContext } from 'react'
import { useFormik } from 'formik'
import { Timestamp } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems, listenForItems, addItems, deleteItem, editItem } from './actions.js'
import styled from 'styled-components'
import { MyContext } from './App'

const Window = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: gray;
	height: ${props => props.height}px; // Użycie propsa height
	width: ${props => props.width}px; // Użycie propsa width
	z-index: 30;
`
const SubWindow = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
	width: 300px;
	background-color: blue;
	line-height: 200%;
`

const OneCell = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: space-between;
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
	height: 20px;
	cursor: pointer;
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
`

const EditTransactionWindow = prop => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth * 0.9)
	const [windowHeight, setWindowHeight] = useState(window.innerHeight * 0.4)

	const { isEditTransactionVisible } = useContext(MyContext)

	const formatDate = timestamp => {
		return new Date(timestamp.seconds * 1000).toISOString().split('T')[0]
	}

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth * 0.9)
			setWindowHeight(window.innerHeight * 0.4)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const dispatch = useDispatch()

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const formik = useFormik({
		initialValues: {
			data: formatDate(isEditTransactionVisible.data),
			value: isEditTransactionVisible.value,
			transactionType: isEditTransactionVisible.transactionType,
			currency:
				isEditTransactionVisible.transactionType === 'buy'
					? isEditTransactionVisible.toCurrency
					: isEditTransactionVisible.fromCurrency,
			fromCurrency: '',
			toCurrency: '',
		},
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

			dispatch(editItem(isEditTransactionVisible.orderId, 'orders', updatedValues))
			resetForm()
		},
	})

	return (
		<Window width={windowWidth} height={windowHeight}>
			<SubWindow>
				<h2>Edit Transaction</h2>

				<form onSubmit={formik.handleSubmit}>
					<OneCell>
						<label htmlFor='data'>Transaction date:</label>
						<NewTextInput id='data' name='data' type='date' onChange={formik.handleChange} value={formik.values.data} />
					</OneCell>
					<OneCell>
						<label htmlFor='value'>
							Transaction value
							{formik.values.transactionType === 'buy' ? <span> (w PLN):</span> : <span> (w {formik.values.currency})</span>}
						</label>
						<NewTextInput
							id='value'
							name='value'
							type='number'
							onChange={formik.handleChange}
							value={formik.values.value}
						/>
					</OneCell>
					<OneCell>
						<label>Transaction type:</label>
						<div>
							<label>
								<NewRadioInput
									type='radio'
									name='transactionType'
									value='buy'
									checked={formik.values.transactionType === 'buy'}
									onChange={formik.handleChange}
								/>
								Buy
							</label>
							<label>
								<NewRadioInput
									type='radio'
									name='transactionType'
									value='sell'
									checked={formik.values.transactionType === 'sell'}
									onChange={formik.handleChange}
								/>
								Sell
							</label>
						</div>
					</OneCell>

					<OneCell>
						<label htmlFor='currency'>What Currency:</label>
						<NewSelect
							name='currency'
							onChange={formik.handleChange}
							value={formik.values.currency}
							key={formik.values.transactionType}>
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
export default EditTransactionWindow
