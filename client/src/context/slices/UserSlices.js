const usersInitialStates = {}
// ne jamais agir sur le state mais une copie
const usersReducers = (state = usersInitialStates, action) => {
    switch (action.type) {
        case "Users/Login":
            return {
                ...state,
                ...action.payload.users
            }
        case "Users/Logout":
            return usersInitialStates
        default:
            return state
    }
}

export { usersInitialStates, usersReducers }