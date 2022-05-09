import React, { useEffect } from 'react'
import { Alert, Button, Modal, TextInput, Title } from '@mantine/core'
import useForm from "../../hooks/useForm"
// global
import { editFournisseur } from '../../services/api'
import { useMutation, useQueryClient } from 'react-query'


function EditFrs({ userAction, setUserAction, data }) {


    // form
    const initialValues = { nom: "", tel: "", adr: "", email: "" }
    const { formValues, formErrors, handleChange, cleanForm, setValues, setErrors } = useForm(initialValues)

    const query = useQueryClient()
    const { mutate, isError } = useMutation(["frs"], editFournisseur)

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate({ ...formValues, foId: data.fo_id }, {
            onSuccess: () => {
                query.invalidateQueries("frs")
                cleanForm()
                setUserAction({ ...userAction, edit: false })
            },
            onError: (err) => {
                const getErr = err?.response?.data?.message
                setErrors("message", getErr)
            }
        })
    }

    // effect : valeur par defaut
    useEffect(() => {
        setValues("nom", data.fo_nom)
        setValues("tel", data.fo_tel)
        setValues("adr", data.fo_adr)
        setValues("email", data.fo_email)
    }, [data])


    return (
        <Modal
            title={<Title order={3}>Modifier Fournisseurs</Title>}
            opened={userAction.edit}
            onClose={() => setUserAction({ ...userAction, edit: false })}
            closeOnClickOutside={false}
        >
            {isError && <Alert color="red" title={<Title order={4}>Erreur</Title>}>{formErrors.message}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Nom"
                    autoComplete='off'
                    autoCorrect='off'
                    placeholder='Entrez le nouveau nom'
                    name="nom"
                    value={formValues.nom}
                    onChange={handleChange}
                />
                <TextInput
                    type="tel"
                    label="Numero Telephone"
                    placeholder="Entrez le nouveau numero de telephone"
                    name="tel"
                    value={formValues.tel}
                    onChange={handleChange}
                />
                <TextInput
                    label="Adresse"
                    placeholder="Entrez la nouvelle adresse"
                    name="adr"
                    value={formValues.adr}
                    onChange={handleChange}
                />
                <TextInput
                    type="email"
                    label="Email"
                    placeholder="Entrez le nouveau addresse email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                />
                <Button type="submit" mt={5}>Enregistrer</Button>
            </form>
        </Modal>
    )
}

export default EditFrs