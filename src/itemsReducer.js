import {
	FETCH_ITEMS_BEGIN,
	FETCH_ITEMS_FAILURE,
	FETCH_ITEMS_SUCCESS,
	ADDORREMOVE_ITEMS_SUCCESS,
	ADDORREMOVE_ITEMS_FAILURE,

} from './actions.js'

const initialState = {
	items: [],
	loading: false,
	error: null,
}

export default function itemsReducer(state = initialState, action) {
	switch (action.type) {
		case FETCH_ITEMS_BEGIN:
			return {
				...state,
				loading: true,
				error: null,
			}

		case FETCH_ITEMS_SUCCESS:
			return {
				...state,
				loading: false,
				items: [...action.payload.items],
				error: null,
			}

		case ADDORREMOVE_ITEMS_SUCCESS:
			return {
				...state,
				loading: false,
			}

		case ADDORREMOVE_ITEMS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error,
			}
		case FETCH_ITEMS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error,
				items: [],
			}
		default:
			return state
	}
}
