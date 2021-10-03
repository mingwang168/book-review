const defaultState = {
    books:[],
    mybooks:[],
    loginStatus:false,
    loginOpenModal:false,
    signupOpenModal:false,
    loginMessage:'',
    userName:'',
    userId:'',
    token:'',
    message:'',
    avatarUrl:'',
    homeTotalBooks:0,
  };
  const reducer = (state = defaultState, action) => {
     switch (action.type) {
        case 'init_books':
            return {...state,books:action.data}
        case 'init_total_page':
            return {...state,homeTotalBooks:action.data}
        case 'init_mybooks':
            return {...state,mybooks:action.data}
        case 'renew_loginStatus':
            return {...state,...action.data}
        case 'logOut':
            return {...state,...action.data}
        case 'handleLoginOpenModal':
            return {...state,loginOpenModal:action.data.loginOpenModal,message:action.data.message}
        case 'handleSignupOpenModal':
            return {...state,signupOpenModal:action.data.signupOpenModal,message:action.data.message}
        case 'sendMessage':
            return {...state,message:action.data}
        default:
        return state;
    }
  };
  export default reducer;
  