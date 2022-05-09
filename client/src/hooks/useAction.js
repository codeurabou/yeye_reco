import { useState } from 'react'

function useAction(initialValue) {

    const [userAction, setUserAction] = useState(initialValue)

    // setter
    const setAction = (key, value) => {
        setUserAction(prevState => {
            return { ...prevState, [key]: value }
        })
    }
    // getter
    const getAction = (key) => userAction[key]
    const clearAction = () => setUserAction(initialValue)

    return { userAction, setAction, setUserAction, getAction, clearAction }
}

export default useAction