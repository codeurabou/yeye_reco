import React from "react"
import { Button, Card, Divider, Text, Title } from "@mantine/core"
// global
import { useAppState } from "../../context/AppContext"
function Product({ data }) {
    const { useSelector, dispatch } = useAppState()
    const basket = useSelector((state) => state.basket)

    const AddToBasket = (product) => {
        const exist = basket.find((data) => data.pr_id === product.pr_id)
        if (exist) {
            exist.qte++
            dispatch({ type: "Basket/Edit" })
        } else {
            dispatch({
                type: "Basket/Add",
                payload: {
                    product: {
                        // conforme au backend
                        pr_id: product.pr_id,
                        qte: 1,
                        prix: product.pr_prix,
                        nom: product.pr_nom, // frontend
                    },
                },
            })
        }
    }

    return (
        <Card
            m={5}
            shadow="lg"
            sx={(theme) => ({
                backgroundColor: theme.colors.blue[6],
                color: "white",
            })}
        >
            <Title order={3}>{data.pr_nom}</Title>
            <Divider mt={5} mb={5} />
            <Text>Quantité restante : {data.pr_qte}</Text>
            <Text>Prix : {data.pr_prix}</Text>
            <Text>Nombres d'achats : {data.pr_sold}</Text>
            <Button variant="white" onClick={() => AddToBasket(data)}>
                Ajouter au pannier
            </Button>
        </Card>
    )
}

export default Product
