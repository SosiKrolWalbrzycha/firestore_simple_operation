import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { Timestamp } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems, listenForItems, addItems, deleteItem } from './actions.js'
import styled from 'styled-components'


const Window = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: white;
	height: ${props => props.height}px; // Użycie propsa height
	width: ${props => props.width}px; // Użycie propsa width
	z-index: 20;

  
`

const TextZaslepka = styled.p`
width: 50%;
text-align: center;

@media (max-width: 1200px) {
    width: 60%;
  }

  @media (max-width: 992px) {
    width: 80%;
  }
  @media (max-width: 768px) {
    width: 90%;
    font-size: 14px;
  }

  @media (max-width: 576px) {
    width: 95%;
    font-size: 12px;
  }
`


const Zaslepka = prop => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth * 1)
	const [windowHeight, setWindowHeight] = useState(window.innerHeight * 0.3)

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth * 1)
			setWindowHeight(window.innerHeight * 0.3)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	

	return (
		
			<Window width={windowWidth} height={windowHeight}>
			<h3>Witaj zagubiony inwestorze!</h3>
            <TextZaslepka>Oddaję w Twoje ręce aplikację, kóra obliczy za Ciebie efektywność Twoich inwestycji walutowych. Dodając transakcję realizujesz ją po kursie z dnia, w którym nastąpiła transakcja. Rentowność każdej transakcji jest liczona względem dnia dzisiejszego. Czyli na podstawie dzisiejszego kursu. Dzieki aplikacji uzyskasz świadomość rentowności wszystkich transakcji zakupu jak i sprzedaży walut. Masz gląd w łączny bilans Twojego portfela oraz rentowność wszystkich tansakcji. Zapraszam do zabawy.</TextZaslepka>
			</Window>
	
	)
}
export default Zaslepka
