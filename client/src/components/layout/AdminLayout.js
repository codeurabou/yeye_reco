import React, { useState } from 'react'
import Cookies from "js-cookie"
import { useAppState } from "../../context/AppContext"
import { AppShell, Button, Navbar, ScrollArea, Text } from '@mantine/core'
import AppHeader from '../header/AppHeader'
import { Outlet, useNavigate } from 'react-router-dom'
import { NavElement } from './nav-element'

function AdminLayout({ children }) {
    const { dispatch } = useAppState()
    const [opened, setOpened] = useState(false)
    const navigate = useNavigate()

    const logOut = () => {
        dispatch({ type: "Auth/LOGOUT" })
        dispatch({ type: "Users/Logout" })
        Cookies.remove("yy_admin_token")
        navigate("/admin")
    }


    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            fixed
            header={<AppHeader />}
            navbar={
                <Navbar
                    hiddenBreakpoint="sm" // masquer le menu au quel niveau
                    hidden={!opened}
                    p="md"
                    width={{ sm: 230, lg: 270 }}
                >
                    <Navbar.Section><Text color="dimmed">Menu</Text></Navbar.Section>
                    <Navbar.Section component={ScrollArea} grow mx="-xs" px="xs">
                        <NavElement label="Accueil" route="/admin/dashboard/" />
                        <NavElement label="Nouveau utilisateur" route="/admin/dashboard/user/add" />
                        <NavElement label="Utilisateurs" route="/admin/dashboard/user/lists" />
                        <NavElement label="Compte desactiver" route="/admin/dashboard/user/disabled" />
                    </Navbar.Section>
                    <Navbar.Section>
                        <Button color="red" onClick={() => logOut()}>Se Deconnecter</Button>
                    </Navbar.Section>
                </Navbar>
            }
        >
            {/* outlet vs children (/app ou /something) */}
            {!children && <Outlet />}
            {children && children}
        </AppShell>
    )
}

export default AdminLayout