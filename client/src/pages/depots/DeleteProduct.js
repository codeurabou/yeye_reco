import React from 'react'
import { Button, Modal, Title } from '@mantine/core'
// global
import { useMutation, useQueryClient } from 'react-query'
import { removeProduct } from '../../services/api'

function DeleteProduct({ userAction, setUserAction, data }) {

    const { pr_id, pr_nom } = data

    const { mutate } = useMutation(["product"], removeProduct)
    const query = useQueryClient()

    const handleDelete = () => {
        mutate(pr_id, {
            onSuccess: () => {
                query.invalidateQueries("product")
                setUserAction({ ...userAction, remove: false })
            }
        })
    }

    return (
        <Modal
            title={<Title order={4}>Etez vous sur de supprimer  :  ?</Title>}
            opened={userAction.remove}
            onClose={() => setUserAction({ ...userAction, remove: false })}
            closeOnClickOutside={false}
        >
            <Button onClick={() => handleDelete()} color="red">Supprimer le produit {pr_nom}</Button>
        </Modal>
    )
}

export default DeleteProduct