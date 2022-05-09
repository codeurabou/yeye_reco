import React, { useEffect } from 'react'
import { Alert, Button, Modal, Select, TextInput, Title } from "@mantine/core"
import useForm from "../../hooks/useForm"
// global
import { useQueryClient, useMutation } from "react-query"
import { editUserPaiement } from '../../services/api'

function EditPaiement({ userAction, setUserAction, years, months, data }) {

    const { pa_id } = data

    const intialValues = { mte: "", mois: 0, annee: 0 }
    const { formValues, formErrors, handleChange, setValues, setErrors, cleanForm } = useForm(intialValues)

    const query = useQueryClient()
    const { mutate } = useMutation(["paiement"], editUserPaiement)
    const handleSubmit = (e) => {
        e.preventDefault()
        mutate({ ...formValues, paId: pa_id }, {
            onSuccess: () => {
                query.invalidateQueries("paiement")
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

    useEffect(() => {
        setValues("mte", data.pa_mte)
    }, [data])

    const handleClose = () => setUserAction({ ...userAction, edit: false })
    return (
        <Modal
            title={<Title order={4}>Modifier les paiements</Title>}
            opened={userAction.edit}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
        >
            {formErrors.message && <Alert color="red" title={<Title order={4}>Erreur</Title>}>{formErrors.message}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Nouveau montant"
                    placeholder="Entrez le montant"
                    name="mte"
                    value={formValues.mte}
                    onChange={handleChange}
                />
                <Select
                    label="Annee"
                    data={years}
                    placeholder="Annee"
                    onChange={(value) => setValues("annee", value)}
                />
                <Select
                    label="Mois"
                    data={months}
                    placeholder="Mois"
                    onChange={(value) => setValues("mois", value)}
                />
                <Button type="submit" mt={5}>Modifier</Button>
            </form>
        </Modal>
    )
}

export default EditPaiement