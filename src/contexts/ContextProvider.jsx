import React, {createContext, useContext, useEffect, useReducer, useState} from "react";
const StateContext = createContext();


const initialState = {
    chat: false,
    cart: JSON.parse(localStorage.getItem('cart')) || { items: [] },
    userProfile: false,
    notification: false,
}

const navState = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false,
    settings: false
}



export const ContextProvider = ({children}) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState(navState);
    const [screenSize, setScreenSize] = useState(undefined);
    const [state, dispatch] = useReducer(cartReducer, initialState.cart);


    const handleClick = (clicked) => {
        setIsClicked((prevState) => ({
            ...initialState,
            [clicked]: !prevState[clicked], // Toggle the visibility
        }));
    };


    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    //console.log(screenSize);

    useEffect(() => {
        console.log('running');
        if(screenSize <=900) {
            setActiveMenu(false);
        }else {
            setActiveMenu(true);
        }
    },[screenSize])

    const value = {
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        cart: state,
        dispatch
    }

function cartReducer(state, action) {
    // Helper function to save cart state to localStorage
    const saveToLocalStorage = (cartState) => {
        localStorage.setItem('cart', JSON.stringify(cartState));
    };

    let updatedState;

    switch (action.type) {
        case 'ADD_TO_CART':
            updatedState = {
                ...state,
                items: [...state.items, action.payload],
            };
            saveToLocalStorage(updatedState);
            return updatedState;

        case 'REMOVE_FROM_CART':
            updatedState = {
                ...state,
                items: state.items.filter(item => item.productId !== action.payload),
            };
            saveToLocalStorage(updatedState);
            return updatedState;

        case 'INCREASE_QUANTITY':
            updatedState = {
                ...state,
                items: state.items.map(item =>
                    item.productId === action.payload
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            };
            saveToLocalStorage(updatedState);
            return updatedState;

        case 'DECREASE_QUANTITY':
            updatedState = {
                ...state,
                items: state.items.map(item =>
                    item.productId === action.payload && item.quantity > 1
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ),
            };
            saveToLocalStorage(updatedState);
            return updatedState;

        case 'CLEAR_CART':
            updatedState = {...state, items: []};
            saveToLocalStorage(updatedState);
            return updatedState;

        default:
            return state;
    }
}


    return (
        
        <StateContext.Provider
        
        value={value}  
        >

            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);