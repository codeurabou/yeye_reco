import React, { useState } from 'react'
import { Header, Title, MediaQuery, Burger } from "@mantine/core"
import { NavLink } from 'react-router-dom'
import styled from "styled-components"

// css
const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`


function AppHeader() { // ouverture + fermeture => effet de bord


    return (
        <Header height={70} p={15} sx={(theme) => ({ backgroundColor: theme.colors.blue[6] })} >
            <HeaderContainer>
                <div>
                    <NavLink style={{
                        display: "flex",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "33px",
                    }} to="/acceuil">Yeye</NavLink>
                </div>
                {/* <MediaQuery>
                    <Burger />
                </MediaQuery> */}
            </HeaderContainer>
        </Header>
    )
}

export default AppHeader