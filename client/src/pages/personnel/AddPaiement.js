import React from 'react'
import { Alert, Button, Modal, Select, TextInput, Title } from '@mantine/core'
import useForm from "../../hooks/useForm"
// global
import { getShopUser, addUserPaiement } from '../../services/api'
import { useMutation, useQuery, useQueryClient } from "react-query"

function AddPaiement({ userAction, setUserAction, months, years, boId }) {

    // form
    const initialValues = { mte: "", mois: 0, annee: 0, us_id: 0 }
    const { formValues, formErrors, handleChange, setValues, setFormErrors, setErrors } = useForm(initialValues)

    // query
    const { data = [], isLoading } = useQuery(["ger", boId], ({ queryKey }) => getShopUser(queryKey[1]), { refetchOnWindowFocus: false })

    const adaptedDatas = data.map(d => {
        d.label = `${d.us_prenom} ${d.us_nom}`
        d.value = d.us_id
        return d
    })

    // mutation
    const { mutate } = useMutation(["paiement"], addUserPaiement)
    const query = useQueryClient()
    const handleSubmit = (e) => {
        e.preventDefault()
        validate(formValues, () => {
            mutate({ ...formValues, bo_id: boId }, {
                onSuccess: () => {
                    query.invalidateQueries("paiement")
                    handleClose()
                },
                onError: (err) => {
                    if (err) {
                        const getErr = err.response.data.message
                        setErrors("message", getErr)
                    }
                }
            })
        })
    }

    const validate = (values, cb) => {
        const err = {}
        const { mois, annee, us_id, mte } = values
        setFormErrors(err)

        if (parseInt(mois, 10) === 0) err.mois = "le mois est requis"
        if (parseInt(annee, 10) === 0) err.annee = "l'annee est requis"
        if (parseInt(us_id) === 0) err.user = "choisir un utilisateur"
        if (parseInt(mte, 10) <= 0) err.mte = "le montant n'est pas negatif"

        // envoyer de la requete => variable[err]
        if (Object.entries(err).length === 0) cb()
    }

    const handleClose = () => setUserAction({ ...userAction, add: false })
    return (
        <Modal
            title={<Title order={3}>Nouveau Paiement</Title>}
            opened={userAction.add}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
        >
            {formErrors.message && <Alert title={<Title order={4}>Erreur</Title>}>{formErrors.message}</Alert>}
            <form onSubmit={handleSubmit}>
                <Select
                    label="Mois"
                    data={months}
                    value={formValues.mois}
                    onChange={(value) => setValues("mois", value)}
                    required
                    searchable
                    nothingFound={"Mois introuvable"}
                    error={formErrors.mois}
                />
                <Select
                    required
                    label="Annee"
                    data={years}
                    value={formValues.annee}
                    onChange={(value) => setValues("annee", value)}
                    searchable
                    nothingFound={"Annee introuvable"}
                    error={formErrors.annee}
                />
                <TextInput
                    type="number"
                    label="Montant"
                    required
                    name="mte"
                    value={formValues.mte}
                    onChange={handleChange}
                    error={formErrors.mte}
                />
                <Select
                    required
                    label="Choisir l'utilisateur"
                    data={adaptedDatas}
                    value={formValues.us_id}
                    onChange={(value) => setValues("us_id", value)}
                    error={formErrors.user}
                />
                <Button type="submit" mt={5}>Enregistrer</Button>
            </form>
        </Modal>
    )
}

export default AddPaiement