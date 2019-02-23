const initialState = {
  from1_num1: 100,
  from1_num2: 1,
  from2_text1: 'Cesar',
  from2_text2: 'Encinas',
  from3_tech: 'JavaScript',
  from3_level: 'Pro'
};

export function generalReducer(state = initialState, action) {
  switch (action.type) {

    case 'FORM1_NUM1':
      return{
        ...state,
        from1_num1: action.payload
      };

      case 'FORM1_NUM2':
      return{
        ...state,
        from1_num2: action.payload
      };

      case 'FORM2_TEXT1':
      return{
        ...state,
        from2_text1: action.payload
      };

      case 'FORM2_TEXT2':
      return{
        ...state,
        from2_text2: action.payload
      };

      case 'FORM3_TECH':
      return{
        ...state,
        from3_tech: action.payload
      };

      case 'FORM3_LEVEL':
      return{
        ...state,
        from3_level: action.payload
      };

    default:
      return state;
  }
}
