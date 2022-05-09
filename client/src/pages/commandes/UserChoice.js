import React, { useState } from "react"
import { ScrollArea, TextInput, Text } from "@mantine/core"
import Product from "../../components/product/Product"

function UserChoice({ data }) {
    const [search, setSearch] = useState()
    const searchFilter = (data) => {
        const { pr_nom } = data
        if (!search) return data

        if (
            pr_nom.includes(search) ||
            pr_nom.toLocaleLowerCase().includes(search)
        )
            return data
    }

    return (
        <div>
            <TextInput
                placeholder="Rechercher rapide du produit"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Text m={5}>Nombres de produits trouves : {data.length}</Text>
            <ScrollArea style={{ height: 190 }}>
                {data.filter(searchFilter).map((p) => (
                    <React.Fragment key={p.pr_id}>
                        <Product data={p} />
                    </React.Fragment>
                ))}
            </ScrollArea>
        </div>
    )
}

export default UserChoice
