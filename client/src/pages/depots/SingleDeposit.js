import React, { useState } from 'react'
// style
import { Button, Group, Menu, Select, Text, TextInput } from '@mantine/core'
// comp
import AppTable from '../../components/table/AppTable'
import AddProduct from './AddProduct'
import DeleteProduct from './DeleteProduct'
import EditProduct from './EditProduct'
import Hero from '../../components/hero/Hero'
// global
import { useParams } from "react-router-dom"
import { useAppState } from '../../context/AppContext'
import { useQuery } from "react-query"
import { getDepotProduct } from '../../services/api'

function SingleDeposit() {
    const { useSelector } = useAppState()
    const { id } = useParams()
    const shopInfos = useSelector(state => state.shop)

    const [search, setSearch] = useState("")
    const [userAction, setUserAction] = useState({ add: false, remove: false, edit: false, data: {} })
    const handleAction = (type, data) => {
        switch (type) {
            case "add":
                setUserAction({ ...userAction, add: true })
                break
            case "edit":
                setUserAction({ ...userAction, edit: true, data })
                break
            default:
                setUserAction({ ...userAction, remove: true, data })

        }
    }

    const { data = [] } = useQuery(["product", id], ({ queryKey }) => getDepotProduct(queryKey[1]), { refetchOnWindowFocus: false })
    const productDatas = data


    const searchFilter = (data) => {
        const { pr_nom } = data
        if (!search) return data

        const searchProduct = (pr_nom.includes(search) || pr_nom.toLocaleLowerCase().includes(search))
        if (searchProduct) return data
    }

    // tableRows
    const tableRows = productDatas
        .filter(searchFilter)
        .map(data => {
            return (
                <tr key={data.pr_id}>
                    <td>{data.pr_nom}</td>
                    <td>{data.fo_nom}</td>
                    <td>{data.pr_qte}</td>
                    <td>{data.pr_prix}</td>
                    <td>{(data.pr_qte * data.pr_prix)}</td>
                    <td>{data.pr_unite}</td>
                    <td>
                        <Menu trigger="hover">
                            <Menu.Label>Options</Menu.Label>
                            <Menu.Item color="blue" onClick={() => handleAction("edit", data)}>Modifier</Menu.Item>
                            <Menu.Item color="orange" onClick={() => handleAction("delete", data)}>Annuler</Menu.Item>
                        </Menu>
                    </td>
                </tr>
            )
        })

    return (
        <div>
            <Hero title={"Depots : "}>
                <Text>Nombres de produits : {productDatas.length}</Text>
            </Hero>
            <main>
                <div>
                    <Group spacing={3}>
                        <Button onClick={() => handleAction("add")} m={5}>Ajouter</Button>
                        <TextInput
                            placeholder="Nom du produit"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Group>
                </div>
                <AppTable
                    title="Liste des produit de ce depot"
                    tableHead={["Nom du produit", "Fournisseur", "Quantité", "Prix", "Montant", "Unite", "Action"]}
                    tableRows={tableRows}
                />
                {/* modals */}
                <AddProduct
                    userAction={userAction}
                    setUserAction={setUserAction}
                    deId={parseInt(id, 10)}
                    boId={shopInfos.bo_id}
                />
                <DeleteProduct
                    userAction={userAction}
                    setUserAction={setUserAction}
                    data={userAction.data}
                />
                <EditProduct
                    userAction={userAction}
                    setUserAction={setUserAction}
                    data={userAction.data}
                />
            </main>
        </div>
    )
}

export default SingleDeposit