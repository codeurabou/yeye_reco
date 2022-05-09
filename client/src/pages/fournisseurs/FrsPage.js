import React, { useState } from 'react'
import { Button, Divider, Group, Text, TextInput, Title } from "@mantine/core"
import { Link } from 'react-router-dom'
// comp
import AppTable from '../../components/table/AppTable'
import AddFrs from './AddFrs'
import EditFrs from './EditFrs'
import DeleteFrs from './DeleteFrs'
import DetailsFrs from './DetailsFrs'
// global
import { useAppState } from "../../context/AppContext"
import { useQuery } from "react-query"
import { getShopFournisseur } from '../../services/api'


function FrsPage() {
    const { useSelector } = useAppState()
    const shopInfos = useSelector(state => state.shop)

    const [userAction, setUserAction] = useState({ add: false, edit: false, show: false, remove: false, data: {} })
    const { data=[] } = useQuery(["frs", shopInfos.bo_id], ({ queryKey }) => getShopFournisseur(queryKey[1]), { refetchOnWindowFocus: false })
  

    const handleAction = (type, data) => {
        switch (type) {
            case "add":
                setUserAction({ ...userAction, add: true })
                break
            case "edit":
                setUserAction({ ...userAction, edit: true, data })
                break
            case "show":
                setUserAction({ ...userAction, show: true, data })
                break
            default:
                setUserAction({ ...userAction, remove: true, data })
        }
    }

    // search
    // note : avec le || il le faut que le premier soit vrai pour aller au deuxieme => algorithme de recherche
    const [search, setSearch] = useState({ nom: "", tel: "" })
    const searchFilter = (data) => {
        const { fo_nom, fo_tel } = data
        if (!search.nom && !search.tel) return data

        // algorithme de recherche interne
        const nameSearch = fo_nom.includes(search.nom) || fo_nom.toLocaleLowerCase().includes(search.nom)
        const telSearch = fo_tel.includes(search.tel)
        if (nameSearch && telSearch) return data
    }

    // tableRows
    const tableRows = data.filter(searchFilter).map(data => {
        return (
            <tr key={data.fo_id}>
                <td>{data.fo_nom}</td>
                <td>{data.fo_tel}</td>
                <td>{data.fo_adr}</td>
                <td>{data.fo_email}</td>
                <td>
                    <Button onClick={() => handleAction("show", data)} m={5}>Details</Button>
                    <Button onClick={() => handleAction("edit", data)} m={5}>Modifier</Button>
                    <Button onClick={() => handleAction("delete", data)} m={5} color="orange">Annuler</Button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <header>
                <Title>Fournisseurs</Title>
                <Text>Nombres de fournisseurs : {data.length} </Text>
                <Divider />
            </header>
            <main>
                <div>
                    <Group m={5} spacing={3}>
                        <TextInput
                            autoCorrect="off"
                            autoComplete="off"
                            placeholder="Ex : Aliou Diallo"
                            value={search.nom}
                            onChange={(e) => setSearch({ ...search, nom: e.target.value })}
                        />
                        <TextInput
                            type="tel"
                            placeholder="Ex : 73535261"
                            autoCorrect="off"
                            autoComplete="off"
                            value={search.tel}
                            onChange={(e) => setSearch({ ...search, tel: e.target.value })}
                        />
                        <Button onClick={() => handleAction("add")}>Nouveau Frs</Button>
                        <Button component={Link} to="/fournisseurs/trash" color="red">Corbeille</Button>
                    </Group>
                    <AppTable
                        tableHead={["Nom", "Telephone", "Adresse", "Email", "Action"]}
                        tableRows={tableRows}
                    />
                    {/* modal */}
                    <AddFrs
                        userAction={userAction}
                        setUserAction={setUserAction}
                        boId={shopInfos.bo_id}
                    />
                    <EditFrs
                        userAction={userAction}
                        setUserAction={setUserAction}
                        data={userAction.data}
                    />
                    <DeleteFrs
                        userAction={userAction}
                        setUserAction={setUserAction}
                        data={userAction.data}
                    />
                    <DetailsFrs
                        userAction={userAction}
                        setUserAction={setUserAction}
                        data={userAction.data}
                    />
                </div>
            </main>
        </div>
    )
}

export default FrsPage