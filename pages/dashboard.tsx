import {
    Flex,
    Box,
    Stack,
    Heading,
    Text,
    useColorModeValue,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Link,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { GetStaticProps } from "next"
import { Prisma } from "@prisma/client"

import NavBar from "../components/NavBar"
import prisma from "../lib/prisma"
import SideBar from "../components/SideBar"
import { server } from "../config"

type ProposalsWithRelations = Prisma.PromiseReturnType<typeof getProposals>
export type ProposalWithRelations = ProposalsWithRelations[0]

export const getStaticProps: GetStaticProps = async () => {
    const unassigned = await getProposals("Unassigned", false)
    const assigned = await getProposals("Assigned", false)

    return {
        props: {
            unassigned: JSON.parse(JSON.stringify(unassigned)),
            assigned: JSON.parse(JSON.stringify(assigned)),
        },
        revalidate: 10,
    }
}

const getProposals = async (status: string | null, past: boolean) => {
    const response: any = await fetch(`${server}/api/proposal/get?status=${status}&past=${past === true ? 1 : 0}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        },
    })

    const proposals = await response.json()
    return proposals
}

const Dashboard = ({
    unassigned,
    assigned,
}: {
    unassigned: Array<ProposalWithRelations>
    assigned: Array<ProposalWithRelations>
}) => {
    const [pastProposals, setPastProposals] = useState<Array<ProposalWithRelations>>()

    const fetchPastProposals = async () => {
        const proposals = await getProposals(null, true)
        setPastProposals(proposals)
    }

    return (
        <>
            <Flex minH="100vh" justify="start" flexDirection={"column"} bg={useColorModeValue("gray.50", "gray.800")}>
                <NavBar />
                <Stack spacing={8} mx="auto" width={{ sm: "full", md: "4xl" }} py={12} px={6}>
                    <Stack align="center">
                        <Heading fontSize="4xl" textAlign="center">
                            Dashboard
                        </Heading>
                        <Text fontSize="lg" color="gray.600" textAlign="center">
                            Monitor live proposals and submit recommendations.
                        </Text>
                    </Stack>
                    <ProposalGroup proposals={unassigned} type="Unassigned" />
                    <ProposalGroup proposals={assigned} type="Assigned" />
                    {pastProposals ? (
                        <ProposalGroup proposals={pastProposals} type="Past" />
                    ) : (
                        <Box rounded="lg" bg={useColorModeValue("white", "gray.700")} boxShadow="lg" p={8}>
                            <VStack align="start">
                                <Text
                                    align="left"
                                    as="b"
                                    fontSize="sm"
                                    color={useColorModeValue("blue.400", "gray.600")}
                                    _hover={{
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        color: useColorModeValue("blue.500", "gray.600"),
                                    }}
                                    onClick={() => fetchPastProposals()}
                                >
                                    Load past proposals
                                </Text>
                            </VStack>
                        </Box>
                    )}
                </Stack>
            </Flex>
        </>
    )
}

const ProposalGroup = ({ proposals, type }: { proposals: Array<ProposalWithRelations>; type: string }) => {
    const [active, setActive] = useState<ProposalWithRelations>()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleClick = (proposal: ProposalWithRelations) => {
        setActive(proposal)
        onOpen()
    }

    return (
        <>
            <Box rounded="lg" bg={useColorModeValue("white", "gray.700")} boxShadow="lg" p={8}>
                <Text align="left" as="b" fontSize="sm">
                    {`${type} (${proposals.length})`}
                </Text>
                <TableContainer overflowX="auto" pt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr>
                                <Th>Due date</Th>
                                {type === "Unassigned" ? <></> : <Th>Owner</Th>}
                                <Th>Title</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {proposals
                                .sort((a, b) => {
                                    return Date.parse(b.dateExpiry) - Date.parse(a.dateExpiry)
                                })
                                .map((p, i) => (
                                    <Tr
                                        _hover={{
                                            textDecoration: "none",
                                            cursor: "pointer",
                                            bg: useColorModeValue("gray.200", "gray.600"),
                                        }}
                                        onClick={() => handleClick(p)}
                                        key={i}
                                    >
                                        <Td>
                                            {new Date(p.dateExpiry).toLocaleDateString("en-UK", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </Td>
                                        {p.memo ? (
                                            <Td>{p.memo?.author.name}</Td>
                                        ) : (
                                            <Td textColor={useColorModeValue("gray.400", "gray.500")}>Unassigned</Td>
                                        )}
                                        <Td>{p.title}</Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <SideBar proposal={active} onClose={onClose} isOpen={isOpen} />
        </>
    )
}

export default Dashboard
