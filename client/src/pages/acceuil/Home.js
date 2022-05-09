import React from 'react'
import { Box, SimpleGrid, Text, Title } from '@mantine/core'
import { useAppState } from "../../context/AppContext"
// comp
import HomeCard from './HomeCard'
import Hero from '../../components/hero/Hero'
// global

function Home() {

    const { useSelector } = useAppState()
    const shopInfos = useSelector(state => state.shop)

    return (
        <div>
            <Hero title={"Acceuil"} />
            <main style={{ display: "flex", flexWrap: "wrap" }}>
                <SimpleGrid cols={3} spacing={0}>
                    <HomeCard
                        title="Stocks"
                        desc="Le nombre de produit dans l'ensemble des depots"
                        total={12}
                    />
                    <HomeCard
                        title="Gerants"
                        desc="Le nombre de gerants"
                        total={12}
                    />
                    <HomeCard
                        title="Commandes"
                        desc="Le nombres de commanades (Client/Fournisseur)"
                        total={123}
                    />
                    <HomeCard
                        title="Ventes"
                        desc="Le nombre de ventes"
                        total={12}
                    />
                    <HomeCard
                        title="Dettes"
                        desc="Le nombre de dettes"
                        total={12}
                    />
                    <HomeCard
                        title="Service"
                        desc="Le nombre de service"
                        total={12}
                    />
                    <HomeCard
                        title="Fournisseurs"
                        desc="Le nombre de fournisseurs"
                        total={12}
                    />
                </SimpleGrid>
                <Box m={5}>
                    <Text>Id (hacking) : {shopInfos.bo_id}</Text>
                    <Title order={3}>Nom : {shopInfos.bo_nom}</Title>
                    <Text>Email : {shopInfos.bo_email}</Text>
                    <Text>Addresse : {shopInfos.bo_adr}</Text>
                    <Text>Telephone : {shopInfos.bo_tel}</Text>
                </Box>
            </main>
        </div>
    )
}

export default Home