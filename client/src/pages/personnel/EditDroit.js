import React from 'react'
import { Badge, Modal, Text, Title } from "@mantine/core"

function EditDroit({ userAction, setUserAction, data }) {

    const handleClose = () => setUserAction({ ...userAction, edit: false })
    return (
        <Modal
            title={<Title order={4}>Modification du droit</Title>}
            opened={userAction.edit}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
        >
            <Text size="lg">Dans
                <Badge size="lg">la fonctionnalités {data.dr_nom}</Badge> vous-voulez activer/desactiver
                <Badge size="lg">l'action {data.dr_action}</Badge>
            </Text>
        </Modal>
    )
}

export default EditDroit