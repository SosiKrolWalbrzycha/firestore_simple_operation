import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { firestore } from './firebaseConfig' // Upewnij się, że masz poprawną konfigurację Firestore

const fetchAndSaveDailyExchangeRates = async () => {
    console.log("wywolany");
	const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
	const ratesRef = collection(firestore, 'dailyExchangeRates')

	// Sprawdzanie, czy kursy walut na dzisiejszy dzień są już w bazie danych
	const q = query(ratesRef, where('date', '==', today))
	const snapshot = await getDocs(q)
	if (!snapshot.empty) {
		console.log('Exchange rates for today already exist.')
		return
	}

	try {
		const response = await fetch(
			'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_fCFwo8OfRq3SvUlX7Zib40VnZoTL758F1tVozxH7&currencies=EUR,USD,JPY,BGN,CZK,DKK,GBP,HUF,RON,SEK,CHF,ISK,NOK,HRK,RUB,TRY,AUD,BRL,CAD,CNY,HKD,IDR,ILS,INR,KRW,MXN,MYR,NZD,PHP,SGD,THB,ZAR&base_currency=PLN'
		)
		if (!response.ok) {
			throw new Error('Failed to fetch exchange rates')
		}
		const data = await response.json()
		const rates = data.data

        

		await addDoc(ratesRef, {
			date: today,
			rate: data.data,
		})

		console.log('Exchange rates saved successfully.')
	} catch (error) {
		console.error('Error fetching and saving exchange rates:', error)
	}
}

export default fetchAndSaveDailyExchangeRates
