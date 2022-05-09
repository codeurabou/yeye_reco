import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
// style
import { Alert, Button, Group, Text, Title } from "@mantine/core"
// comp
import Hero from "../../components/hero/Hero"
import AppTable from "../../components/table/AppTable"
// global
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
    getAchatCommand,
    achatsReception,
    getAchatPdf,
} from "../../services/api"

function DetailsCmdFrs() {
    const navigate = useNavigate()
    const { id } = useParams()
    const acId = parseInt(id, 10)

    const { data: getCommands = [] } = useQuery(
        ["commande", acId],
        ({ queryKey }) => getAchatCommand(queryKey[1]),
        { refetchOnWindowFocus: false }
    )
    // mutation : reception
    const query = useQueryClient()
    const { mutate } = useMutation(["achat"], achatsReception)
    const [error, setError] = useState({})

    const handleReceive = () => {
        mutate(acId, {
            onSuccess: () => {
                query.invalidateQueries("achat")
                navigate("/commandes/fournisseurs")
            },
            onError: (err) => {
                if (err) {
                    const getErr = err.response.data.message
                    setError({ ...error, message: getErr })
                }
            },
        })
    }

    const tableRows = getCommands.map((c) => {
        return (
            <tr key={c.fc_id}>
                <td>{c.fc_nom}</td>
                <td>{c.fc_unite}</td>
                <td>{c.fc_qte}</td>
                <td>{c.fc_prix}</td>
                <td>{c.fc_prix * c.fc_qte}</td>
            </tr>
        )
    })

    const getSum = () => {
        let sum = 0
        for (const el of getCommands) {
            sum += el.fc_qte * el.fc_prix
        }
        return sum
    }

    return (
        <div>
            <Hero
                title="Details de l'achats"
                order={3}
                desc="Voir les details de l'achats"
            >
                <Text>Nombre de produit(s) : {getCommands.length}</Text>
            </Hero>
            {error.message && (
                <Alert
                    withCloseButton
                    onClose={() => setError({})}
                    title={<Title order={3}>Notification</Title>}
                >
                    {error.message}
                </Alert>
            )}
            <AppTable
                title={
                    <Title order={4}>
                        Liste des produits commandées avec une somme(s) de{" "}
                        {getSum()}{" "}
                    </Title>
                }
                tableHead={[
                    "Nom",
                    "Unite",
                    "Qte commander",
                    "Prix D'achat",
                    "Montant",
                ]}
                tableRows={tableRows}
            />

            <Group direction="column" spacing={0} position="right">
                <Button m={5} onClick={() => handleReceive()}>
                    Reception
                </Button>
                <Button m={5} onClick={() => getAchatPdf(acId)}>
                    Bon de livraison
                </Button>
            </Group>
        </div>
    )
}

export default DetailsCmdFrs
