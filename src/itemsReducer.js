import {
    FETCH_ITEMS_BEGIN,
    FETCH_ITEMS_SUCCESS,
    FETCH_ITEMS_FAILURE,
    ADDORREMOVE_ITEMS_SUCCESS,
    ADDORREMOVE_ITEMS_FAILURE,
} from './actions.js';

const initialState = {
    orders: {
        items: [],
        loading: false,
        error: null,
    },
    transactions: {
        items: [],
        loading: false,
        error: null,
    },
    dailyExchangeRate: {
        items: [],
        loading: false,
        error: null,
    }
};

export default function itemsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_ITEMS_BEGIN:
            return {
                ...state,
                [action.payload.collectionName]: {
                    ...state[action.payload.collectionName],
                    loading: true,
                    error: null,
                }
            };

        case FETCH_ITEMS_SUCCESS:
            return {
                ...state,
                [action.payload.collectionName]: {
                    ...state[action.payload.collectionName],
                    items: action.payload.items,
                    loading: false,
                    error: null,
                }
            };

        case ADDORREMOVE_ITEMS_SUCCESS:
            // This action might need more logic depending on what it's supposed to do exactly.
            return {
                ...state,
                [action.payload.collectionName]: {
                    ...state[action.payload.collectionName],
                    loading: false,
                }
            };

        case FETCH_ITEMS_FAILURE:
        case ADDORREMOVE_ITEMS_FAILURE:
            return {
                ...state,
                [action.payload.collectionName]: {
                    ...state[action.payload.collectionName],
                    loading: false,
                    error: action.payload.error,
                }
            };

        default:
            return state;
    }
}