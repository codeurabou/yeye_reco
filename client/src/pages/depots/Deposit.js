import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
// style
import { Button, Divider, Group, Loader, TextInput, Title } from '@mantine/core'
// comp
import DepositCard from './DepositCard'
import Hero from "../../components/hero/Hero"
import AddDeposit from './AddDeposit'
// global
import { useAppState } from '../../context/AppContext'
import { useQuery } from 'react-query'
import { getShopDepots } from '../../services/api'
// hooks

function Deposit() {

    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const { useSelector } = useAppState()
    const shopInfos = useSelector((state) => state.shop)

    const { data, isLoading } = useQuery(["depots", shopInfos.bo_id], ({ queryKey }) => getShopDepots(queryKey[1]), { refetchOnWindowFocus: false })
    const depositDatas = data || []

    const searchFilter = (data) => {
        // entree
        const { de_nom } = data
        if (!search) return data
        if (de_nom.includes(search) || de_nom.toLocaleLowerCase().includes(search)) {
            return data
        }
    }

    return (
        <div>
            <Hero title="Depots" />
            <main>
                <Group m={5} style={{ display: "flex", alignItems: "center" }}>
                    <Button component={Link} to="/depots/trash" color="red">Corbeille</Button>
                    <Button m={5} onClick={() => setIsOpen(true)}>Ajouter</Button>
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoCorrect='off'
                        autoComplete='off'
                        placeholder="Ex: Magazin 1"
                    />
                </Group>
                <div>
                    <Divider m={5} />
                    <Title order={4}>Listes des depots</Title>
                    {isLoading ?
                        <Loader /> :
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {depositDatas
                                .filter(searchFilter)
                                .map((d, idx) => (
                                    <Fragment key={idx}>
                                        <DepositCard
                                            title={d.de_nom}
                                            desc={d.de_desc}
                                            id={d.de_id}
                                        />
                                    </Fragment>
                                ))}
                        </div>}
                </div>
                {/* Modal */}
                <AddDeposit isOpen={isOpen} setIsOpen={setIsOpen} boId={shopInfos.bo_id} />
            </main>
        </div>
    )
}

export default Deposit