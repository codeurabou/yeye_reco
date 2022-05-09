import React from 'react'
import { Button, Modal, Textarea, TextInput, Title } from '@mantine/core'
import useForm from "../../hooks/useForm"
// global
import { addDepots } from '../../services/api'
import { useQueryClient, useMutation } from 'react-query'


function AddDeposit({ isOpen, setIsOpen, boId }) {

    // form
    const initialValues = { nom: "", desc: "", bo_id: boId }
    const { formValues, handleChange, cleanForm } = useForm(initialValues)

    const { mutate } = useMutation(["depots"], addDepots)
    const queryClient = useQueryClient()

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate({ ...formValues }, {
            onSuccess: () => {
                queryClient.invalidateQueries("depots") // gestion d'etat serveur
                cleanForm()
                setIsOpen(false)
            }
        })
    }

    return (
        <Modal
            title={<Title order={3}>Ajouter Un Depot</Title>}
            opened={isOpen}
            onClose={() => setIsOpen(false)}
            closeOnClickOutside={false}
        >
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Nom"
                    placeholder="Ex : Depots Chine"
                    required
                    name="nom"
                    value={formValues.nom}
                    onChange={handleChange}
                />
                <Textarea

                    spellCheck={false}
                    autoCorrect="off"
                    label="Description"
                    placeholder="Ex : contient les produits de la chine"
                    required
                    name="desc"
                    value={formValues.desc}
                    onChange={handleChange}
                />
                <Button type="submit" mt={5}>Ajouter</Button>
            </form>
        </Modal>
    )
}

export default AddDeposit