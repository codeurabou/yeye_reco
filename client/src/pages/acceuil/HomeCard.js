import { Card, Spoiler, Text, Title } from '@mantine/core'
import React from 'react'

function HomeCard({ title, total, desc, mw }) {
    return (
        <Card shadow="lg" m={5} sx={(theme) => ({ backgroundColor: theme.colors.gray[3] })} style={{ maxWidth: `${mw || 193}px` }} >
            <header>
                {title}
                <Title>{total}</Title>
            </header>
            <Spoiler maxHeight={0} showLabel="description" hideLabel="Fermer">
                <Text>{desc}</Text>
            </Spoiler>
        </Card>
    )
}

export default HomeCard