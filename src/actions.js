import { collection, getDocs, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { firestore } from './firebaseConfig'

// Typy akcji
export const FETCH_ITEMS_BEGIN = 'FETCH_ITEMS_BEGIN'
export const FETCH_ITEMS_SUCCESS = 'FETCH_ITEMS_SUCCESS'
export const FETCH_ITEMS_FAILURE = 'FETCH_ITEMS_FAILURE'
export const ADDORREMOVE_ITEMS_SUCCESS = 'ADDORREMOVE_ITEM_SUCCESS'
export const ADDORREMOVE_ITEMS_FAILURE = 'ADDORREMOVE_ITEMS_FAILURE'

// Akcje
const fetchItemsBegin = () => ({
	type: FETCH_ITEMS_BEGIN,
})

const fetchItemsSuccess = items => ({
	type: FETCH_ITEMS_SUCCESS,
	payload: { items },
})

const addOrRemoveItemsSuccess = () => ({
	type: ADDORREMOVE_ITEMS_SUCCESS,
})

const addOrRemoveItemsFailure = error => ({
	type: ADDORREMOVE_ITEMS_FAILURE,
	payload: { error },
})

const fetchItemsFailure = error => ({
	type: FETCH_ITEMS_FAILURE,
	payload: { error },
})

// Kreator akcji asynchronicznej pobierającej wszystkie dane
export const fetchItems = () => {
	return async dispatch => {
		dispatch(fetchItemsBegin())
		try {
			const querySnapshot = await getDocs(collection(firestore, 'danedodat'))
			const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data().data, value: doc.data().value }))
			console.log(itemsList)
			dispatch(fetchItemsSuccess(itemsList))
		} catch (error) {
			dispatch(fetchItemsFailure(error))
		}
	}
}

// Nasłuchiwanie i pobieranie danych po zmianie w firestore:

export const listenForItems = () => {
	return dispatch => {
		const collectionRef = collection(firestore, 'danedodat')

		const unsubscribe = onSnapshot(
			collectionRef,
			snapshot => {
				const itemsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
				dispatch(fetchItemsSuccess(itemsList)) // Aktualizacja stanu nowymi danymi
			},
			error => {
				dispatch(fetchItemsFailure(error))
			}
		)

		return unsubscribe // Zwróć funkcję do odsubskrybowania
	}
}

// Dodawanie itemu do bazy

export const addItems = item => {
	return async dispatch => {
		dispatch(fetchItemsBegin())
		const collectionRef = collection(firestore, 'danedodat')

    try {
			// Dodajemy dokument do kolekcji
			const docRef = await addDoc(collectionRef, item);
			dispatch(addOrRemoveItemsSuccess(item)); 

		} catch (error) {
			console.error("Błąd dodawania dokumentu: ", error);
			dispatch(addOrRemoveItemsFailure(error));
		}

	}
}

//Usuwanie itemu z bazy

export const deleteItem = (itemId) => {
  return async dispatch => {
    dispatch(fetchItemsBegin())
    
    try {
			// doc wyszukuje dokument a deletedoc go usuwa
      deleteDoc(doc(firestore, 'danedodat', itemId));
			dispatch(addOrRemoveItemsSuccess(itemId)); 

		} catch (error) {
			console.error("Błąd usuwania dokumentu: ", error);
			dispatch(addOrRemoveItemsFailure(error));
		}

  };
};
