import {
    Stack,
    Text,
    useColorModeValue,
    Link,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    HStack,
} from "@chakra-ui/react"

import { ProposalWithRelations } from "../pages/dashboard"

const SideBar = ({
    proposal,
    onClose,
    isOpen,
}: {
    proposal: ProposalWithRelations | undefined
    onClose: () => void
    isOpen: boolean
}) => {
    if (!proposal) return <></>

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
                            <SideBarItem label="Status" contents={proposal.status} />
                            <SideBarItem label="Type" contents={proposal.type} />
                            <SideBarItem label="Added By" contents={proposal.author.name} />
                            <SideBarItem label="Proposal Lead" contents={proposal.memo?.author.name || ""} />
                            <SideBarItem label="Date Added" contents={DateWrapper(proposal.dateAdded)} />
                            <SideBarItem label="Deadline" contents={DateWrapper(proposal.dateExpiry)} />
                            <SideBarItemLink label="Vote URL" link={proposal.voteUrl} />
                            <SideBarItemLink label="Forum URL" link={proposal.forumUrl} />
                            <SideBarItemLink label="Memo" link={`/memo/${proposal.memo?.id}`} />
                            {proposal.decision ? <SideBarItem label="Decision" contents={proposal.decision} /> : <></>}
                            {proposal.dateVoted ? (
                                <SideBarItem label="Date Voted" contents={DateWrapper(proposal.dateVoted)} />
                            ) : (
                                <></>
                            )}
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter width="100%">
                        <Stack width="100%" spacing={4}>
                            <Button
                                loadingText="Opening"
                                size="md"
                                bg={useColorModeValue("gray.300", "gray.500")}
                                color={useColorModeValue("gray.800", "white")}
                                _hover={{
                                    bg: useColorModeValue("gray.400", "gray.600"),
                                }}
                                onClick={() => {}}
                            >
                                View Proposal
                            </Button>
                            <Button
                                loadingText="Opening"
                                size="md"
                                bg={proposal.memo ? "blue.400" : useColorModeValue("gray.300", "gray.500")}
                                color={proposal.memo ? "white" : useColorModeValue("gray.800", "white")}
                                _hover={{
                                    bg: proposal.memo ? "blue.500" : useColorModeValue("gray.400", "gray.600"),
                                }}
                                onClick={() => {}}
                            >
                                {proposal.memo ? "View" : "Add"} Memo
                            </Button>

                            {proposal.memo ? (
                                <Button
                                    loadingText="Submitting"
                                    size="md"
                                    bg="green.400"
                                    color="white"
                                    _hover={{
                                        bg: "green.500",
                                    }}
                                    onClick={() => {}}
                                >
                                    Mark Submitted
                                </Button>
                            ) : (
                                <></>
                            )}
                        </Stack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

const DateWrapper = (date: Date) => {
    const wrappedDate = new Date(date).toLocaleDateString("en-UK", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })

    return wrappedDate
}

const SideBarItem = ({ label, contents }: { label: string; contents: string }) => {
    return (
        <Stack spacing={0}>
            <Text fontSize="xs" fontWeight={"bold"} color={useColorModeValue("gray.400", "gray.500")}>
                {label.toUpperCase()}
            </Text>
            <Text fontSize="sm">{contents}</Text>
        </Stack>
    )
}

const SideBarItemLink = ({ label, link }: { label: string; link: string }) => {
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

export default SideBar
