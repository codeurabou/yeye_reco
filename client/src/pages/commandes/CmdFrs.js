import React, { useState } from "react"
import { Link } from "react-router-dom"
import useAction from "../../hooks/useAction"
import { adaptSelect } from "../../utils"
// style
import { Badge, Button, Group, Select, Text } from "@mantine/core"
// comp
import Hero from "../../components/hero/Hero"
import AppTable from "../../components/table/AppTable"
import EditCmdFrs from "./EditCmdFrs"
// global : api
import { getShopAchats, getShopFournisseur } from "../../services/api"
import { useQuery } from "react-query"
import { useAppState } from "../../context/AppContext"
import DeleteCmdFrs from "./DeleteCmdFrs"

function CmdFrs() {
    const { useSelector } = useAppState()
    const shopId = useSelector((state) => state.shop.bo_id)

    const { userAction, setAction } = useAction({ edit: false, remove: false, data: {}, })
    const handleAction = (type, data) => {
        switch (type) {
            case "edit":
                setAction("edit", true)
                setAction("data", data)
                break
            default:
                setAction("remove", true)
                setAction("data", data)
                break
        }
    }

    // ** Query : 
    const { data = [] } = useQuery(["achat", shopId], ({ queryKey }) => getShopAchats(queryKey[1]), { refetchOnWindowFocus: false })
    const { data: getShopFrs = [] } = useQuery(["frs", shopId], ({ queryKey }) => getShopFournisseur(queryKey[1]), { refetchOnWindowFocus: false })

    // search
    const [search, setSearch] = useState({ etat: null, frs: null })
    const searchFilter = (data) => {
        const { ac_etat, fo_id } = data
        const { etat, frs } = search
        if (!etat && !frs) return data
        //  ** search algorithms
        const searchEtat = ac_etat === etat
        const searchFrs = fo_id === frs
        if (searchEtat || searchFrs) return data
    }

    const tableRows = data.filter(searchFilter).map((d) => {
        return (
            <tr key={d.ac_id}>
                <td>{new Date(d.ac_date).toLocaleDateString()}</td>
                <td>{d.fo_nom}</td>
                <td>{d.ac_desc}</td>
                <td>
                    {d.ac_etat === "1" ? (
                        <Badge>Recue</Badge>
                    ) : (
                        <Badge>en cours</Badge>
                    )}
                </td>
                <td>
                    <Button
                        m={5}
                        component={Link}
                        to={`/commandes/fournisseurs/${d.ac_id}`}
                    >
                        Details
                    </Button>
                    <Button m={5} onClick={() => handleAction("edit", d)}>
                        Modifier
                    </Button>
                    <Button
                        color="orange"
                        m={5}
                        onClick={() => handleAction("del", d)}
                    >
                        Annuler
                    </Button>
                </td>
            </tr>
        )
    })


    return (
        <div>
            <Hero
                title="Commande Fournisseur (achats)"
                desc="Mes commandes fournisseurs"
                order={4}
            >
                <Text>Nombres de commandes : {data.length}</Text>
            </Hero>
            <main>
                <div>
                    <Group m={5}>
                        <Select
                            clearable
                            searchable
                            nothingFound="Option invalide"
                            placeholder="Etat du commande"
                            data={[
                                { value: "0", label: "En cours" },
                                { value: "1", label: "Receptionner" },
                            ]}
                            onChange={(value) =>
                                setSearch({ ...search, etat: value })
                            }
                        />
                        <Select
                            clearable
                            searchable
                            nothingFound="Fournisseur Introuvable"
                            placeholder="Choisir le fournisseur"
                            data={adaptSelect(getShopFrs, "fo_id", "fo_nom")}
                            onChange={(value) => setSearch({ ...search, frs: value })}
                        />
                        <Button
                            component={Link}
                            to="/commandes/fournisseurs/add"
                        >
                            Nouvelle commmande
                        </Button>
                    </Group>
                </div>
                <div>
                    <AppTable
                        title="Mes commandes fournisseurs"
                        tableHead={[
                            "Date de Reception",
                            "Fournisseur",
                            "Description",
                            "Etate",
                            "Action",
                        ]}
                        tableRows={tableRows}
                    />
                    {/* modals */}
                    <EditCmdFrs
                        userAction={userAction}
                        setAction={setAction}
                        data={userAction.data}
                    />
                    <DeleteCmdFrs
                        userAction={userAction}
                        setAction={setAction}
                        data={userAction.data}
                    />
                </div>
            </main>
        </div>
    )
}

export default CmdFrs
