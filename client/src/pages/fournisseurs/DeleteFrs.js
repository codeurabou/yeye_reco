import React from 'react'
import { Button, Modal, Title } from '@mantine/core'
// global
import { useMutation, useQueryClient } from 'react-query'
import { deleteFournisseur } from '../../services/api'


function DeleteFrs({ userAction, setUserAction, data }) {

    const { mutate } = useMutation(["frs"], deleteFournisseur)
    const query = useQueryClient()

    const handleDelete = () => {
        mutate({ foId: data.fo_id }, {
            onSuccess: () => {
                query.invalidateQueries("frs")
                setUserAction({ ...userAction, remove: false })
            }
        })
    }

    return (
        <Modal
            title={<Title order={3}>Etes-vous sur de supprimer ?</Title>}
            opened={userAction.remove}
            onClose={() => setUserAction({ ...userAction, remove: false })}
            closeOnClickOutside={false}
        >
            <Button onClick={() => handleDelete()} color="red">Supprimer le fournisseur {data.fo_nom}</Button>
        </Modal>
    )
}

export default DeleteFrs