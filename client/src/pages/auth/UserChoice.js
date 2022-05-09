import React, { useState } from 'react'
import { useAppState } from '../../context/AppContext'
import { Modal, Title, Card, Button, Text } from "@mantine/core"
import Cookies from 'js-cookie'
import { useLocation, useNavigate } from 'react-router-dom'

function UserChoice({ multiChoice, setMultiChoice }) {

    const { dispatch } = useAppState()
    const navigate = useNavigate()
    const location = useLocation()

    const origin = location?.state?.from?.pathname || '/acceuil'
    return (
        <Modal
            title={<Title order={3}>Mes Boutiques</Title>}
            opened={multiChoice.isOpen}
            onClose={() => setMultiChoice({ ...multiChoice, isOpen: false })}
        >
            <Text></Text>
            <Card mt={1} shadow="lg" sx={(theme) => ({ backgroundColor: theme.colors.gray[7], color: "white" })}>
                {multiChoice.data.map((d, idx) => {
                    return (
                        <div key={idx}>
                            <Title order={4}>{d.bo_nom}</Title>
                            <Text>Telephone : {d.bo_tel}</Text>
                            <Text>Adresse : {d.bo_adr}</Text>
                            <Text>Eamil : {d.bo_email}</Text>
                            <Button
                                variant="white"
                                onClick={() => {
                                    dispatch({ type: "Shop/GET", payload: { shop: d } })
                                    // enregistrer les informations de la boutique en tant que cookie
                                    Cookies.set("yy_user_shop", JSON.stringify(d))
                                    navigate(origin)
                                }}
                            >je me connecte a cet boutique</Button>
                        </div>
                    )
                })}
            </Card>
        </Modal>
    )
}

export default UserChoice