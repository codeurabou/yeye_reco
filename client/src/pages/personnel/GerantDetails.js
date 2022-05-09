import React, { useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
// style
import { Badge, Box, Button, Card, Divider, Group, Loader, Menu, Select, Text, TextInput } from '@mantine/core'
// comp
import Hero from "../../components/hero/Hero"
import AppTable from '../../components/table/AppTable'
// global
import { deleteShopUser, getOneShopUser, getUserDroit } from '../../services/api'
import { useMutation, useQuery, useQueryClient } from "react-query"
import AddDroit from './AddDroit'
import EditDroit from './EditDroit'
import DeleteDroit from './DeleteDroit'

function GerantDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const userId = parseInt(id, 10)

    // requetes : informations
    const { data: userInfos = [], isLoading: loading1 } = useQuery(["ger", userId],
        ({ queryKey }) => getOneShopUser(queryKey[1]), { refetchOnWindowFocus: false })
    const { data: userDroit = [], isLoading: loading2 } = useQuery(["droit", userId],
        ({ queryKey }) => getUserDroit(queryKey[1]), { refetchOnWindowFocus: false })
    // afficher ses ventes

    // mutation : Attribution de droit
    const { mutate } = useMutation(["ger"], deleteShopUser)
    const query = useQueryClient()
    const handleBackup = (type) => {
        // activation , supression, desactivation du compte
        mutate({ usId: userId, type }, {
            onSuccess: () => {
                query.invalidateQueries("ger")
                if (type === "del") navigate("/personnels/gerants")
            }
        })
    }


    // action
    const [userAction, setUserAction] = useState({ add: false, edit: false, remove: false, data: {} })
    const handleAction = (type, data) => {
        switch (type) {
            case "add":
                setUserAction({ ...userAction, add: true, data })
                break
            case "edit":
                setUserAction({ ...userAction, edit: true, data })
                break
            default:
                setUserAction({ ...userAction, remove: true, data })
                break
        }
    }

    // tableRows
    const tableRows = userDroit.map(d => {
        return (
            <tr key={d.dr_id}>
                <td>{d.dr_nom}</td>
                <td>{d.dr_action}</td>
                <td>{d.dr_etat ? <Badge>Activer</Badge> : <Badge>Desactiver</Badge>}</td>
                <td>
                    <Button m={5} onClick={() => handleAction("edit", d)}>Modifier</Button>
                    <Button m={5} color="orange" onClick={() => handleAction("del", d)}>Retirer</Button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <Hero order={4} title={`Informations de ${userInfos.us_prenom}`} />
            <Box>
                <div>
                    {loading1 ?
                        <Loader m={5} /> :
                        <Card m={5} shadow="lg" sx={(theme) => ({ backgroundColor: theme.colors.gray[7], color: "white" })}>
                            <Text>Prenom : {userInfos.us_prenom}</Text>
                            <Badge size="lg">Etat du compte : {userInfos.disabled ? "Desactiver" : "Activer"}</Badge>
                            <Text>Nom : {userInfos.us_nom}</Text>
                            <Text>Telephone : {userInfos.us_tel}</Text>
                            <Text>Email : {userInfos.us_email}</Text>
                            <Divider m={5} />
                            <Menu size="lg" control={<Button variant="white">Options</Button>} color="blue" title="Options">
                                <Menu.Label>Zone dangereurse</Menu.Label>
                                <Menu.Item color="blue" onClick={() => handleBackup("act")}>Activer</Menu.Item>
                                <Menu.Item color="orange" onClick={() => handleBackup("des")}>Desactiver</Menu.Item>
                                <Menu.Item color="red" onClick={() => handleBackup("del")}>Supprimer Definitivement</Menu.Item>
                            </Menu>
                        </Card>}
                </div>
                <div>
                    <Group>
                        <Select clearable placeholder="Affichez les droit / fonctionnalités" data={["stocks", "dettes"]} />
                        <Button m={5} onClick={() => handleAction("add", { usId: userId })} >Nouveau Droit</Button>
                    </Group>
                    {loading2 ?
                        <Loader m={5} /> :
                        <AppTable
                            title="Les droits du gerant"
                            tableHead={["Nom", "Action", "Etat", "Action"]}
                            tableRows={tableRows}
                        />}
                    {/* modals */}
                    <AddDroit userAction={userAction} setUserAction={setUserAction} data={userAction.data} />
                    <EditDroit userAction={userAction} setUserAction={setUserAction} data={userAction.data} />
                    <DeleteDroit userAction={userAction} setUserAction={setUserAction} data={userAction.data} />
                </div>
            </Box>
        </div>
    )
}

export default GerantDetails

/**
 * information du profils
 * voir ses ventes (AppTable)
 * attribuer , modifier , retirer voir ses droits
 * desactiver , supprimer , activer le compte
 */