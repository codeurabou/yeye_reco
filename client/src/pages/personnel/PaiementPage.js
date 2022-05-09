import React, { useState } from 'react'
// comp
import { Button, Divider, Group, Select, Text, Title } from "@mantine/core"
import AppTable from '../../components/table/AppTable'
import DeletePaiement from './DeletePaiement'
import AddPaiement from './AddPaiement'
import EditPaiement from './EditPaiement'
import { months } from '../../mock'
// global
import { useAppState } from "../../context/AppContext"
import { useQuery } from "react-query"
import { getShopPaiement } from '../../services/api'


function PaiementPage() {
    const { useSelector } = useAppState()
    const shopId = useSelector(state => state.shop.bo_id)

    const [userAction, setUserAction] = useState({ add: false, edit: false, show: false, remove: false, data: {} })
    const handleAction = (type, data) => {
        switch (type) {
            case "add":
                setUserAction({ ...userAction, add: true })
                break
            case "show":
                setUserAction({ ...userAction, show: true, data })
                break
            case "edit":
                setUserAction({ ...userAction, edit: true, data })
                break
            default:
                setUserAction({ ...userAction, remove: true, data })
        }
    }

    // query
    const { data = [] } = useQuery(["paiement", shopId], ({ queryKey }) => getShopPaiement(queryKey[1]), { refetchOnWindowFocus: false })

    // search
    const [search, setSearch] = useState({ annee: null, mois: null })
    const searchFilter = (data) => {
        const { mois, annee } = search
        if (!mois && !annee) return data
        if (data.annee === annee || data.mois === mois) return data
    }

    // tableRows
    const tableRows = data.filter(searchFilter).map(d => {
        return (
            <tr key={d.pa_id}>
                <td>{new Date(d.createdAt).toLocaleString()}</td>
                <td>{d.us_prenom}</td>
                <td>{d.us_nom}</td>
                <td>{d.pa_mte}</td>
                <td>{months.find(m => m.value === d.mois).label}</td>
                <td>{d.annee}</td>

                <td>
                    <Button m={5} onClick={() => handleAction("edit", d)}>Modifier</Button>
                    <Button m={5} onClick={() => handleAction("del", d)} color="orange">Annuler</Button>
                </td>
            </tr>
        )
    })

    // mock_year
    const years = []
    const mockYears = () => {
        const currentYears = new Date().getUTCFullYear()
        for (let i = 2000; i <= currentYears; i++) {
            const optionObj = { value: i, label: `${i}` }
            years.push(optionObj)
        }
    }
    mockYears()

    const getSum = () => {
        let sum = 0
        for (const element of data) sum += element.pa_mte
        return sum
    }

    return (
        <div>
            <header>
                <Title>Paiments</Title>
                <Text>Sommes des paiements : {getSum()}</Text>
                <Divider />
            </header>
            <main>
                <Group m={5}>
                    <Select
                        searchable
                        nothingFound="Mois Introuvable"
                        clearable
                        placeholder="Mois"
                        data={months}
                        onChange={(value) => setSearch({ ...search, mois: value })}
                    />
                    <Select
                        searchable
                        nothingFound="Annee Introuvable"
                        clearable
                        placeholder="Annee"
                        data={years}
                        onChange={(value) => setSearch({ ...search, annee: value })}
                    />
                    <Button onClick={() => handleAction("add")}>Nouveau paiement</Button>
                </Group>
                <AppTable
                    tableHead={["Date", "Prenom", "Nom", "Montant", "Mois", "Annee", "Action"]}
                    tableRows={tableRows}
                />
                {/* modals */}
                <AddPaiement
                    years={years}
                    months={months}
                    userAction={userAction}
                    setUserAction={setUserAction}
                    boId={shopId}
                />
                <EditPaiement
                    userAction={userAction}
                    setUserAction={setUserAction}
                    years={years}
                    months={months}
                    data={userAction.data}
                />
                <DeletePaiement
                    userAction={userAction}
                    setUserAction={setUserAction}
                    data={userAction.data}
                />
            </main>
        </div>
    )
}

export default PaiementPage