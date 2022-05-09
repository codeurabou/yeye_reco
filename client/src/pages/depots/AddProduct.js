import React from 'react'
import { Alert, Button, Modal, Select, TextInput, Title } from '@mantine/core'
// global
import useForm from "../../hooks/useForm"
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getShopFournisseur, addProduct } from '../../services/api'


function AddProduct({ userAction, setUserAction, deId, boId }) {

    // form
    const initialValues = { nom: "", unite: "", qte: 1, prix: 100, de_id: deId, bo_id: boId, fo_id: 0 }
    const { formValues, formErrors, setFormErrors, setErrors, handleChange, setFormValues, cleanForm } = useForm(initialValues)


    const { mutate } = useMutation(["product"], addProduct)
    const query = useQueryClient()

    const handleSubmit = (e) => {
        e.preventDefault()
        validate(formValues, () => {
            mutate({ ...formValues }, {
                onSuccess: () => {
                    query.invalidateQueries("product")
                    cleanForm()
                    setUserAction({ ...userAction, add: false })
                },
                onError: (err) => {
                    const getErr = err?.response?.data?.message
                    setErrors("message", getErr)
                }
            })
        })
    }

    // fournisseurs
    const { data } = useQuery(["frs", boId], ({ queryKey }) => getShopFournisseur(queryKey[1]), { refetchOnWindowFocus: false })
    const frsData = data || []
    const adaptFrsData = frsData.map(d => {
        d.value = d.fo_id
        d.label = d.fo_nom
        return d
    })

    const validate = (values, cb) => {
        const err = {}
        const { fo_id, qte, prix } = values
        setFormErrors(err)

        if (parseInt(qte, 10) < 0) err.qte = "la quantite est supperieur ou égale a zero "
        if (fo_id === 0) err.foId = "fournisseur requis choisir un fournisseur"
        if (parseInt(prix, 10) < 100) err.prix = "le prix minimun commence de 100"

        // envoyer de la requete => variable[err]
        if (Object.entries(err).length === 0) cb()
    }

    return (
        <Modal
            title={<Title order={4}>Nouveau Produit</Title>}
            opened={userAction.add}
            closeOnClickOutside={false}
            // transition="none"
            onClose={() => setUserAction({ ...userAction, add: false })}
        >
            {formErrors.message && <Alert title={<Title order={4}>Erreur</Title>} color="red">{formErrors.message}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Nom du produit"
                    autoComplete="off"
                    autoCorrect="off"
                    name="nom"
                    required
                    onChange={handleChange}
                />
                <TextInput
                    label="Unite du produit"
                    autoComplete="off"
                    autoCorrect="off"
                    name="unite"
                    onChange={handleChange}
                    required
                    description="Exemple : kg,gr,litre,piece etc..."
                />
                <TextInput
                    label="La Quantite"
                    autoComplete="off"
                    autoCorrect="off"
                    type="number"
                    name="qte"
                    required
                    onChange={handleChange}
                    error={formErrors.qte}
                />
                <TextInput
                    label="Le Prix"
                    autoComplete="off"
                    autoCorrect="off"
                    type="number"
                    name="prix"
                    onChange={handleChange}
                    required
                    error={formErrors.prix}
                />
                <Select
                    data={adaptFrsData}
                    label="Choisir Le Fournisseur"
                    allowDeselect
                    required
                    description="Si le fournisseur n'existe pas créer dans la section mes fournisseur"
                    value={formValues.fo_id}
                    onChange={(value) => setFormValues({ ...formValues, fo_id: value })}
                    error={formErrors.foId}
                />
                <Button type="submit" mt={5}>Ajouter</Button>
            </form>
        </Modal>
    )
}

export default AddProduct