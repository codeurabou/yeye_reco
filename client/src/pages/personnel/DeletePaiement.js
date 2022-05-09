import React from 'react'
import { Button, Modal, Title } from '@mantine/core'
import { useMutation, useQueryClient } from "react-query"
import { removeUserPaiment } from '../../services/api'


function DeletePaiement({ userAction, setUserAction, data }) {

    const { pa_id } = data

    const query = useQueryClient()
    const { mutate } = useMutation(["paiement"], removeUserPaiment)
    const handleDelete = () => {
        mutate(pa_id, {
            onSuccess: () => {
                query.invalidateQueries("paiement")
                handleClose()
            }
        })
    }

    const handleClose = () => setUserAction({ ...userAction, remove: false })
    return (
        <Modal
            title={<Title order={3}>Etez vous sur de supprimer ?</Title>}
            opened={userAction.remove}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
        >
            <div>
                <Button color="red" onClick={() => handleDelete()}>Oui Supprimer</Button>
            </div>
        </Modal>
    )
}

export default DeletePaiement