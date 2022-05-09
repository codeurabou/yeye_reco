import { instance } from "../axios"

// depots
const getShopDepotsTrash = (boId) => instance.get(`/depots/boutique/${boId}/trash`).then((res) => res.data)
const getShopDepots = (boId) => instance.get(`/depots/boutique/${boId}`).then((res) => res.data)
const addDepots = (values) => instance.post(`/depots`, { ...values }).then((res) => res.data)
const editDepot = (values) => instance.put(`/depots/${values.deId}`, { ...values }).then((res) => res.data)
const removeDepot = (values) => instance.delete(`/depots/${values.deId}?type=${values.type || "des"}`).then((res) => res.data)

// fournisseur
const getShopFournisseurTrash = (boId) => instance.get(`/fournisseurs/boutique/${boId}/trash`).then((res) => res.data)
const getShopFournisseur = (boId) => instance.get(`/fournisseurs/boutique/${boId}`).then((res) => res.data)
const addFournisseur = (values) => instance.post(`/fournisseurs`, { ...values }).then((res) => res.data)
const editFournisseur = (values) => instance.put(`/fournisseurs/${values.foId}`, { ...values }).then((res) => res.data)
const deleteFournisseur = (values) => instance.delete(`/fournisseurs/${values.foId}?type=${values.type || "des"}`).then((res) => res.data)

// produits
const getDepotProduct = (deId) => instance.get(`/produits/depot/${deId}`).then((res) => res.data)
const getFournisseurProduct = (foId) => { if (!foId) return; return instance.get(`/produits/fournisseur/${foId}`).then((res) => res.data) }
const getNotFrsProduct = (values) => {
    const { boId, foId } = values
    if (!boId || !foId) return
    return instance
        .get(`/produits/fournisseur/not/${foId}/${boId}`)
        .then((res) => res.data)
}
const addProduct = (values) => instance.post("/produits", { ...values }).then((res) => res.data)
const editProduct = (values) => instance.put(`/produits/${values.prId}`, { ...values }).then((res) => res.data)
const removeProduct = (prId) => instance.delete(`/produits/${prId}`).then((res) => res.data)

// gerant => utilisateur
const getShopUser = (boId) => instance.get(`/users/boutique/${boId}`).then((res) => res.data)
const getOneShopUser = (usId) => { if (!usId) return; return instance.get(`/users/${usId}`).then((res) => res.data) }
const addGerant = (values) => instance.post("/users_auth/signup", { ...values }).then((res) => res.data)
const deleteShopUser = (values) => instance.delete(`users_auth/${values.usId}/delete?type=${values.type || "des"}`).then((res) => res.data)

// droit
const getUserDroit = (usId) => instance.get(`/users/droit/${usId}`).then((res) => res.data)
const removeUserDroit = (drId) => instance.delete(`/users/droit/${drId}`).then((res) => res.data)
// paiement
const getShopPaiement = (boId) => instance.get(`/users/paiement/boutique/${boId}`).then((res) => res.data)
const addUserPaiement = (values) => instance.post(`/users/paiement`, { ...values }).then((res) => res.data)
const editUserPaiement = (values) => instance.put(`/users/paiement/${values.paId}`, { ...values }).then((res) => res.data)
const removeUserPaiment = (paId) => { if (!paId) return; return instance.delete(`/users/paiement/${paId}`).then((res) => res.data) }

// fonctionnalité important

// achats
const getShopAchats = (boId) => instance.get(`/achats/boutique/${boId}`).then((res) => res.data)
const getAchatCommand = (acId) => instance.get(`/achats/commande/${acId}`).then((res) => res.data)
const addShopAchats = (values) => instance.post("/achats", { ...values }).then((res) => res.data)
const editShopAchats = (values) => {
    if (!values.acId) return
    return instance.put(`/achats/${values.acId}`, { ...values }).then((res) => res.data)
}
const achatsReception = (acId) => instance.post(`/achats/reception/${acId}`).then((res) => res.data)
const removeShopAchats = (acId) => instance.delete(`/achats/${acId}`).then((res) => res.data)
const getAchatPdf = (acId) => {
    if (!acId) return
    return instance.get(`/documents/achat/${acId}`).then((res) => res.data)
}

// vendres / ventes
const getShopVendre = (boId) => instance.get(`/vendres/boutique/${boId}`).then(res => res.data)
const getVendreVente = (vendId) => {
    if (!vendId) return
    return instance.get(`/vendres/ventes/${vendId}`).then(res => res.data)
}

export {
    getShopDepots,
    getShopDepotsTrash,
    addDepots,
    editDepot,
    removeDepot,
    getShopFournisseurTrash,
    addFournisseur,
    getShopFournisseur,
    editFournisseur,
    deleteFournisseur,
    getDepotProduct,
    getFournisseurProduct,
    getNotFrsProduct,
    addProduct,
    editProduct,
    removeProduct,
    getShopUser,
    getOneShopUser,
    addGerant,
    deleteShopUser,
    getUserDroit,
    removeUserDroit,
    getShopPaiement,
    addUserPaiement,
    editUserPaiement,
    removeUserPaiment,
    getShopAchats,
    getAchatCommand,
    addShopAchats,
    editShopAchats,
    removeShopAchats,
    achatsReception,
    getAchatPdf,
    getShopVendre,
    getVendreVente,
}
