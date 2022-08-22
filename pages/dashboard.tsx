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
import IProposal from "../interfaces/IProposal"
import prisma from "../lib/prisma"
import { GetStaticProps } from "next"
import { Prisma } from "@prisma/client"

export const getStaticProps: GetStaticProps = async () => {
    const unassigned: Prisma.ProposalFindManyArgs = await prisma.proposal.findMany({
        where: {
            status: "Unassigned",
            dateExpiry: {
                gte: new Date(),
            },
        },
        include: {
            author: true,
            memo: true,
        },
    })

    const assigned = await prisma.proposal.findMany({
        where: {
            status: "Assigned",
            dateExpiry: {
                gte: new Date(),
            },
        },
        include: {
            author: true,
            memo: true,
        },
    })

    const past = await prisma.proposal.findMany({
        where: {
            dateExpiry: {
                lt: new Date(),
            },
        },
        include: {
            author: true,
            memo: true,
        },
    })

    return {
        props: { unassigned, assigned, past },
        revalidate: 10,
    }
}

const proposals: Array<IProposal> = [
    {
        id: 1,
        author: "parkyeung",
        dateAdded: new Date("2022-08-21"),
        type: "poll",
        mip: "MIP76",
        title: "Ratification Poll for Makershire Redux (MIP76) - August 8, 2022",
        dateCreated: new Date("2022-08-08"),
        dateExpiry: new Date("2022-08-22"),
        voteUrl: "https://vote.makerdao.com/polling/QmTYQskE",
        forumUrl: "https://forum.makerdao.com/t/mip76-makershire-redux/16400",
        memo: 1,
        status: "unassigned",
        commentors: [],
        decision: "",
        dateVoted: undefined,
    },
    {
        id: 2,
        author: "parkyeung",
        dateAdded: new Date("2022-08-21"),
        type: "poll",
        mip: "MIP4c2-SP15",
        title: "Ratification Poll for Core Unit Offboarding Process Amendments (MIP4c2-SP15) - August 8, 2022",
        dateCreated: new Date("2022-08-08"),
        dateExpiry: new Date("2022-08-22"),
        voteUrl: "https://vote.makerdao.com/polling/QmbBh8t4",
        forumUrl: "https://forum.makerdao.com/t/new-mip4c2-sp15-core-unit-offboarding-process-amendments/15291",
        memo: 2,
        status: "unassigned",
        commentors: [],
        decision: "",
        dateVoted: undefined,
    },
    {
        id: 3,
        author: "diegopollo",
        dateAdded: new Date("2022-08-15"),
        type: "poll",
        mip: "MIP4c2-SP15",
        title: "Ratification Poll for Core Unit Offboarding Process Amendments (MIP4c2-SP15) - August 8, 2022",
        dateCreated: new Date("2022-08-08"),
        dateExpiry: new Date("2022-08-22"),
        voteUrl: "https://vote.makerdao.com/polling/QmbBh8t4",
        forumUrl: "https://forum.makerdao.com/t/new-mip4c2-sp15-core-unit-offboarding-process-amendments/15291",
        memo: 2,
        status: "assigned",
        commentors: [],
        decision: "",
        dateVoted: undefined,
    },
]

const emptyProposal = {
    id: 0,
    author: "",
    dateAdded: new Date(),
    type: "",
    mip: "",
    title: "",
    dateCreated: new Date(),
    dateExpiry: new Date(),
    voteUrl: "",
    forumUrl: "",
    memo: 0,
    status: "",
    commentors: [],
    decision: "",
    dateVoted: undefined,
}

const Dashboard = ({ unassigned, assigned, past }) => {
    const [active, setActive] = useState<IProposal>()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleClick = (proposal: IProposal) => {
        setActive(proposal)
        onOpen()
    }

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
                    <Box rounded="lg" bg={useColorModeValue("white", "gray.700")} boxShadow="lg" p={8}>
                        <Text align="left" as="b">
                            {`Unassigned (${unassigned.length})`}
                        </Text>
                        <TableContainer overflowX="auto" pt={4}>
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Due date</Th>
                                        <Th>MIP</Th>
                                        <Th>Title</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {unassigned.map((p) => (
                                        <Tr>
                                            <Td>
                                                {p.dateExpiry.toLocaleDateString("en-UK", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </Td>
                                            <Td>{p.mip}</Td>
                                            <Td>
                                                <Link
                                                    px={1}
                                                    py={1}
                                                    rounded={"md"}
                                                    _hover={{
                                                        textDecoration: "none",
                                                        bg: useColorModeValue("gray.200", "gray.600"),
                                                    }}
                                                    // href={`/proposal/${p.id}`}
                                                    onClick={() => handleClick(p)}
                                                >
                                                    {p.title}
                                                </Link>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Stack>
            </Flex>
            <SideBar proposal={active ? active : emptyProposal} onClose={onClose} isOpen={isOpen} />
        </>
    )
}

const SideBar = ({ proposal, onClose, isOpen }: { proposal: IProposal; onClose: () => void; isOpen: boolean }) => {
    return (
        <>
            <Drawer onClose={onClose} isOpen={isOpen} size="md">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{"Proposal Details"}</DrawerHeader>
                    <DrawerBody>
                        <Stack spacing={4}>
                            <SideBarItem label="Name" contents={proposal.title} />
                            <SideBarItem label="Type" contents={proposal.type} />
                            <SideBarItem label="MIP" contents={proposal.mip} />
                            <SideBarItem label="Author" contents={proposal.author} />
                            <SideBarItem
                                label="Date Added"
                                contents={proposal.dateAdded.toLocaleDateString("en-UK", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            />
                            <SideBarItem
                                label="Deadline"
                                contents={proposal.dateExpiry.toLocaleDateString("en-UK", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            />
                            <SideBarItemLink label="Vote URL" link={proposal.voteUrl} />
                            vote url forum url memo link decision date voted
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

const SideBarItem = ({ label, contents }: { label: String; contents: String }) => {
    return (
        <Stack spacing={0}>
            <Text fontSize="xs" fontWeight={"bold"} color={useColorModeValue("gray.400", "gray.500")}>
                {label.toUpperCase()}
            </Text>
            <Text fontSize="sm">{contents}</Text>
        </Stack>
    )
}

const SideBarItemLink = ({ label, link }: { label: String; link: String }) => {
    return (
        <Stack spacing={0}>
            <Text fontSize="xs" fontWeight={"bold"} color={useColorModeValue("gray.400", "gray.500")}>
                {label.toUpperCase()}
            </Text>
            <Link href={link} isExternal>
                <Text fontSize="sm" color={useColorModeValue("blue.400", "blue.400")}>
                    {link}
                </Text>
            </Link>
        </Stack>
    )
}

export default Dashboard
