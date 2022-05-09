import React from 'react'
import { Link } from 'react-router-dom'
// comp
import { Button, Group, Text, TextInput } from '@mantine/core'
import Hero from '../../components/hero/Hero'
import AppTable from '../../components/table/AppTable'

function UserLists() {
    return (
        <div>
            <Hero title="Liste des utilisateurs de la plateforme" order={3}>
                <Text>Toujours avancer au bout</Text>
                <Text>Nombres d'utilisateurs : </Text>
            </Hero>
            <main>
                <Group spacing={3}>
                    <TextInput placeholder="Chercher un utilisateur" />
                    <TextInput placeholder="Numero de telephone" />
                    <Button m={5} component={Link} to="/admin/dashboard/user/add" >Nouveau utilisateur</Button>
                    <Button color="red">Compte Desactiver</Button>
                </Group>
                <AppTable
                    title="Liste Utilisateurs"
                    tableHead={["Prenom", "Nom", "Boutique", "Telephone", "Etat du compte", "Action"]}
                />
            </main>
        </div>
    )
}

export default UserLists