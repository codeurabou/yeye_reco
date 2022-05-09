import React from 'react'
import { Modal, Title, Text, Badge, Divider, Button } from "@mantine/core"
// global
import { removeUserDroit } from '../../services/api'
import { useMutation, useQueryClient } from 'react-query'


function DeleteDroit({ userAction, setUserAction, data }) {

    const handleClose = () => setUserAction({ ...userAction, remove: false })

    const query = useQueryClient()
    const { mutate } = useMutation(["droit"], removeUserDroit)
    const handleDelete = () => {
        mutate(data.dr_id, {
            onSuccess: () => {
                query.invalidateQueries("droit")
                handleClose()
            }
        })
    }

    return (
        <Modal
            title={<Title order={4}>Retirer le droit</Title>}
            opened={userAction.remove}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
        >
            <Text size="lg">Dans
                <Badge size="lg">la fonctionnalités {data.dr_nom}</Badge> vous-voulez retirer
                <Badge size="lg">l'action {data.dr_action}</Badge>
            </Text>
            <Divider m={5} />
            <Button color="red" onClick={() => handleDelete()}>Oui Retirer</Button>
        </Modal>
    )
}

export default DeleteDroit