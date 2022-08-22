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
} from "@chakra-ui/react"
import NavBar from "../components/NavBar"
import { useState } from "react"
import prisma from "../lib/prisma"
import { GetStaticProps } from "next"
import { Prisma } from "@prisma/client"
import SideBar from "../components/SideBar"

type ProposalsWithRelations = Prisma.PromiseReturnType<typeof getProposals>
export type ProposalWithRelations = ProposalsWithRelations[0]

export const getStaticProps: GetStaticProps = async () => {
    const unassigned = await getProposals("Unassigned", false)
    const assigned = await getProposals("Assigned", false)
    const past = await getProposals(null, true)

    return {
        props: {
            unassigned: JSON.parse(JSON.stringify(unassigned)),
            assigned: JSON.parse(JSON.stringify(assigned)),
            past: JSON.parse(JSON.stringify(past)),
        },
        revalidate: 10,
    }
}

const getProposals = async (status: any, past: boolean) => {
    const whereOptions = past
        ? {
              dateExpiry: {
                  lt: new Date(),
              },
          }
        : {
              status: status,
              dateExpiry: {
                  gte: new Date(),
              },
          }

    const proposals = await prisma.proposal.findMany({
        where: whereOptions,
        include: {
            author: true,
            memo: {
                include: {
                    author: true,
                },
            },
        },
    })

    console.log(proposals)

    return proposals
}

const Dashboard = ({
    unassigned,
    assigned,
    past,
}: {
    unassigned: Array<ProposalWithRelations>
    assigned: Array<ProposalWithRelations>
    past: Array<ProposalWithRelations>
}) => {
    return (
        <>
            <Flex minH="100vh" justify="start" flexDirection={"column"} bg={useColorModeValue("gray.50", "gray.800")}>
                <NavBar />
                <Stack spacing={8} mx="auto" width="4xl" py={12} px={6}>
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
                    <ProposalGroup proposals={past} type="Past" />
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

    if (!proposals.length) return <></>

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
                                {type === "Unassigned" ? <></> : <Th>Lead</Th>}
                                <Th>Title</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {proposals.map((p) => (
                                <Tr
                                    _hover={{
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        bg: useColorModeValue("gray.200", "gray.600"),
                                    }}
                                    onClick={() => handleClick(p)}
                                >
                                    <Td>
                                        {new Date(p.dateExpiry).toLocaleDateString("en-UK", {
                                            day: "numeric",
                                            month: "short",
                                        })}
                                    </Td>
                                    {type === "Unassigned" ? <></> : <Td>{p.memo?.author.name}</Td>}
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
