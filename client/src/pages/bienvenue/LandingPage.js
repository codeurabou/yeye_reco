import React, { useEffect } from 'react'
import { Group, Text, Timeline, Title } from '@mantine/core'
import Login from "../auth/Login"
import { useMediaQuery } from '@mantine/hooks'
import { decodeToken } from "react-jwt"
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppState } from '../../context/AppContext'
import Cookies from "js-cookie"

function LandingPage() {

    const { dispatch, useSelector } = useAppState()

    const location = useLocation()
    const navigate = useNavigate("")
    const matches = useMediaQuery('(max-width:826px)')



    // saved cookie : pour la persistence de donnée
    const getUserToken = Cookies.get("yy_user_token")
    const getShopToken = Cookies.get("yy_user_shop")

    useEffect(() => {
        if (getUserToken && getShopToken) {
            const decodedToken = decodeToken(getUserToken).users
            const parseShopDatas = JSON.parse(getShopToken)
            dispatch({ type: "Shop/GET", payload: { shop: parseShopDatas } })
            dispatch({ type: "Users/Login", payload: { users: { ...decodedToken } } })
            dispatch({ type: "Auth/OK" })
            // origin
            const origin = location?.state?.from?.pathname || '/acceuil'
            navigate(origin)
        }
    }, [getUserToken, getShopToken, dispatch, navigate, location])

    return (
        <div>
            <Group
                direction={matches ? "column" : "row"}
                spacing={(matches) ? 50 : 100}
                style={{ height: "100vh" }}
                align="center"
                position="center">
                <div>
                    <Title>Bievenue</Title>
                    <Text size="lg">yeye est une application de gestion</Text>
                    <Timeline active={4} m={5} bulletSize={24}>
                        <Timeline.Item title="Boutique" />
                        <Timeline.Item title="Alimentation" />
                        <Timeline.Item title="Service" />
                        <Timeline.Item title="Autres" />
                    </Timeline>
                </div>
                <Login />
            </Group>
        </div>
    )
}

export default LandingPage
