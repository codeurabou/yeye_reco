import React from 'react'
import { Modal, Title } from "@mantine/core"

function AddDroit({ userAction, setUserAction, data }) {


    console.log(data)

    const handleClose = () => setUserAction({ ...userAction, add: false })
    return (
        <Modal
            title={<Title order={3}>Attribuer Droit</Title>}
            opened={userAction.add}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
        >

        </Modal>
    )
}

export default AddDroit