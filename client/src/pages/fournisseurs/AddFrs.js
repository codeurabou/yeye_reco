import React from 'react'
import { Alert, Button, Modal, TextInput, Title } from '@mantine/core'
import useForm from "../../hooks/useForm"
// global
import { useMutation, useQueryClient } from 'react-query'
import { addFournisseur } from '../../services/api'


function AddFrs({ userAction, setUserAction, boId }) {

    // form
    const initialValues = { nom: "", tel: "", adr: "", email: "", bo_id: boId }
    const { formValues, handleChange, cleanForm, formErrors, setErrors } = useForm(initialValues)

    const { mutate, isError } = useMutation(["frs"], addFournisseur)
    const query = useQueryClient()

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate({ ...formValues }, {
            onSuccess: () => {
                query.invalidateQueries("frs")
                cleanForm()
                setUserAction({ ...userAction, add: false })
            },
            onError: (err) => {
                const getErr = err?.response?.data?.message
                setErrors("message", getErr)
            }
        })
    }

    return (
        <Modal
            title={<Title order={3}>Nouveau Frs</Title>}
            opened={userAction.add}
            onClose={() => setUserAction({ ...userAction, add: false })}
            closeOnClickOutside={false}
        >
            {isError && <Alert color="red" title={<Title order={4}>Erreur</Title>}>{formErrors.message}</Alert>}
            <div>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Nom"
                        placeholder="Ex : Barra Muso"
                        name="nom"
                        value={formValues.nom}
                        onChange={handleChange}
                        required
                    />
                    <TextInput
                        label="Telephone"
                        placeholder="Ex : 0023 __-__-__-__"
                        name="tel"
                        value={formValues.tel}
                        onChange={handleChange}
                        required
                    />
                    <TextInput
                        label="Adresse"
                        placeholder="Hamdallaye Aci 2000"
                        name="adr"
                        value={formValues.adr}
                        onChange={handleChange}
                        required
                    />
                    <TextInput
                        type="email"
                        label="Email"
                        placeholder='barramusso@gmail.com'
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" mt={5}>Enregistrer</Button>
                </form>
            </div>
        </Modal>
    )
}

export default AddFrs