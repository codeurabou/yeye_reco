import React, { useEffect } from 'react'
// style
import { Modal, Title, TextInput, PasswordInput, Button, Alert } from "@mantine/core"
import useForm from "../../hooks/useForm"
// global
import { addGerant } from '../../services/api'
import { useMutation, useQueryClient } from 'react-query'
import { useAppState } from '../../context/AppContext'

function AddGerant({ opened, setOpened }) {
    const { useSelector } = useAppState()
    const shopId = useSelector(state => state.shop.bo_id)
    const shopInfos = useSelector(state => state.shop)

    const handleClose = () => setOpened(false)

    // form
    const initialValues = { prenom: "", nom: "", email: "", pass: "12345", tel: "" }
    const { formValues, formErrors, handleChange, cleanForm, setErrors, setValues } = useForm(initialValues)

    // mutation
    const query = useQueryClient()
    const { mutate } = useMutation(["ger"], addGerant)

    const handleSubmit = (e) => {
        e.preventDefault()
        // creation d'un compte gerant
        mutate({ ...formValues, bo_id: shopId, role: "ger" }, {
            onSuccess: () => {
                query.invalidateQueries("ger")
                cleanForm()
                handleClose()
            },
            onError: (err) => {
                if (err) {
                    const getErr = err.response.data.message
                    setErrors("message", getErr)
                }
            }
        })
    }

    return (
        <Modal
            title={<Title order={4}>Nouveau Gerant</Title>}
            opened={opened}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
        >
            {formErrors.message && <Alert title={<Title order={4}>Erreur</Title>} color="red">{formErrors.message}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextInput
                    autoComplete="off"
                    autoCorrect="off"
                    label="Prenom"
                    type="text"
                    name="prenom"
                    placeholder="Nom Boutique + Nom Gerant"
                    value={formValues.prenom}
                    onChange={handleChange}
                    required
                />
                <TextInput
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Ex : Coulibaly , Konate"
                    label="Nom"
                    type="text"
                    name="nom"
                    value={formValues.nom}
                    onChange={handleChange}
                    required
                />
                <TextInput
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="moussa-boutique-g1@gmail.com"
                    type="email"
                    label="Email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                />
                <PasswordInput
                    autoComplete="off"
                    autoCorrect="off"
                    label="Mot de passe"
                    name="pass"
                    value={formValues.pass}
                    onChange={handleChange}
                    placeholder="Entrez ici le mot de passe"
                    required
                />
                <TextInput
                    autoComplete="off"
                    autoCorrect="off"
                    type="tel"
                    label="Telephone"
                    name="tel"
                    placeholder="Le Numero de telephone"
                    value={formValues.tel}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" mt={5}>Ajouter</Button>
            </form>
        </Modal>
    )
}

export default AddGerant