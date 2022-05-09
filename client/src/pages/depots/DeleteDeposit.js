import React from 'react'
import { Button, Modal, Text } from '@mantine/core'
// global
import { removeDepot } from '../../services/api'
import { useMutation, useQueryClient } from 'react-query'


function DeleteDeposit({ userAction, setUserAction, data }) {


    const { mutate } = useMutation(removeDepot)
    const query = useQueryClient()

    const handleDelete = () => { // no type default : des => desactiver
        mutate({ deId: data.id }, {
            onSuccess: () => {
                query.invalidateQueries("depots")
                setUserAction({ ...userAction, remove: false })
            }
        })
    }


    return (
        <Modal
            title={<Text order={3}>Etes vous sur de supprimer ?</Text>}
            opened={userAction.remove}
            onClose={() => setUserAction({ ...userAction, remove: false })}
            closeOnClickOutside={false}
        >
            <Button color="red" onClick={() => handleDelete()}>Supprimer le depot {data.title}</Button>
        </Modal>
    )
}

export default DeleteDeposit