import React from "react"
// style
import {
    Card,
    Divider,
    Group,
    Modal,
    Text,
    TextInput,
    Title,
} from "@mantine/core"
// comp
import AppTable from "../../components/table/AppTable"
// global :api
import { getFournisseurProduct } from "../../services/api"
import { useQuery } from "react-query"

function DetailsFrs({ userAction, setUserAction, data }) {
    const { fo_nom, fo_tel, fo_adr, fo_email, fo_id } = data
    // query
    const { data: frsProduct = [] } = useQuery(
        ["frs", fo_id],
        ({ queryKey }) => getFournisseurProduct(queryKey[1]),
        { refetchOnWindowFocus: false }
    )

    // tableRows
    const tableRows = frsProduct.map((data) => (
        <tr key={data.pr_id}>
            <td>{data.pr_nom}</td>
            <td>{data.pr_qte}</td>
            <td>{data.pr_prix}</td>
            <td>{data.pr_unite}</td>
            <td>{data.pr_prix * data.pr_qte}</td>
        </tr>
    ))

    return (
        <Modal
            title={<Title order={3}>Informations du Fournisseur</Title>}
            opened={userAction.show}
            onClose={() => setUserAction({ ...userAction, show: false })}
            closeOnClickOutside={false}
        >
            <div>
                <Card
                    shadow="lg"
                    sx={(theme) => ({
                        backgroundColor: theme.colors.blue[6],
                        color: "white",
                    })}
                >
                    <Text>Nom du Fournisseur : {fo_nom}</Text>
                    <Text>Telephone : {fo_tel}</Text>
                    <Text>Email : {fo_email}</Text>
                    <Text>Adresse : {fo_adr}</Text>
                </Card>
                <Divider m={5} />
                <main>
                    <div>
                        <Group>
                            <TextInput placeholder="Ex : Iphone 12 Pro Max" />
                        </Group>
                    </div>
                    {frsProduct.length === 0 ? (
                        <Title order={5} m={5}>
                            Ce fournisseur n'a pas encore fournit la boutique{" "}
                        </Title>
                    ) : (
                        <AppTable
                            title="Listes des produits fournit par le fournisseurs"
                            tableHead={[
                                "Nom",
                                "Qte",
                                "Prix",
                                "Unite",
                                "Montants",
                            ]}
                            tableRows={tableRows}
                        />
                    )}
                </main>
            </div>
        </Modal>
    )
}

export default DetailsFrs
