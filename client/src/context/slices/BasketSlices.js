const basketInitialStates = []

const basketReducers = (state = basketInitialStates, action) => {
    switch (action.type) {
        case "Basket/Add":
            return [...state, { ...action.payload.product }]
        case "Basket/Edit":
            return [...state]
        case "Basket/Remove":
            const remove = state.filter((data) => data.pr_id !== action.payload.id)
            return [...remove]

        case "Basket/Clear":
            return basketInitialStates

        default:
            return state
    }
}

export { basketInitialStates, basketReducers }
