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
                            <SideBarItem label="Type" contents={proposal.type} />
                            <SideBarItem label="Author" contents={proposal.author.name} />
                            <SideBarItem
                                label="Date Added"
                                contents={new Date(proposal.dateAdded).toLocaleDateString("en-UK", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            />
                            <SideBarItem
                                label="Deadline"
                                contents={new Date(proposal.dateExpiry).toLocaleDateString("en-UK", {
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
