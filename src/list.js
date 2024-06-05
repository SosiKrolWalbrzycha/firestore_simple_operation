import React, { useState, useEffect, useContext } from 'react'
import { useFormik } from 'formik'
import { Timestamp } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems, listenForItems, addItems, deleteItem } from './actions.js'
import { MyContext } from './App'
import styled from 'styled-components'
import Xicon from './square-x.svg';

const ListDiv = styled.div`
	display: flex;
  flex-direction: column;
  height: 50%;
  line-height: 1.5;
  width: 50%;
  padding: 0px 0px 20px 20px;
  background-color: #e1e3d9;
  margin-right: 10px;
  margin-left: 20px;
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
	padding: 0px 0px 20px 10px;
	font-size: 12px;
  }
`
const DeleteTransactionButton = styled.button`
	margin: 0px 10px 0px 10px;
	padding: 2px 8px;
	cursor: pointer;
	font-size: 9px;
	background-color: #FF8383;
	border: none;
	border-radius: 5px;
	height: 18px;

	@media (max-width: 576px) {
		height: 14px;
  }
`
const EditTransactionButton = styled.button`
	margin-right: 10px;
	padding: 2px 8px;
	cursor: pointer;
	font-size: 9px;
	background-color: #86FF8A;
	border: none;
	border-radius: 5px;
	height: 18px;
	@media (max-width: 576px) {
		height: 14px;
  }
`

const Buttons = styled.div`
	display: flex;

`

const DataDiv = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`

const MainPart = styled.div`
	width: 100%;
	position: relative;
	display: flex;
`
const FilterButtons = styled.div`
display: flex;

`

const CurrencyButton2 = styled.button`
display: flex;
align-items: center;
  margin: 0px 10px 20px 0px;
  padding: 10px 20px;
  width: auto;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #FF8383;
  align-self: flex-start;
  img {
    margin-right: 8px; // opcjonalne, aby dodać odstęp między ikoną a tekstem
  }
`

const TransactionList =  ({ currencyFilter, transactionFilter }) => {
	const { ordersState, transactionsState, showEditTransaction, handleDelete, setCurrencyFilter, setTransactionFilter} = useContext(MyContext)

	const filteredItems = ordersState.items.filter(item => {
		const currencyMatch = 
		  currencyFilter === 'PLN' || 
		  item.fromCurrency === currencyFilter || 
		  item.toCurrency === currencyFilter;
	
		const transactionMatch = 
		  transactionFilter === 'NONE' || 
		  item.transactionType === transactionFilter;
	
		return currencyMatch && transactionMatch;
	  }).sort((a, b) => b.data.seconds - a.data.seconds);



	return (
		<ListDiv>
			<h2>Twoje wszystkie transakcje:</h2>
			<FilterButtons>{currencyFilter !== "PLN" && <CurrencyButton2 onClick={() => setCurrencyFilter("PLN")}><img src={Xicon} alt="Usuń filtr"></img>Usuń filtr waluty</CurrencyButton2>}
			{transactionFilter !== "NONE" && <CurrencyButton2 onClick={() => setTransactionFilter("NONE")}><img src={Xicon} alt="Usuń filtr"></img>Usuń filtr rodzaju transakcji</CurrencyButton2>}</FilterButtons>
			
			{filteredItems.map(item => {
				// Znajdź transakcję odpowiadającą bieżącemu zamówieniu
				const transaction = transactionsState.items.find(tx => tx.operationId === item.id)
				if (!transaction) {
					// Możesz wyświetlić jakiś spinner ładowania lub inną informację
					return <li key={item.id}>Ładowanie danych transakcji...</li>
				}
				return (
					
					<MainPart>
						
						<DataDiv key={item.id}>
							<span>
								Dnia {item.data.toDate().toLocaleDateString()}{' '}
								{item.transactionType === 'buy' ? 'kupiłeś' : 'sprzedałeś'}{' '}
								{item.transactionType === 'buy' ? (
									<>
										{transaction.price.toFixed(2)} {item.toCurrency}
										{' za '}
										{item.value.toFixed(2)} {item.fromCurrency}
									</>
								) : (
									<>
										{item.value.toFixed(2)} {item.fromCurrency}
										{' za '}
										{transaction.price.toFixed(2)} {item.toCurrency}
									</>
								)}
							</span>
							<Buttons>
								<DeleteTransactionButton onClick={() => handleDelete(item.id, transaction.id)}>
									Delete
								</DeleteTransactionButton>
								<EditTransactionButton
									onClick={() =>
										showEditTransaction(
											item.fromCurrency,
											item.toCurrency,
											item.transactionType,
											item.value,
											item.data,
											item.id,
											transaction.id,
											transaction.price
										)
									}>
									Edit
								</EditTransactionButton>
							</Buttons>
						</DataDiv>
					</MainPart>
				)
			})}
		</ListDiv>
	)
}
export default TransactionList
