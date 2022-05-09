import React, { useEffect } from "react"
import { Button, Modal, Textarea, TextInput, Title } from "@mantine/core"

// global
import useForm from "../../hooks/useForm"
import { editShopAchats } from "../../services/api"
import { useMutation, useQueryClient } from "react-query"

function EditCmdFrs({ userAction, setAction, data }) {
    const { formValues, handleChange, setValues } = useForm({
        date: "",
        desc: "",
    })

    // TODO mutation : modification de l'achats
    const query = useQueryClient()
    const { mutate } = useMutation(["achat"], editShopAchats)
    const handleSubmit = (e) => {
        e.preventDefault()
        mutate(
            { ...formValues, acId: data.ac_id },
            {
                onSuccess: () => {
                    query.invalidateQueries("achat")
                    handleClose()
                },
            }
        )
    }

    useEffect(() => {
        // setValues("date", data.ac_date)
        setValues("desc", data.ac_desc)
    }, [data])

    const handleClose = () => setAction("edit", false)
    return (
        <Modal
            title={<Title order={4}>Modification de l'achats</Title>}
            opened={userAction.edit}
            onClose={() => handleClose()}
            closeOnClickOutside={false}
        >
            <form onSubmit={handleSubmit}>
                <TextInput
                    type="date"
                    label="Entrez la nouvelle date"
                    name="date"
                    value={formValues.date}
                    onChange={handleChange}
                />
                <Textarea
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    label="Description de l'achat"
                    name="desc"
                    value={formValues.desc}
                    onChange={handleChange}
                />
                <Button mt={5} type="submit">
                    Modifier
                </Button>
            </form>
        </Modal>
    )
}

export default EditCmdFrs
