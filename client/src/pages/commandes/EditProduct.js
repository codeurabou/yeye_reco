import React, { useEffect } from "react"
import { Badge, Button, Modal, TextInput, Title } from "@mantine/core"
import useForm from "../../hooks/useForm"
// global
import { useAppState } from "../../context/AppContext"

function EditProduct({ userAction, setAction, data }) {
    const { useSelector, dispatch } = useAppState()
    const basket = useSelector((state) => state.basket)

    const { formValues, setValues } = useForm({
        qte: 0,
        prix: 100,
    })

    // TODO : Modifier le prix et la quantite
    const handleQte = (e, data) => {
        const { value, name } = e.target
        const finded = basket.find((d) => d.pr_id === data.pr_id)
        setValues(name, parseInt(value, 10))
        if (value <= 0) {
            finded.qte = 1
            dispatch({ type: "Basket/Edit" })
        } else {
            if (value.length <= 14) {
                finded.qte = parseInt(value, 10)
                dispatch({ type: "Basket/Edit" })
            }
        }
    }
    const handlePrice = (e, data) => {
        const { value, name } = e.target
        const finded = basket.find((d) => d.pr_id === data.pr_id)
        setValues(name, parseInt(value, 10))
        if (value < 100) {
            finded.prix = 100
            dispatch({ type: "Basket/Edit" })
        } else {
            if (value.length <= 14) {
                finded.prix = parseInt(value, 10)
                dispatch({ type: "Basket/Edit" })
            }
        }
    }

    useEffect(() => {
        setValues("qte", data.qte)
        setValues("prix", data.prix)
    }, [data])

    const handleClose = (e) => {
        if (e) e.preventDefault()
        setAction("edit", false)
    }
    return (
        <Modal
            title={<Title order={4}>Modifications des informations</Title>}
            opened={userAction.edit}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
            centered
        >
            <form onSubmit={handleClose}>
                <Title order={4}>
                    Montant Actuel : {data.qte} X {data.prix} ={" "}
                    {data.qte * data.prix}
                </Title>
                <TextInput
                    label="Ajuster la quantité"
                    placeholder="Modification de la quantité"
                    description="Taille Maximum 15 chiffres"
                    type="number"
                    name="qte"
                    value={formValues.qte}
                    onChange={(e) => handleQte(e, data)}
                />
                <TextInput
                    label="Ajuster le prix"
                    placeholder="Modification du prix"
                    description="15 chiffres Maximum"
                    type="number"
                    name="prix"
                    value={formValues.prix}
                    onChange={(e) => handlePrice(e, data)}
                />
                <Button mt={5} type="submit">
                    Modifier
                </Button>
            </form>
        </Modal>
    )
}

export default EditProduct
