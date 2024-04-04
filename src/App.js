import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems, listenForItems, addItems, deleteItem } from './actions.js'
import { useFormik } from 'formik';
import { Timestamp } from 'firebase/firestore';

const App = () => {
	const dispatch = useDispatch()
	const itemsState = useSelector(state => state.items)

  //Formik
	const formik = useFormik({
		initialValues: {
			data: '',
			value: '',
		},
		onSubmit: (values, { resetForm }) => {
      const date = new Date(values.data);
      const timestamp = Timestamp.fromDate(date);
      const updatedValues = {
        ...values,
        data: timestamp,
      };
  
      dispatch(addItems(updatedValues));
      resetForm();
    },
	})
//Funkcja usuwania itemu
const handleDelete = (itemId) => {
  // Wywołanie akcji Redux Thunk do usunięcia elementu
  dispatch(deleteItem(itemId));
};


	// pierwsze zaczytanie danych ze store

	useEffect(() => {
		dispatch(fetchItems())
	}, [dispatch])

	// Nasłuch na store

	useEffect(() => {
		const unsubscribe = dispatch(listenForItems()) // Rozpoczęcie nasłuchiwania

		return () => {
			unsubscribe() // Oczyszczanie po opuszczeniu komponentu
		}
	}, [dispatch])

	return (
		<div>
			{itemsState.loading && <p>Ładowanie...</p>}
			{itemsState.error && <p>Wystąpił błąd: {itemsState.error.message}</p>}
			<ul>
				{itemsState.items.map(item => (
					<li key={item.id}>
						W dniu {item.data.toDate().toLocaleDateString()} zużycie wyniosło {item.value} kwh{' '} <button onClick={()=>{handleDelete(item.id)}}>Delete</button>
					</li>
				))}
			</ul>
			<div>
				<form onSubmit={formik.handleSubmit}>
					<label htmlFor='data'>Date</label>
					<input id='data' name='data' type='date' onChange={formik.handleChange} value={formik.values.data} />

					<label htmlFor='password'>Number of kwh</label>
					<input
						id='value'
						name='value'
						type='number'
						onChange={formik.handleChange}
						value={formik.values.value}
					/>

					<button type='submit'>Submit</button>
				</form>
			</div>
		</div>
	)
}

export default App
