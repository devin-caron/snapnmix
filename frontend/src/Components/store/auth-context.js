import React, {useState} from 'react'

const AuthContext = React.createContext({
    token:'',
    isLoggedIn: false,
    favs: (favIDs) => {},
    favIDs:[],
    login: (token) => {},
    logout: () => {}
})

export const AuthContextProvider = (props) =>{
    const initialToken = localStorage.getItem('token');
    const [token,setToken] = useState(initialToken);
    const [favIDs,setFavIDs] = useState([]);

    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        setToken(token);
        localStorage.setItem('token', token);
    };

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
    }

    const favIDsHandler = (favIDs) =>{
        setFavIDs(favIDs);
    }

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        favs: favIDsHandler,
        favIDs: favIDs,
        login: loginHandler,
        logout: logoutHandler,
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
}

export default AuthContext;