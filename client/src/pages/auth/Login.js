import React, { useEffect, useState } from "react"
// style
import { Alert, Button, PasswordInput, Switch, TextInput } from "@mantine/core"
// hooks
import useForm from "../../hooks/useForm"
import Cookies from "js-cookie"
import { instance } from "../../axios"
// global
import { useAppState } from "../../context/AppContext"
// comp
import UserChoice from "./UserChoice"

function Login() {
    const { login } = useAppState()
    const [multiChoice, setMultiChoice] = useState({ isOpen: false, data: [] })
    // form
    const initialValues = { email: "", pass: "" }
    const [isChecked, setisChecked] = useState(false)

    // login
    const loginWrapper = (values) => {
        login(values, (err, res) => {
            if (err) {
                const errDatabase = err?.response?.data?.message
                setErrors("message", errDatabase)
            } else {
                Cookies.set("yy_user_token", res.data.token)
                const userId = res.data.us_id
                // TODO : choix une connexion etablit
                instance
                    .get(`/boutiques/utilisateur/${userId}`)
                    .then((res) => {
                        // redirection: mutliple choix
                        if (res.data.total >= 1)
                            setMultiChoice({ ...multiChoice, isOpen: true, data: [...res.data.userBoutique], })
                    })
                    .catch((err) => console.error({ err }))
            }
        })
    }
    const {
        formValues,
        formErrors,
        handleChange,
        handleSubmit,
        setErrors,
        setValues,
    } = useForm(initialValues, loginWrapper)

    // effect
    useEffect(() => {
        const retrieves = JSON.parse(localStorage.getItem("yy_user_email"))
        if (retrieves) {
            setValues("email", retrieves)
            setisChecked(true)
        }
    }, [])
    // remenber Me
    const remenberMe = () => {
        setisChecked(!isChecked)
        if (!formValues.email) return
        localStorage.setItem("yy_user_email", JSON.stringify(formValues.email))
    }

    const validates = (values, err) => {
        const { pass } = values
        if (pass.length < 5) err.pass = "Mot de passe trop court"
    }

    return (
        <div>
            {formErrors.message && (
                <Alert title="Erreur" color="red">
                    {formErrors.message}
                </Alert>
            )}
            <form onSubmit={(e) => handleSubmit(e, validates)}>
                <TextInput
                    label="Email"
                    name="email"
                    autoComplete="off"
                    autoCorrect="off"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                />
                <PasswordInput
                    label="Mot de passe"
                    name="pass"
                    value={formValues.pass}
                    onChange={handleChange}
                    error={formErrors.pass}
                    required
                />
                <Switch
                    checked={isChecked}
                    onChange={() => remenberMe()}
                    label="Se souvenir de moi"
                    mt={5}
                />
                <Button type="submit" mt={5}>Se Connecter</Button>
            </form>
            {/* Modal de choix de boutiques */}
            <UserChoice
                multiChoice={multiChoice}
                setMultiChoice={setMultiChoice}
            />
        </div>
    )
}

export default Login
