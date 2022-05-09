import React from 'react'
import { Link } from "react-router-dom"
// style
import { Text, Badge, Button, Title } from '@mantine/core'
// comp
import Hero from '../../components/hero/Hero'
import AppTable from '../../components/table/AppTable'
// global
import { useAppState } from '../../context/AppContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getShopDepotsTrash, removeDepot } from '../../services/api'

function DepositTrash() {
    const { useSelector } = useAppState()
    const shopId = useSelector((state) => state.shop.bo_id)

    // query and mutation
    const query = useQueryClient()
    const { mutate } = useMutation(["depots"], removeDepot)
    const { data = [] } = useQuery(["depots", shopId], ({ queryKey }) => getShopDepotsTrash(queryKey[1]), { refetchOnWindowFocus: false })

    const handleRestore = (deId, type) => {
        mutate({ deId, type }, {
            onSuccess: () => {
                query.invalidateQueries("depots")
            }
        })
    }

    // tableRows
    const tableRows = data.map(d => {
        return (
            <tr key={d.de_id}>
                <td>{d.de_nom}</td>
                <td>{d.de_desc}</td>
                <td>
                    <Button to={`/depots/${d.de_id}`} component={Link} m={5}>Contenu</Button>
                    <Button onClick={() => handleRestore(d.de_id, "act")} color="orange">Restaurer</Button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <Hero title="Corbeille">
                <Text>Recuperer les produits <Badge size="lg" color="orange">Annuler</Badge></Text>
            </Hero>
            <main>
                {data.length === 0 ?
                    <Text weight="bold">Aucun n'element</Text>
                    :
                    <AppTable
                        title="Recuperation des depots annuler"
                        tableHead={["Nom", "Description", "Action"]}
                        tableRows={tableRows}
                    />
                }
            </main>
        </div>
    )
}

export default DepositTrash