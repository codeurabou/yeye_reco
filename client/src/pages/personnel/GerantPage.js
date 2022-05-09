import React, { useState } from 'react'
import { Link } from "react-router-dom"
// style
import { Badge, Button, Group, Text, TextInput } from '@mantine/core'
// comp
import Hero from '../../components/hero/Hero'
import AppTable from '../../components/table/AppTable'
// global
import { useAppState } from "../../context/AppContext"
import { useQuery } from "react-query"
import { getShopUser } from '../../services/api'
import AddGerant from '../fournisseurs/AddGerant'


function GerantPage() {
    const { useSelector } = useAppState()
    const shopInfos = useSelector(state => state.shop)

    const [opened, setOpened] = useState(false)

    const { data = [] } = useQuery(["ger", shopInfos.bo_id], ({ queryKey }) => getShopUser(queryKey[1]))


    // search
    const [search, setSearch] = useState("")
    const searchFilter = (data) => {
        if (!search) return data

        if (data.us_tel.includes(search)) return data
    }

    // tableRows
    const tableRows = data.filter(searchFilter).map(d => {
        return (
            <tr key={d.us_id}>
                <td>{d.us_prenom}</td>
                <td>{d.us_nom}</td>
                <td>{d.us_email}</td>
                <td>{d.us_tel}</td>
                <td>{d.disabled ? <Badge>Desactiver</Badge> : <Badge>Activer</Badge>}</td>
                <td>
                    <Button component={Link} to={`/personnels/gerants/${d.us_id}`}>Details</Button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <Hero title={"Mes Gerants"}>
                <Text>Nombres de gerants: {data.length} </Text>
            </Hero>
            <main>
                <div>
                    <Group>
                        <TextInput
                            placeholder="Entrez le numero de telephone"
                            autoComplete="off"
                            autoCorrect="off"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={() => setOpened(true)}>Nouveau Gerant</Button>
                    </Group>
                </div>
                <div>
                    <AppTable
                        tableHead={["Prenom", "Nom", "Email", "Telephone", "Etat du Compte", "Action"]}
                        title="Liste des gerants"
                        tableRows={tableRows}
                    />
                </div>
                {/* modals */}
                <AddGerant opened={opened} setOpened={setOpened} />
            </main>
        </div>
    )
}

export default GerantPage