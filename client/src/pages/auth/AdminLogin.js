import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useLocation, useNavigate } from "react-router-dom"

import { Button, Checkbox, PasswordInput, Switch, TextInput } from '@mantine/core'

import useForm from "../../hooks/useForm"
import { useAppState } from "../../context/AppContext"

function AdminLogin() {

    const [isChecked, setIsChecked] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const origin = location?.state?.from?.pathname || "/admin/dashboard"

    const loginWrapper = () => {
        login(formValues, (err, res) => {
            if (err) {
                const getErr = err?.response?.data.message
                setErrors("message", getErr)
            }
            else {
                // n'importe quel type de connexion nous remplacons le cookie ou (admin et (prop,ger))
                Cookies.set("yy_admin_token", res.data.token)
                navigate(origin)
            }
        })
    }

    const { login } = useAppState()
    const { formValues, formErrors, handleChange, handleSubmit, setFormErrors, setErrors, setValues } = useForm({ email: "", pass: "" }, loginWrapper)

    const validates = (values, err) => {
        const { email, pass } = values
        // write error here
        if (pass.length < 8) err.pass = "Au moins huits(8) caractères"
    }
    // effect
    useEffect(() => {
        const retrieves = JSON.parse(localStorage.getItem("yy_admin_email"))
        if (retrieves) {
            setValues("email", retrieves)
            setIsChecked(true)
        }
    }, [])
    // remenber Me
    const remenberMe = () => {
        setIsChecked(!isChecked)
        if (!formValues.email) return
        localStorage.setItem("yy_admin_email", JSON.stringify(formValues.email))
    }

    // TODO : les cookies sont differents des utilisateurs lambda

    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e, validates)}>
                <TextInput
                    label="Email" placeholder="Email"
                    type="email"
                    autoComplete="off"
                    autoCorrect="off"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                    error={formErrors.email}
                />
                <PasswordInput
                    label="Mot de passe"
                    placeholder="Votre Mot de passe"
                    autoComplete="off"
                    autoCorrect="off"
                    name="pass"
                    value={formValues.pass}
                    onChange={handleChange}
                    required
                    error={formErrors.pass}

                />
                <Switch checked={isChecked} mt={5} label="Se souvenir de moi" onChange={() => remenberMe()} />
                <Button type="submit" mt={5}>Se Connecter</Button>
            </form>
        </div>
    )
}

export default AdminLogin