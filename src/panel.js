import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import { MyContext } from './App'
import Arrow from './square-arrow-right.svg';

const MainPanelBody = styled.div`
	display: flex;
	flex-direction: column;
	width: 50%;
	background-color: #e1e3d9;
	padding: 0px 20px 20px 20px;
	margin-left: 10px;
	margin-right: 20px;
  border-radius: 5px;
  

  @media (max-width: 1200px) {
    /* Styles for devices with a maximum width of 768px */
    flex-direction: column;
    width: auto;
	margin: 0px 20px 20px 20px;
	padding: 0px 20px 20px 20px;
	font-size: 14px;
  }

  @media (max-width: 576px) {
    /* Styles for devices with a maximum width of 768px */
    flex-direction: column;
    width: auto;
	margin: 0px 5px 5px 5px;
	padding: 0px 5px 5px 5px;
	font-size: 12px;
  }
`
const ArrowImg = styled.img`
margin: 20px 30px;
`

const CurrencyButton = styled.button`

	border: 1px solid black;
	margin: 5px;
	padding: 10px;
	cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: ${props => props.bgc > 0 ? '#86FF8A' : props.bgc < 0 ? '#FF8383' : 'grey'};
`
const CurrencyButton1 = styled.button`
display: flex;
	border: 1px solid black;
	margin: 5px;
	padding: 10px 20px;
	cursor: pointer;
  border: none;
  background-color: ${props => props.bgc > 0 ? '#86FF8A' : props.bgc < 0 ? '#FF8383' : 'grey'};
  border-radius: 5px;
`
const CurrencyButton2 = styled.button`
display: flex;
	border: 1px solid black;
	margin: 5px;
	padding: 10px 20px;
  border: none;
  background-color: ${props => props.bgc > 0 ? '#86FF8A' : props.bgc < 0 ? '#FF8383' : 'grey'};
  border-radius: 5px;
`

const LeftRight = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;

`

const AppPanel = prop => {
	const { ordersState, transactionsState, setCurrencyFilter, dailyExchangeRatesState, setTransactionFilter } = useContext(MyContext)

	// Zbieranie unikalnych walut
	const currencies = useMemo(() => {
		const uniqueCurrencies = new Set()
		ordersState.items.forEach(item => {
			if (item.toCurrency) uniqueCurrencies.add(item.toCurrency)
			if (item.fromCurrency) uniqueCurrencies.add(item.fromCurrency)
		})
		return Array.from(uniqueCurrencies)
	}, [ordersState.items])

	// Sumowanie wydatków w PLNach - zakupów walut

	const totalBuyAmount = useMemo(() => {
		return ordersState.items.reduce((total, item) => {
			if (item.transactionType === 'buy') {
				return total + Number(item.value)
			}
			return total
		}, 0)
	}, [ordersState.items])

	// Sumowanie sprzedaży walut

	// Pierwej Filtrowanie orders, które mają transactionType 'sell'

	const sellOrdersIds = useMemo(() => {
		return ordersState.items.filter(order => order.transactionType === 'sell').map(order => order.id) // Zbieranie tylko ID
	}, [ordersState.items])

	// Teraz sumujemy transakcje zwierające pobrane w wczesniejszej funkcji dane
	const totalSellAmount = useMemo(() => {
		return transactionsState.items.reduce((total, transaction) => {
			if (sellOrdersIds.includes(transaction.operationId)) {
				return total + Number(transaction.price)
			}
			return total
		}, 0)
	}, [transactionsState.items, sellOrdersIds])

	// Sumowanie ilości waluty

	const currencySums = useMemo(() => {
		const sums = {}

		ordersState.items.forEach(item => {
			const currency = item.currency
			if (!sums[currency]) sums[currency] = { buy: 0, sell: 0 }

			if (item.transactionType === 'sell') {
				sums[currency].sell += Number(item.value)
			} else if (item.transactionType === 'buy') {
				const transaction = transactionsState.items.find(t => t.operationId === item.id)
				if (transaction) sums[currency].buy += Number(transaction.price)
			}
		})

		return sums
	}, [ordersState.items, transactionsState.items])

	console.log(ordersState);

	// Sumowanie dzisiejszej wartości posiadanych/kupionych walut

	const calculateTodayValue = useMemo(() => {
		const buyOrders = ordersState.items.filter(order => order.transactionType === 'buy')

		if (buyOrders.length === 0) {
			console.log('Nie zrobiłeś tansakcji zakupu walut.')
			return 0
		}

		const buyOrderIds = buyOrders.map(order => order.id)

		const buyTransactions = transactionsState.items.filter(transaction => buyOrderIds.includes(transaction.operationId))

		if (buyTransactions.length === 0) {
			console.log('Nie ma transakcji odpowiadających id ordersów.')
			return 0
		}

		const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

		const todayRatesDoc = dailyExchangeRatesState.items.find(rateDoc => rateDoc.date === today)

		if (!todayRatesDoc) {
			console.log('Nie mamy kursów walut na dzień dzisiejszy')
			return 0
		}

		const dailyRates = todayRatesDoc.rate

		let totalValue = 0
		buyTransactions.forEach(transaction => {
			const rate = dailyRates[transaction.toCurrency]
			if (rate) {
				totalValue += transaction.price / rate
			}
		})
		return totalValue
	}, [ordersState.items, transactionsState.items])

	// Sumowanie wartości zobowiązań związanych ze sprzedaniem walut których nie miales

	// Sumowanie dzisiejszej wartości posiadanych/kupionych walut

	const calculateTodayLiabilities = useMemo(() => {
		const sellOrders = ordersState.items.filter(order => order.transactionType === 'sell')

		if (sellOrders.length === 0) {
			console.log('Nie zrobiłeś tansakcji sprzedazy walut.')
			return 0
		}

		const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

		const todayRatesDoc = dailyExchangeRatesState.items.find(rateDoc => rateDoc.date === today)

		if (!todayRatesDoc) {
			console.log('Nie mamy kursów walut na dzień dzisiejszy')
			return 0
		}

		const dailyRates = todayRatesDoc.rate

		let totalLaibilities = 0
		sellOrders.forEach(order => {
			const rate = dailyRates[order.fromCurrency]
			if (rate) {
				totalLaibilities += order.value / rate
			}
		})
		return totalLaibilities
	}, [ordersState.items, transactionsState.items])

	const totalProfitFromBuy = (calculateTodayValue - totalBuyAmount).toFixed(2)

	const totalProfitFromSell = (totalSellAmount - calculateTodayLiabilities).toFixed(2)

	const totalProfitability = (parseFloat(totalProfitFromBuy) + parseFloat(totalProfitFromSell)).toFixed(2)

	return (
		<MainPanelBody>
      <h2>Twój wynik na dzisiaj:</h2>
			<LeftRight>
        
      <CurrencyButton2 bgc={totalProfitability} > 
<div><p>Twój zysk:</p>
<p>{totalProfitability}</p></div>

      </CurrencyButton2>
				<CurrencyButton1 bgc={totalProfitFromBuy} onClick={() => setTransactionFilter('buy')}>
          <div>
					<p>Kupiłeś waluty za: </p>
					<p>{totalBuyAmount.toFixed(2)} PLN</p></div>
          <ArrowImg src={Arrow} alt="Arrow Icon" />
          <div>
					<p>Zysk na kupionych: </p>
					<p>{totalProfitFromBuy} PLN</p></div>
				</CurrencyButton1>
				<CurrencyButton1 bgc={totalProfitFromSell} onClick={() => setTransactionFilter('sell')}>
          <div>
					<p>Sprzedałeś walut za:</p>
					<p>{totalSellAmount.toFixed(2)} PLN</p></div>
          <ArrowImg src={Arrow} alt="Arrow Icon" /><div>
					<p>Zysk na sprzedanych: </p>
					<p>{totalProfitFromSell} PLN</p></div>
				</CurrencyButton1>
			</LeftRight>
      <div>
      <h2>Twój portfel walutowy:</h2>

			{Object.entries(currencySums).map(([currency, { buy, sell }]) => (
				<CurrencyButton key={currency} onClick={() => setCurrencyFilter(currency)} bgc={(buy - sell).toFixed(2)}>
					{currency} - Bilans: {(buy - sell).toFixed(2)}
				</CurrencyButton>
			))}

      </div>

		</MainPanelBody>
	)
}

export default AppPanel
