import React from 'react'

import { Group, Text, TextInput } from '@mantine/core'
import Hero from "../../components/hero/Hero"
// global
import { useQuery } from "react-query"
import { useAppState } from "../../context/AppContext"
import { getVendreVente } from '../../services/api'
import AppTable from '../../components/table/AppTable'

function SingleSold() {
    return (
        <div>
            <Hero title="Details de la vente" order={3}>
                <Text>Nombres de produits vendus : </Text>
            </Hero>
            <main>
                <Group>
                    <TextInput placeholder="Taper le nom du produit" />
                </Group>
                <AppTable
                    tableHead={["Nom", "Unite", "Quantite", "Prix", "Montant", "Action"]}
                />
            </main>
        </div>
    )
}

export default SingleSold