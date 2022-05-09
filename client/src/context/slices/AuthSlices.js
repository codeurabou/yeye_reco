const authInitialStates = false
const authReducers = (state = authInitialStates, action) => {
    switch (action.type) {
        case "Auth/OK":
            return state = true
        case "Auth/LOGOUT":
            return state = false
        default:
            return state
    }
}

export { authInitialStates, authReducers }