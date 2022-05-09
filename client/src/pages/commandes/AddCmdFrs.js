import React from "react"
import { useNavigate } from "react-router-dom"
import useForm from "../../hooks/useForm"
import useAction from "../../hooks/useAction"
// style
import {
    Divider,
    TextInput,
    Card,
    Group,
    Textarea,
    Select,
    Button,
    Tabs,
} from "@mantine/core"
// comp
import Hero from "../../components/hero/Hero"
import AppTable from "../../components/table/AppTable"
import { adaptSelect } from "../../utils"
import UserChoice from "./UserChoice"
import EditProduct from "./EditProduct"
// global : api
import {
    getShopFournisseur,
    getFournisseurProduct,
    getNotFrsProduct,
    addShopAchats,
} from "../../services/api"
import { useAppState } from "../../context/AppContext"
import { useMutation, useQuery, useQueryClient } from "react-query"

function AddCmdFrs() {
    const { useSelector, dispatch } = useAppState()
    const shopInfos = useSelector((state) => state.shop)
    const basketDatas = useSelector((state) => state.basket)

    const { formValues, handleChange, setValues, cleanForm } = useForm({
        date: "",
        desc: "",
        fo_id: 0,
    })

    // requetes : fournisseur , produit fournisseur et hors fournisseur
    const { data: getShopFrs = [] } = useQuery(
        ["frs", shopInfos.bo_id],
        ({ queryKey }) => getShopFournisseur(queryKey[1]),
        { refetchOnWindowFocus: false }
    )
    const { data: frsProduct = [] } = useQuery(
        ["product", formValues.fo_id],
        ({ queryKey }) => getFournisseurProduct(queryKey[1]),
        { refetchOnWindowFocus: false }
    )
    const { data: notFrsProduct = [] } = useQuery(
        ["product", shopInfos.bo_id, formValues.fo_id],
        ({ queryKey }) =>
            getNotFrsProduct({ boId: queryKey[1], foId: queryKey[2] }),
        { refetchOnWindowFocus: false }
    )

    // commandes : CRUD
    const { userAction, setAction } = useAction({
        edit: false,
        remove: false,
        data: {},
    })
    const handleAction = (type, data) => {
        if (type === "edit") {
            setAction("edit", !userAction.edit)
            setAction("data", data)
        }
    }
    const removeProductToCart = ({ pr_id }) =>
        dispatch({ type: "Basket/Remove", payload: { id: pr_id } })

    // tableRows
    const tableRows = basketDatas.map((data) => {
        return (
            <tr key={data.pr_id}>
                <td>{data.nom}</td>
                <td>{data.qte}</td>
                <td>{data.prix}</td>
                <td>{data.prix * data.qte}</td>
                <td>
                    <Button m={5} onClick={() => handleAction("edit", data)}>
                        Modifier
                    </Button>
                    <Button
                        m={5}
                        color="red"
                        onClick={() => removeProductToCart(data)}
                    >
                        Retirer
                    </Button>
                </td>
            </tr>
        )
    })

    const getSum = () => {
        let sum = 0
        for (const el of basketDatas) {
            sum += el.qte * el.prix
        }
        return sum
    }

    // mutation
    const query = useQueryClient()
    const navigate = useNavigate()
    const { mutate } = useMutation(["achat"], addShopAchats)

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate(
            {
                ...formValues,
                etat: "0",
                bo_id: shopInfos.bo_id,
                commande: basketDatas,
            },
            {
                onSuccess: () => {
                    query.invalidateQueries("achat")
                    cleanForm()
                    dispatch({ type: "Basket/Clear" })
                    navigate("/commandes/fournisseurs")
                },
            }
        )
    }

    return (
        <div>
            <Hero
                title="Preparez votre commande ici"
                order={4}
                desc="Passe une commande au près de vos fournisseurs"
            />
            <main>
                <Card
                    shadow="lg"
                    sx={(theme) => ({
                        backgroundColor: theme.colors.blue[6],
                        color: "white",
                    })}
                >
                    <form onSubmit={handleSubmit}>
                        <Group direction="row">
                            <TextInput
                                label="Date de reception"
                                type="date"
                                required
                                name="date"
                                value={formValues.data}
                                onChange={handleChange}
                            />
                            <Select
                                label="Fournisseur"
                                required
                                clearable
                                searchable
                                nothingFound={"Je ne trouve pas le fournisseur"}
                                data={adaptSelect(
                                    getShopFrs,
                                    "fo_id",
                                    "fo_nom"
                                )}
                                placeholder="Choisir le fournisseur"
                                onChange={(value) => setValues("fo_id", value)}
                            />
                            <Textarea
                                spellCheck={false}
                                autoCorrect="off"
                                autoComplete="off"
                                label="Description"
                                placeholder="Description de la commande"
                                required
                                name="desc"
                                value={formValues.desc}
                                onChange={handleChange}
                            />
                        </Group>
                        <Button type="submit" variant="white" m={5}>
                            Passer la commander
                        </Button>
                    </form>
                </Card>
                <Divider color="blue" m={5} />
                {/* bottom */}
                <Group align="normal">
                    <AppTable
                        title={`Pannier des produits commander avec une somme de ${getSum()}`}
                        tableHead={["Nom", "Qte", "Prix", "Montant", "Action"]}
                        tableRows={tableRows}
                    />
                    <Tabs>
                        <Tabs.Tab label="Fournisseur">
                            <UserChoice data={frsProduct} />
                        </Tabs.Tab>
                        <Tabs.Tab label="Hors Fournisseur">
                            <UserChoice data={notFrsProduct} />
                        </Tabs.Tab>
                    </Tabs>
                    {/* modal */}
                    <EditProduct
                        userAction={userAction}
                        setAction={setAction}
                        data={userAction.data}
                    />
                </Group>
            </main>
        </div>
    )
}

export default AddCmdFrs
