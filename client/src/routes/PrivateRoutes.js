import { Title } from '@mantine/core'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppState } from '../context/AppContext'



function PrivateRoutes({ children, roles }) {
    const location = useLocation()
    const { state } = useAppState()

    const currentUserRole = state.users.us_role
    const hasNotRoles = ((roles && currentUserRole) && !roles.includes(currentUserRole))

    // TODO : resouds le probleme admin_cookie !== user__cookie le point d'entree de l'administrateur
    if (roles && (!state.isAuth && roles.includes("admin"))) return <Navigate to="/admin" replace state={{ from: location }} />

    if (!state.isAuth) return <Navigate to="/" replace state={{ from: location }} />
    if (hasNotRoles) return <Title>Pas Autoriser</Title>

    return children
}

export default PrivateRoutes