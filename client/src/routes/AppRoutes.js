import React from "react"
import { Route, Routes } from "react-router-dom"
import AppLayout from "../components/layout/AppLayout"
import LandingPage from "../pages/bienvenue/LandingPage"
import Home from "../pages/acceuil/Home"
import Deposit from "../pages/depots/Deposit"
import SingleDeposit from "../pages/depots/SingleDeposit"
import GerantPage from "../pages/personnel/GerantPage"
import PaiementPage from "../pages/personnel/PaiementPage"
import FrsPage from "../pages/fournisseurs/FrsPage"
import PrivateRoutes from "./PrivateRoutes"
import DepositTrash from "../pages/depots/DepositTrash"
import FrsPageTrash from "../pages/fournisseurs/FrsPageTrash"
import GerantDetails from "../pages/personnel/GerantDetails"
import CmdFrs from "../pages/commandes/CmdFrs"
import CmdClient from "../pages/commandes/CmdClient"
import DetailsCmdFrs from "../pages/commandes/DetailsCmdFrs"
import AddCmdFrs from "../pages/commandes/AddCmdFrs"
import SoldPage from "../pages/vente/SoldPage"
import SingleSold from "../pages/vente/SingleSold"
import AddSold from "../pages/vente/AddSold"
import SoldPageTrash from "../pages/vente/SoldPageTrash"

// Admin
import AdminLanding from "../pages/bienvenue/AdminLanding"
import AdminLayout from "../components/layout/AdminLayout"
import AddUserPage from "../pages/admin/AddUserPage"
import UserLists from "../pages/admin/UserLists"
import SingleUser from "../pages/admin/SingleUser"
import DisabledLists from "../pages/admin/DisabledLists"
import AdminHome from "../pages/admin/AdminHome"

/**
 * 
 * Metthodologie utilisé :
 * /something pour ne pas avoir de routes vides
 * /app/something => AppLayout + Outlet /app => (facile mais des routes vides)
 * /something => AppLayout + (children,Outlet) : pour les deux cas => acrhitecture robuste wrapper : privateRoutes + Applayout : Outlet
 */

function AppRoutes() {
    return (
        <Routes>
            <Route path="/">
                <Route index element={<LandingPage />} />
                <Route path="admin">
                    <Route index element={<AdminLanding />} />
                    <Route path="dashboard" element={<PrivateRoutes roles={["admin"]} children={<AdminLayout />} />}>
                        <Route index element={<AdminHome />} />
                        <Route path="user/add" element={<AddUserPage />} />
                        <Route path="user/lists" element={<UserLists />} />
                        <Route path="user/disabled" element={<DisabledLists />} />
                        <Route path="user/:id" element={<SingleUser />} />
                    </Route>
                </Route>

                {/* HOC = (PrivateRoute (children) + AppLayout(Outlet)) facilite /something */}
                <Route element={<PrivateRoutes children={<AppLayout />} />}>
                    <Route path="acceuil" element={<Home />} />
                    <Route path="depots">
                        <Route index element={<Deposit />} />
                        <Route path="trash" element={<DepositTrash />} />
                        <Route path=":id" element={<SingleDeposit />} />
                    </Route>
                    <Route path="fournisseurs">
                        <Route index element={<FrsPage />} />
                        <Route path="trash" element={<FrsPageTrash />} />
                    </Route>
                    <Route path="personnels/gerants">
                        <Route index element={<GerantPage />} />
                        <Route path=":id" element={<GerantDetails />} />
                    </Route>
                    <Route path="personnels/paiements" element={<PaiementPage />} />
                    <Route path="commandes/fournisseurs">
                        <Route index element={<CmdFrs />} />
                        <Route path="add" element={<AddCmdFrs />} />
                        <Route path=":id" element={<DetailsCmdFrs />} />
                    </Route>
                    <Route path="commandes/clients" element={<CmdClient />} />

                    <Route path="/ventes">
                        <Route index element={<SoldPage />} />
                        <Route path="add" element={<AddSold />} />
                        <Route path="trash" element={<SoldPageTrash />} />
                        <Route path=":id" element={<SingleSold />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes
// Route prives doit rendre toujours rendre children
// c'est la layout qui gere les groupes d'enfants
