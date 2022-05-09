import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Divider, Menu, Text, Title } from '@mantine/core'
import styled from 'styled-components'
import EditDeposit from './EditDeposit'
import DeleteDeposit from './DeleteDeposit'

// css
const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 193px;
    max-width: 193px;
`

function DepositCard({ id, title, desc, route = "", mw }) {

    const [userAction, setUserAction] = useState({ edit: false, remove: false, data: {} })
    const handleAction = (type, data) => {
        switch (type) {
            case "edit":
                setUserAction({ ...userAction, remove: false, edit: true, data })
                break;
            default:
                setUserAction({ ...userAction, remove: true, edit: false, data })
                break;
        }
    }

    return (
        <Card shadow="lg" m={5} sx={(theme) => ({ backgroundColor: theme.colors.blue[3] })}>
            <CardContainer>
                <div>
                    <header>
                        <Menu trigger="hover">
                            <Menu.Label>Options</Menu.Label>
                            <Menu.Item color="blue" onClick={() => handleAction("edit", { id, title, desc })}>Modifier</Menu.Item>
                            <Menu.Item color="orange" onClick={() => handleAction("remove", { id, title })}>Annuler</Menu.Item>
                        </Menu>
                    </header>
                    <div>
                        <Title order={4}>{title}</Title>
                        <Divider m={5} />
                        <Text>{desc}</Text>
                    </div>
                </div>
                <Button variant="white" component={Link} to={`/depots/${id}`}>Ouvrir</Button>
            </CardContainer>
            {/* Modal */}
            <EditDeposit
                userAction={userAction}
                setUserAction={setUserAction}
                data={userAction.data}
            />
            <DeleteDeposit
                userAction={userAction}
                setUserAction={setUserAction}
                data={userAction.data}
            />
        </Card>
    )
}

export default DepositCard