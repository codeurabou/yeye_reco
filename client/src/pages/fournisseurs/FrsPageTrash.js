import React from 'react'
// style
import { Badge, Button, Text } from '@mantine/core'
// comp
import Hero from '../../components/hero/Hero'
import AppTable from '../../components/table/AppTable'
// global
import { useAppState } from '../../context/AppContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { deleteFournisseur, getShopFournisseurTrash } from '../../services/api'

function FrsPageTrash() {
    const { useSelector } = useAppState()
    const shopId = useSelector((state) => state.shop.bo_id)

    // query and mutation
    const query = useQueryClient()
    const { mutate } = useMutation(["frs"], deleteFournisseur)
    const { data = [] } = useQuery(["frs", shopId], ({ queryKey }) => getShopFournisseurTrash(queryKey[1]), { refetchOnWindowFocus: false })

    const handleRestore = (foId, type) => {
        mutate({ foId, type }, {
            onSuccess: () => {
                query.invalidateQueries("frs")
            }
        })
    }

    // tableRows
    const tableRows = data.map(d => {
        return (
            <tr key={d.fo_id}>
                <td>{d.fo_nom}</td>
                <td>{d.fo_tel}</td>
                <td>{d.fo_adr}</td>
                <td>{d.fo_email}</td>
                <td>
                    <Button onClick={() => handleRestore(d.fo_id, "act")} m={5} color="orange">Restaurer</Button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <Hero title="Corbeille">
                <Text>Recuperer les fournisseurs <Badge color="orange">annuler</Badge></Text>
            </Hero>
            <main>
                <AppTable
                    tableHead={["Nom", "Telephone", "Adresse", "Email", "Action"]}
                    tableRows={tableRows}
                />
            </main>
        </div>
    )
}

export default FrsPageTrash