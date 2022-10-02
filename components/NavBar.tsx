import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorMode,
    useColorModeValue,
    Stack,
    Divider,
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons"
import { useUser } from "@auth0/nextjs-auth0"

const pages: Array<{ domain: String; title: String }> = [
    {
        domain: "dashboard",
        title: "Dashboard",
    },
]

const NavBar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()
    const { user } = useUser()

    return (
        <>
            <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} pos="sticky" top="0" left="0" zIndex={50}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <IconButton
                        size={"md"}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={"center"}>
                        <Box fontWeight="black" letterSpacing={"wider"} fontSize="xl" ml="2">
                            ENVOY
                        </Box>
                        <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
                            {pages.map((page, i) => (
                                <NavLink key={i} domain={page.domain} title={page.title} />
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={"center"}>
                        <HStack spacing={4}>
                            <Box display={{ base: "none", lg: "flex" }}>
                                {user ? `Welcome, ${user.name?.split(" ")[0]}` : ""}
                            </Box>
                            <Box display={{ base: "none", lg: "flex" }}>
                                {user ? (
                                    <NavLink domain={"api/auth/logout"} title={"Logout"} />
                                ) : (
                                    <NavLink domain={"api/auth/login"} title={"Login"} />
                                )}
                            </Box>
                            <Button mr={4} onClick={toggleColorMode}>
                                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                            </Button>
                        </HStack>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: "none" }}>
                        <Stack as={"nav"} spacing={4}>
                            {pages.map((page) => (
                                <NavLink domain={page.domain} title={page.title} />
                            ))}
                            <Divider />
                            <Box px={2} py={1}>
                                {user ? `Welcome, ${user?.nickname}` : ""}
                            </Box>
                            {user ? (
                                <NavLink domain={"api/auth/logout"} title={"Logout"} />
                            ) : (
                                <NavLink domain={"api/auth/login"} title={"Login"} />
                            )}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    )
}

const NavLink = ({ domain, title }: { domain: String; title: String }) => (
    <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={`/${domain}`}
    >
        {title}
    </Link>
)

export default NavBar
