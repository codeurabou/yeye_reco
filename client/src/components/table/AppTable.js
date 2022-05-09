import React from "react"
import { Divider, ScrollArea, Table, Text } from "@mantine/core"

function AppTable({ tableHead = [], tableRows = [], title }) {
    return (
        <ScrollArea type="hover">
            {title && (
                <Text color="dimmed" weight="bold" m={5}>
                    {title}
                </Text>
            )}
            <Divider mt={5} />
            <Table>
                <thead>
                    <tr>
                        {tableHead.map((data, idx) => (
                            <th key={idx}>{data}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </Table>
        </ScrollArea>
    )
}

export default AppTable
