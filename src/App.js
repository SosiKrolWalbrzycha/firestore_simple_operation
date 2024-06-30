import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems, listenForItems, addItems, deleteItem } from './actions.js'
import { useFormik } from 'formik'
import { Timestamp } from 'firebase/firestore'
import Chart from './charts.js'
import AppPanel from './panel.js'
import AddTransactionWindow from './addtransaction.js'
import EditTransactionWindow from './edittransaction.js'
import TransactionList from './list.js'
import styled from 'styled-components'
import { createContext } from 'react'
import fetchAndSaveDailyExchangeRates from './fetchExchangeRates.js';
import Logo from './logo.webp';
import Zaslepka from './zaslepka.js'

const Header = styled.img`
margin-top: 20px;
margin-bottom: 20px;
@media (max-width: 576px) {
	width: 90%;
  }
`

const MainWindow = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
	
`

const SecondWindow = styled.div`
	position: relative;
	display: flex;
	width: 100%;

	@media (max-width: 1200px) {
    /* Styles for devices with a maximum width of 768px */
    flex-direction: column;
    width: 100%;
  }

	
`

const AddTransactionButton = styled.button`
	margin: 20px;
	padding: 10px 20px;
	color: white;
	background-color: black;
	border: none;
	border-radius: 5px;
	cursor: pointer;
`

const ListDiv = styled.div`
	display: flex;
	flex-direction: column;
	height: 50%;
	line-height: 1.5;
	width: 50%;
	padding: 20px;
	background-color: #e1e3d9;
	margin-right: 10px;
	margin-left: 20px;
`
const DataDiv = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`

const Buttons = styled.div`
	display: flex;
	margin-left: 20px;
	
`
export const MyContext = createContext(null)


const App = () => {
	const dispatch = useDispatch()
	const ordersState = useSelector(state => state.orders.orders)
	const transactionsState = useSelector(state => state.transactions.transactions)
	const dailyExchangeRatesState = useSelector(state => state.dailyExchangeRates.dailyExchangeRates)

	console.log(ordersState.items);

	const [isAddTransactionVisible, setIsAddTransactionVisible] = useState(false)
	const [isEditTransactionVisible, setIsEditTransactionVisible] = useState({
		isVisible: false,
		fromCurrency: '',
		toCurrency: '',
		transactionType: '',
		value: 0,
		data: null,
		orderId: '',
		transactionID: '',
	})

	const [currencyFilter, setCurrencyFilter] = useState('PLN')
	const [transactionFilter, setTransactionFilter] = useState('NONE')

	//Funkcja usuwania itemu
	const handleDelete = async (ordersId, transactionId) => {
		await dispatch(deleteItem(ordersId, 'orders'))
		await dispatch(deleteItem(transactionId, 'transactions'))
	}

		// Wywołanie dzisiajeszych kursów

	useEffect(() => {
		
		const fetchRates = async () => {
		  await fetchAndSaveDailyExchangeRates();
		};
	
		fetchRates();
	  }, []);

	// pierwsze zaczytanie danych ze store

	useEffect(() => {
		dispatch(fetchItems('orders'))
		dispatch(fetchItems('transactions'))
		dispatch(fetchItems('dailyExchangeRates'))
	
	}, [dispatch])



	// Nasłuch na store

	useEffect(() => {
		const unsubscribeOrders = dispatch(listenForItems('orders'))
		const unsubscribeTransactions = dispatch(listenForItems('transactions'))
		const unsubscribeDailyExchangeRates = dispatch(listenForItems('dailyExchangeRates'))
	

		return () => {
			unsubscribeOrders()
			unsubscribeTransactions()
			unsubscribeDailyExchangeRates() // Oczyszczanie po opuszczeniu komponentu
			
		}
	}, [dispatch])

	const chart1Data = () => {
		console.log("Starting chart1Data processing");

    const filteredByCurrency = ordersState.items.filter(item => {
        if (currencyFilter !== 'PLN') {
            return item.fromCurrency === currencyFilter || item.toCurrency === currencyFilter;
        }
        return true;
    });
    console.log("Filtered by currency:", filteredByCurrency);

    const filteredByTransaction = filteredByCurrency.filter(item => {
        if (transactionFilter === 'buy') {
            return item.transactionType === 'buy';
        } else if (transactionFilter === 'sell') {
            return item.transactionType === 'sell';
        }
        return true;
    });
    console.log("Filtered by transaction:", filteredByTransaction);

	const mappedItems = filteredByTransaction.map(item => {
        let value = item.transactionType === 'sell' ? item.value : -item.value;
        if (item.transactionType === 'sell') {
            const transaction = transactionsState.items.find(trans => trans.operationId === item.id);
            if (transaction) {
                value = transaction.price;
            }
        }
        return {
            date: item.data.toDate().toLocaleDateString(),
            value: value,
            timestamp: item.data,
            fromCurrency: item.fromCurrency,
            toCurrency: item.toCurrency,
            transaction: item.transaction
        };
    });
    console.log("Mapped items:", mappedItems);

    const sortedItems = mappedItems.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
    console.log("Sorted items:", sortedItems);

    const formattedItems = sortedItems.map(item => ({
        ...item,
        value: item.value.toFixed(2)
    }));
    console.log("Formatted items:", formattedItems);

    return formattedItems;
	  };
	

	const showAddTransaction = () => {
		setIsAddTransactionVisible(true);
		setIsEditTransactionVisible({
			isVisible: false,
			fromCurrency: '',
			toCurrency: '',
			transactionType: '',
			value: 0,
			data: null,
			orderId: '',
			transactionID: '',});
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
	const hideAddTransaction = () => {
		setIsAddTransactionVisible(false)
	}

	const updateTransactionType = (newType) => {
		setIsEditTransactionVisible(prevState => ({
		  ...prevState,
		  transactionType: newType
		}));
	  } 

	const showEditTransaction = (fromCurrency, toCurrency, transactionType, value, data, orderId, transactionId, transactonPrice) => {
		setIsEditTransactionVisible({
			isVisible: true,
			fromCurrency: fromCurrency,
			toCurrency: toCurrency,
			transactionType: transactionType,
			value: value,
			data: data,
			orderId: orderId,
			transactionID: transactionId,
			transactionPrice: transactonPrice,
		});
		setIsAddTransactionVisible(false)

	}
	const hideEditTransaction = () => {
		setIsEditTransactionVisible({
			isVisible: false,
			fromCurrency: '',
			toCurrency: '',
			transactionType: '',
			value: 0,
			data: null,
			orderId: '',
			transactionID: '',
			transactionPrice: '',
		})
	}


	const contextValue = { ordersState, transactionsState, handleDelete, showEditTransaction, isEditTransactionVisible, updateTransactionType, setCurrencyFilter, dailyExchangeRatesState, setTransactionFilter }

	return (
		<MyContext.Provider value={contextValue}>
			
			<MainWindow>
				<Header src={Logo} alt="Logo"></Header>
				{isAddTransactionVisible && <AddTransactionWindow close={hideAddTransaction} />}
				{isEditTransactionVisible.isVisible && <EditTransactionWindow updateTransactionType={updateTransactionType} close={hideEditTransaction} />}
				{!(isAddTransactionVisible || isEditTransactionVisible.isVisible) && (ordersState.items[0] ? <Chart data={chart1Data()} /> : <Zaslepka />)}
				{!(isAddTransactionVisible || isEditTransactionVisible.isVisible) &&<AddTransactionButton onClick={showAddTransaction}>Dodaj transakcję</AddTransactionButton>}
				{transactionsState.loading && <p>Ładowanie...</p>}
				{ordersState.error && <p>Wystąpił błąd: {ordersState.error.message}</p>}
				{ordersState.items[0] &&
				<SecondWindow>
					<TransactionList currencyFilter={currencyFilter} transactionFilter={transactionFilter}/>
					<AppPanel />
				</SecondWindow>}
			</MainWindow>
			
		</MyContext.Provider>
	)
}

export default App
