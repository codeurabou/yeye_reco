import React, { useEffect, } from 'react'
import { Button, Modal, Textarea, TextInput, Title } from '@mantine/core'
import useForm from '../../hooks/useForm'
// global
import { editDepot } from '../../services/api'
import { useMutation, useQueryClient } from 'react-query'

function EditDeposit({ userAction, setUserAction, data }) {

    // form
    const initialValues = { nom: "", desc: "", }
    const { formValues, handleChange, setValues, cleanForm } = useForm(initialValues)

    const { mutate } = useMutation(["depots"], editDepot)
    const queryClient = useQueryClient()

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate({ ...formValues, deId: data.id }, {
            onSuccess: () => {
                queryClient.invalidateQueries("depots")
                cleanForm()
                setUserAction({ ...userAction, edit: false })
            },
        })
    }


    // effect
    useEffect(() => {
        setValues("nom", data.title)
        setValues("desc", data.desc)
    }, [data]) // bugs corrigés

    return (
        <Modal
            title={<Title order={4}>Modifier le depot {data.title}</Title>}
            opened={userAction.edit}
            onClose={() => setUserAction({ ...userAction, edit: false })}
            closeOnClickOutside={false}
        >
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Nouveau Nom"
                    name="nom"
                    value={formValues.nom}
                    onChange={handleChange}
                />
                <Textarea
                    spellCheck={false}
                    label="Nouvelle Description"
                    name="desc"
                    value={formValues.desc}
                    onChange={handleChange}
                />
                <Button type="submit" mt={5}>Modifier</Button>
            </form>
        </Modal>
    )
}

export default EditDeposit