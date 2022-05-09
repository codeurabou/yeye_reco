import React from 'react'
import { Divider, Text, Title } from "@mantine/core"

function Hero({ title, order, children, desc }) {
    return (
        <header>
            <Title order={order || 1}>{title}</Title>
            {desc && <Text>Description : {desc}</Text>}
            {children && children}
            <Divider m={5} />
        </header>
    )
}

export default Hero