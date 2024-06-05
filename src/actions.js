import { collection, getDocs, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { firestore } from './firebaseConfig'

// Typy akcji
export const FETCH_ITEMS_BEGIN = 'FETCH_ITEMS_BEGIN';
export const FETCH_ITEMS_SUCCESS = 'FETCH_ITEMS_SUCCESS';
export const FETCH_ITEMS_FAILURE = 'FETCH_ITEMS_FAILURE';
export const ADDORREMOVE_ITEMS_SUCCESS = 'ADDORREMOVE_ITEM_SUCCESS';
export const ADDORREMOVE_ITEMS_FAILURE = 'ADDORREMOVE_ITEMS_FAILURE';

// Uniwersalne akcje
const fetchItemsBegin = (collectionName) => ({
    type: FETCH_ITEMS_BEGIN,
    payload: { collectionName }
});

const fetchItemsSuccess = (items, collectionName) => ({
    type: FETCH_ITEMS_SUCCESS,
    payload: { items, collectionName }
});

const fetchItemsFailure = (error, collectionName) => ({
    type: FETCH_ITEMS_FAILURE,
    payload: { error, collectionName }
});

const addOrRemoveItemsSuccess = (collectionName) => ({
    type: ADDORREMOVE_ITEMS_SUCCESS,
    payload: { collectionName }
});

const addOrRemoveItemsFailure = (error, collectionName) => ({
    type: ADDORREMOVE_ITEMS_FAILURE,
    payload: { error, collectionName }
});

// Asynchroniczne akcje z parametrem kolekcji
export const fetchItems = (collectionName) => {
    return async dispatch => {
        dispatch(fetchItemsBegin(collectionName));
        try {
            const querySnapshot = await getDocs(collection(firestore, collectionName));
            const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, collectionName: collectionName, ...doc.data() }));
            dispatch(fetchItemsSuccess(itemsList, collectionName));
        } catch (error) {
            dispatch(fetchItemsFailure(error, collectionName));
        }
    }
};

export const listenForItems = (collectionName) => {
    return dispatch => {
        const collectionRef = collection(firestore, collectionName);

        const unsubscribe = onSnapshot(
            collectionRef,
            snapshot => {
                const itemsList = snapshot.docs.map(doc => ({ id: doc.id, collectionName: collectionName, ...doc.data() }));
                dispatch(fetchItemsSuccess(itemsList, collectionName)); // Aktualizacja stanu nowymi danymi
            },
            error => {
                dispatch(fetchItemsFailure(error, collectionName));
            }
        );

        return unsubscribe; // Zwróć funkcję do odsubskrybowania
    }
};

export const addItems = (item, collectionName) => {
    return async dispatch => {
        dispatch(fetchItemsBegin(collectionName));
        const collectionRef = collection(firestore, collectionName);

        try {
            await addDoc(collectionRef, item);
            dispatch(addOrRemoveItemsSuccess(collectionName));
        } catch (error) {
            console.error("Błąd dodawania dokumentu: ", error);
            dispatch(addOrRemoveItemsFailure(error, collectionName));
        }
    }
};

export const deleteItem = (itemId, collectionName) => {
	return async dispatch => {
	  dispatch(fetchItemsBegin(collectionName)); // Rozpoczęcie akcji z odpowiednią kolekcją
	  
	  try {
		await deleteDoc(doc(firestore, collectionName, itemId));
		dispatch(addOrRemoveItemsSuccess(collectionName)); // Sukces z odpowiednią kolekcją
	  } catch (error) {
		console.error("Błąd usuwania dokumentu: ", error);
		dispatch(addOrRemoveItemsFailure(error, collectionName)); // Błąd z odpowiednią kolekcją
	  }
	};
  };

  export const editItem = (itemId, collectionName, updatedData) => {
    return async dispatch => {
        dispatch(fetchItemsBegin(collectionName)); // Rozpoczęcie akcji z odpowiednią kolekcją
        const docRef = doc(firestore, collectionName, itemId);

        try {
            await updateDoc(docRef, updatedData);
            dispatch(addOrRemoveItemsSuccess(collectionName)); // Sukces z odpowiednią kolekcją
        } catch (error) {
            console.error("Błąd aktualizacji dokumentu: ", error);
            dispatch(addOrRemoveItemsFailure(error, collectionName)); // Błąd z odpowiednią kolekcją
        }
    };
};
