import React from 'react'
import useForm from "../../hooks/useForm"
// style
import { Stepper, TextInput, PasswordInput, Button, Text, Title } from "@mantine/core"
// comp
import Hero from '../../components/hero/Hero'
// global
import { useMutation, useQueryClient } from "react-query"

function AddUserPage() {

    const { formValues, formErrors, handleChange, setValues, setFormErrors } = useForm({
        us_prenom: "",
        us_nom: "",
        us_tel: "",
        us_email: "",
        us_pass: "",
        bo_nom: "",
        bo_tel: "",
        bo_adr: "",
        bo_email: "",
        active: 0,
    })


    const firstSubmit = (e) => {
        e.preventDefault()
        if (formValues.active === 1) return
        setValues("active", 1)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        alert("compte crée avec success")
        setValues("active", 2)
    }

    return (
        <div>
            <Hero title="Creation d'un compte utilisateur" order={3}>
                <Text>Nombres d'utilisateurs : </Text>
            </Hero>
            <Stepper active={formValues.active} onStepClick={(stepIndex) => setValues("active", stepIndex)}>
                <Stepper.Step label="Creation de l'utilisateur">
                    <form onSubmit={firstSubmit}>
                        <TextInput
                            label="Prenom"
                            maxLength={60}
                            autoComplete="off"
                            autoCorrect="off"
                            name="us_prenom"
                            description="Lettres et chiffres avec (_ et espace)"
                            value={formValues.us_prenom}
                            onChange={handleChange}
                            placeholder="Aboucodeur_123"
                            required
                            error={formErrors.prenom}
                        />
                        <TextInput
                            label="Nom"
                            maxLength={30}
                            autoComplete="off"
                            autoCorrect="off"
                            name="us_nom"
                            value={formValues.us_nom}
                            onChange={handleChange}
                            required
                        />
                        <TextInput
                            label="Email"
                            type="email"
                            autoComplete="off"
                            autoCorrect="off"
                            name="us_email"
                            value={formValues.us_email}
                            onChange={handleChange}
                            required
                        />
                        <PasswordInput
                            label="Mot de passe"
                            name="us_pass"
                            value={formValues.us_pass}
                            onChange={handleChange}
                            required
                            error={formErrors.pass}
                        />

                        <TextInput
                            type="tel"
                            label="Telephone"
                            name="us_tel"
                            autoComplete="off"
                            autoCorrect="off"
                            value={formValues.us_tel}
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" mt={5}>Passer à l'etape suivante</Button>
                    </form>
                </Stepper.Step>
                <Stepper.Step label="Creation de la boutique">
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label="Nom de la boutique"
                            autoComplete="off"
                            autoCorrect="off"
                            name="bo_nom"
                            value={formValues.bo_nom}
                            onChange={handleChange}
                            required
                        />
                        <TextInput
                            label="Numero de telephone"
                            type="tel"
                            autoComplete="off"
                            autoCorrect="off"
                            name="bo_tel"
                            value={formValues.bo_tel}
                            onChange={handleChange}
                            required
                        />
                        <TextInput
                            label="Email"
                            type="email"
                            autoComplete="off"
                            autoCorrect="off"
                            name="bo_email"
                            value={formValues.bo_email}
                            onChange={handleChange}
                            required
                        />
                        <TextInput
                            label="Addresse de la boutique"
                            autoComplete="off"
                            autoCorrect="off"
                            name="bo_adr"
                            value={formValues.bo_adr}
                            onChange={handleChange}
                            required
                        />
                        <Button mt={5} type="submit">Creer le compte</Button>
                    </form>
                </Stepper.Step>
                <Stepper.Completed>
                    <Title align="center" m={5} order={3}>Bravo, compte utilisateur crée avec success</Title>
                </Stepper.Completed>
            </Stepper>
        </div>
    )
}

export default AddUserPage