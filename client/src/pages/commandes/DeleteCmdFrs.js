import React from "react"
import { Alert, Button, Modal, Text, Title } from "@mantine/core"

// global
import { useMutation, useQueryClient } from "react-query"
import { removeShopAchats } from "../../services/api"

function DeleteCmdFrs({ userAction, setAction, data }) {
    const query = useQueryClient()
    const { mutate } = useMutation(["achat"], removeShopAchats)
    const handleDelete = () => {
        mutate(data.ac_id, {
            onSuccess: () => {
                query.invalidateQueries("achat")
                handleClose()
            },
        })
    }

    const handleClose = () => setAction("remove", false)
    return (
        <Modal
            title={
                <Title order={4}>
                    Etez-vous sur de supprimer de l'achats ?
                </Title>
            }
            opened={userAction.remove}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
        >
            <Alert m={5} color="red">
                <Text>
                    La suppression de l'achat entraine la suppression de tous
                    les produits commandées lors de cet achat
                </Text>
            </Alert>
            <Button color="red" onClick={() => handleDelete()}>
                Supprimer
            </Button>
        </Modal>
    )
}

export default DeleteCmdFrs
