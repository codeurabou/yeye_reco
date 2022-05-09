const shopInitialStates = {}
const shopReducers = (state = shopInitialStates, action) => {
    switch (action.type) {
        // charger les informations du boutique de l'utiisateur courant (role(ger,prop))
        case "Shop/GET":
            return {
                ...state,
                ...action.payload.shop
            }
        default:
            return state
    }
}

export { shopInitialStates, shopReducers }