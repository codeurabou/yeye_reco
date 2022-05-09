import { useCallback, useEffect, useState } from 'react'

function useForm(initialValues, onSumbitFn) {

    const [formValues, setFormValues] = useState({ ...initialValues })
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)

    // handleChange
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }

    // validate : natif vs exterrieur role ecrire les erreurs
    const validate = (values, cb) => {
        const err = {}
        if (cb) cb(values, err) // utilisation finale depuis l'exterrieur
        return err
    }

    // soummettre le formulaire
    const handleSubmit = (e, cb) => {
        if (e) e.preventDefault()
        setIsSubmit(true)
        setFormErrors(validate(formValues, cb))
    }



    // soumettre par effet
    useEffect(() => {
        if (Object.entries(formErrors).length === 0 && isSubmit === true) {
            onSumbitFn(formValues)
            setIsSubmit(false)
        }
        else return
    }, [formErrors, isSubmit, formValues, onSumbitFn])


    // setter
    const setErrors = useCallback((key, value) => {
        setFormErrors((prevState) => {
            return { ...prevState, [key]: value }
        })
    }, [])
    const setValues = useCallback((key, value) => {
        // resouds le probleme de mise a jour par file
        // pas d'effect de bord
        setFormValues((prevState) => {
            return { ...prevState, [key]: value }
        })
    }, [])
    // utils
    const cleanForm = () => setFormValues(initialValues)

    return {
        formValues,
        formErrors,
        handleChange,
        handleSubmit,
        setIsSubmit,
        setErrors,
        setValues,
        setFormErrors,
        setFormValues,
        cleanForm,
    }
}

export default useForm