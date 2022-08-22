import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from "@chakra-ui/react"
import NavBar from "../../components/NavBar"

const Add = () => {
    return (
        <>
            <NavBar />
            <Flex minH="100vh" justify="center" bg={useColorModeValue("gray.50", "gray.800")}>
                <Stack spacing={8} mx="auto" width="3xl" py={12} px={6}>
                    <Stack align="center">
                        <Heading fontSize="4xl" textAlign="center">
                            Proposal
                        </Heading>
                    </Stack>
                    <Box
                        rounded="lg"
                        bg={useColorModeValue("white", "gray.700")}
                        boxShadow="lg"
                        p={8}
                        fontSize="small"
                    ></Box>
                </Stack>
            </Flex>
        </>
    )
}

export default Add
