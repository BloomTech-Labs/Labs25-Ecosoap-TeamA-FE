const initialState = {
  isLoading: false,
  fetchError: '',
  types: [],
};

export const typesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TYPES_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'FETCH_TYPES_SUC':
      return {
        ...state,
        isLoading: false,
        fetchError: '',
        types: action.payload,
      };
    case 'FETCH_TYPE_ERR':
      return {
        ...state,
        isLoading: false,
        fetchError: action.payload,
      };
    default:
      return state;
  }
};
