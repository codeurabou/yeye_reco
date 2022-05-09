import React, { useEffect } from 'react'
import { Button, Modal, Select, TextInput, Title } from '@mantine/core'
import useForm from '../../hooks/useForm'
import { useParams } from 'react-router-dom'
// global
import { useAppState } from "../../context/AppContext"
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getShopFournisseur, getShopDepots, editProduct } from '../../services/api'

function EditProduct({ userAction, setUserAction, data }) {

    const { useSelector } = useAppState()
    const shopInfos = useSelector(state => state.shop)
    const { id } = useParams()

    // form
    const initialValues = { nom: "", unite: "", qte: "", prix: "", fo_id: 0, de_id: parseInt(id, 10) }
    const { formValues, formErrors, handleChange, setFormValues, setValues, setFormErrors, setErrors, cleanForm } = useForm(initialValues)

    const getQuery = ({ queryKey }, cb) => cb(queryKey[1])
    const adaptSelect = (data = [], vAttr = "", lAttr = "") => {
        const datas = data.map(d => {
            d.value = d[vAttr]
            d.label = d[lAttr]
            return d
        })
        return datas
    }
    const { data: frsData = [] } = useQuery(["frs", shopInfos.bo_id], (query) => getQuery(query, getShopFournisseur), { refetchOnWindowFocus: false })
    const { data: depotData = [] } = useQuery(["depots", shopInfos.bo_id], (query) => getQuery(query, getShopDepots), { refetchOnWindowFocus: false })

    // query
    const query = useQueryClient()
    const { mutate } = useMutation(["product"], editProduct)

    const handleSubmit = (e) => {
        e.preventDefault()
        validate(formValues, () => {
            mutate({ ...formValues, prId: data.pr_id }, {
                onSuccess: () => {
                    query.invalidateQueries("product")
                    cleanForm()
                    setUserAction({ ...userAction, edit: false })
                },
                onError: (err) => {
                    const getErr = err?.response?.data?.message
                    setErrors("message", getErr)
                }
            })
        })
    }


    // validation + envoie requete
    const validate = (values, cb) => {
        const err = {}
        const { qte, prix } = values
        setFormErrors(err)

        if (parseInt(qte, 10) < 0) err.qte = "la quantite est supperieur ou égale a zero "
        if (parseInt(prix, 10) < 100) err.prix = "le prix minimun commence de 100"

        // envoyer de la requete => variable[err]
        if (Object.entries(err).length === 0) cb()
    }

    // effect : dv
    useEffect(() => {
        setValues("nom", data.pr_nom)
        setValues("unite", data.pr_unite)
        setValues("qte", data.pr_qte)
        setValues("prix", data.pr_prix)
    }, [data])


    return (
        <Modal
            title={<Title order={3}>Modification </Title>}
            opened={userAction.edit}
            onClose={() => setUserAction({ ...userAction, edit: false })}
            closeOnClickOutside
        >
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Nouveau nom"
                    autoComplete="off"
                    autoCorrect="off"
                    name="nom"
                    value={formValues.nom}
                    onChange={handleChange}
                />
                <TextInput
                    label="Nouvelle Unite"
                    autoComplete="off"
                    autoCorrect="off"
                    name="unite"
                    value={formValues.unite}
                    onChange={handleChange}
                />
                <TextInput
                    type="number"
                    label="Nouvelle Quantite"
                    autoComplete="off"
                    autoCorrect="off"
                    name="qte"
                    value={formValues.qte}
                    onChange={handleChange}
                    error={formErrors.qte}
                />
                <TextInput
                    type="number"
                    label="Nouveau Prix"
                    autoComplete="off"
                    autoCorrect="off"
                    name="prix"
                    value={formValues.prix}
                    onChange={handleChange}
                    error={formErrors.prix}
                />
                <Select
                    data={adaptSelect(frsData, "fo_id", "fo_nom")}
                    value={formValues.fo_id}
                    label="Choisir le nouveau frs"
                    onChange={(value) => setFormValues({ ...formValues, fo_id: value })}
                />
                <Select
                    data={adaptSelect(depotData, "de_id", "de_nom")}
                    value={formValues.de_id}
                    label="Changer de depots"
                    onChange={(value) => setFormValues({ ...formValues, de_id: value })}
                />
                <Button type="submit" mt={5}>Enregistrer</Button>
            </form>
        </Modal>
    )
}

export default EditProduct