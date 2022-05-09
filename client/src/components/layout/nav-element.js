import { useMantineTheme } from "@mantine/core"
import { NavLink } from "react-router-dom"
import styled from "styled-components"


// css
const NavContainer = styled.div`
    display: flex;
    align-items: center;
`

const NavElement = ({ label, icon, route = "/app/dev" }) => {
    const theme = useMantineTheme()
    const activeStyles = ({ isActive }) => {
        return {
            display: "flex",
            flexDirection: "column",
            textDecoration: "none",
            color: (isActive) ? "white" : "black",
            padding: "12px",
            width: "100%",
            margin: '4px',
            borderRadius: (isActive) && "12px",
            backgroundColor: (isActive) && theme.colors.blue[3],
        }
    }

    return (
        <NavContainer>
            {icon && <div style={{ width: "36px" }}>
                {icon}
            </div>}
            <NavLink
                to={route}
                style={(state) => activeStyles(state)}
            >
                {label}
            </NavLink>
        </NavContainer>
    )
}

export { NavElement }