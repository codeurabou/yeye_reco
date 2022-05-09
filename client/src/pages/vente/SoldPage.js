import React from "react"
import { Link } from "react-router-dom"
// style
import { Button, Group, Select, Text } from "@mantine/core"
// comp
import AppTable from "../../components/table/AppTable"
import Hero from "../../components/hero/Hero"
// global
import { useAppState } from "../../context/AppContext"
import { useQuery } from "react-query"
import { getShopVendre } from "../../services/api"

function SoldPage() {
    const { useSelector } = useAppState()
    const shopId = useSelector(state => state.shop.bo_id)

    // ** query
    const { data = [] } = useQuery(["vendres", shopId], ({ queryKey }) => getShopVendre(queryKey[1]), { refetchOnWindowFocus: false })
    console.log(data)

    // tableRows
    const tableRows = data.map(d => {
        return (
            <tr key={d.vend_id}>
                <td>{new Date(d.createdAt).toLocaleString()}</td>
                <td>{d.us_prenom} {d.us_nom}</td>
                <td>{d.cl_nom}</td>
                <td>{d.cl_tel}</td>
                <td>{d.cl_adr}</td>
                <td>
                    <Button m={5} component={Link} to={`/ventes/${d.vend_id}`}>Details</Button>
                    <Button color="orange" m={5}>Annuler</Button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <Hero title="Ventes">
                <Text>Nombres de ventes : </Text>
            </Hero>
            <main>
                <div>
                    <Group spacing={3}>
                        <Select data={[]} placeholder="Choisir le client" />
                        <Button m={5} component={Link} to="/ventes/add">Vendre</Button>
                        <Button m={5} color="red">Corbeille</Button>
                    </Group>
                    <AppTable
                        title="Liste des produits vendus "
                        tableHead={["Date", "Vendeur", "Client", "Telephone", "Adresse", "Action"]}
                        tableRows={tableRows}
                    />
                </div>
            </main>
        </div>
    )
}

export default SoldPage
