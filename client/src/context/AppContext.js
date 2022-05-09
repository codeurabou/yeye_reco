import React, {
    createContext,
    useCallback,
    useContext,
    useReducer,
} from "react"
import reactCombineReducers from "react-combine-reducers"
import { instance } from "../axios"
import Cookies from "js-cookie"

// ** slice
import { authInitialStates, authReducers } from "./slices/AuthSlices"
import { usersInitialStates, usersReducers } from "./slices/UserSlices"
import { shopInitialStates, shopReducers } from "./slices/ShopSlices"
import { basketInitialStates, basketReducers } from "./slices/BasketSlices"

const GlobalContext = createContext()

function AppContext({ children }) {
    const [rootReducers, rootInitialValues] = reactCombineReducers({
        isAuth: [authReducers, authInitialStates],
        users: [usersReducers, usersInitialStates],
        shop: [shopReducers, shopInitialStates],
        // pannier (commandes)
        basket: [basketReducers, basketInitialStates]
    })
    const [state, dispatch] = useReducer(rootReducers, rootInitialValues)

    // get state properties : cb permet de retourner un element du state
    const useSelector = useCallback((cb) => cb(state), [state])

    // token-conf (global) => requete authentifié
    const token = Cookies.get("yy_user_token")
    instance.defaults.headers.common["authorization"] = `Bearer ${token}`

    // login
    const login = (values, cb) => {
        instance
            .post("/users_auth/login", { ...values })
            .then((res) => {
                // mise a jour des states charger les informations de l'utlisateur a chaud
                // debloquer les routes /
                dispatch({ type: "Auth/OK" })
                dispatch({ type: "Users/Login", payload: { users: res.data } }) // premier connexion (donnéé chaud)
                cb(null, res)
            })
            .catch((err) => cb(err))
    }

    const value = {
        state,
        dispatch,
        login,
        useSelector,
    }

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}

export default AppContext
export const useAppState = () => useContext(GlobalContext)
