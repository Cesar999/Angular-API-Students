const initialState = {
  auth: false,
  type: null
};

export function generalReducer(state = initialState, action) {
  switch (action.type) {

    case 'AUTHENTICATE':
      return{
        ...state,
        auth: action.payload
      };

    case 'TYPE':
      return{
        ...state,
        type: action.payload
      };

    default:
      return state;
  }
}
