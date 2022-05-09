import React, { useEffect } from 'react'
import { Divider, Footer, Group, Text, Title } from '@mantine/core'
import AdminLogin from '../auth/AdminLogin'
import Cookies from 'js-cookie'
import { useAppState } from '../../context/AppContext'
import { decodeToken } from "react-jwt"
import { useLocation, useNavigate } from 'react-router-dom'

function AdminLanding() {

    const { dispatch } = useAppState()
    const location = useLocation()
    const navigate = useNavigate()

    // saved cookie : admin based cookie redirection with entry point
    const origin = location?.state?.from?.pathname || "/admin/dashboard"
    const getAdminToken = Cookies.get("yy_admin_token")

    useEffect(() => {
        if (getAdminToken) {
            const decodedToken = decodeToken(getAdminToken).users
            dispatch({ type: "Users/Login", payload: { users: { ...decodedToken } } })
            dispatch({ type: "Auth/OK" })
            // origin 
            navigate(origin)
        }
    }, [])



    return (
        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", height: "100vh" }}>
            <Group align="center" position='center' spacing={94} style={{ height: "90vh" }}>
                <div>
                    <h3>Bienvenue</h3>
                    <p>Page d'administration globale</p>
                </div>
                <AdminLogin />
            </Group>
            <Footer p={5} sx={(theme) => ({ backgroundColor: theme.colors.blue[6] })} style={{ color: "white" }}>
                <Title order={2}>Techky</Title>
                <Divider mb={5} />
                <Text>Email : codeurabou@gmail.com</Text>
                <Text>Addresse : Hamdallaye ACI 2000</Text>
                <Text>Contact : 94865879</Text>
            </Footer>
        </div>
    )
}

export default AdminLanding