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
import NavBar from "../components/NavBar"

const Add = () => {
    return (
        <>
            <Flex minH="100vh" justify="start" flexDirection={"column"} bg={useColorModeValue("gray.50", "gray.800")}>
                <NavBar />
                <Stack spacing={8} mx="auto" maxWidth="2xl" py={12} px={6}>
                    <Stack align="center">
                        <Heading fontSize="4xl" textAlign="center">
                            Add a proposal
                        </Heading>
                        <Text fontSize="lg" color="gray.600" textAlign="center">
                            Add a new proposal or volunteer to lead a proposal by submitting a memo.
                        </Text>
                    </Stack>
                    <Box rounded="lg" bg={useColorModeValue("white", "gray.700")} boxShadow="lg" p={8}>
                        <Stack spacing={4}>
                            <FormControl id="protocol" isRequired>
                                <FormLabel>Protocol</FormLabel>
                                <Input type="text" placeholder="e.g. MakerDAO" onChange={(e) => {}} />
                            </FormControl>
                            <FormControl id="type" isRequired>
                                <FormLabel>Vote type</FormLabel>
                                <Input type="text" placeholder="e.g. Executive Vote" onChange={(e) => {}} />
                            </FormControl>
                            <FormControl id="mip" isRequired>
                                <FormLabel>MIP</FormLabel>
                                <Input type="text" placeholder="e.g. MIP61" onChange={(e) => {}} />
                            </FormControl>
                            <FormControl id="title" isRequired>
                                <FormLabel>Proposal title</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g. Onboarding Real World Assets"
                                    onChange={(e) => {}}
                                />
                            </FormControl>
                            <FormControl id="mip" isRequired>
                                <FormLabel>MIP</FormLabel>
                                <Input type="text" placeholder="e.g. MIP61" onChange={(e) => {}} />
                            </FormControl>
                            <FormControl id="dateCreated" isRequired>
                                <FormLabel>Date Created</FormLabel>
                                <Input type="date" onChange={(e) => {}} />
                            </FormControl>
                            <FormControl id="dateExpiry" isRequired>
                                <FormLabel>Deadline</FormLabel>
                                <Input type="date" onChange={(e) => {}} />
                            </FormControl>
                            <FormControl id="voteUrl" isRequired>
                                <FormLabel>Vote URL</FormLabel>
                                <Input type="url" onChange={(e) => {}} />
                            </FormControl>
                            <FormControl id="forumUrl" isRequired>
                                <FormLabel>Forum URL</FormLabel>
                                <Input type="url" onChange={(e) => {}} />
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    bg="blue.400"
                                    color="white"
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                    onClick={() => {}}
                                >
                                    Submit Proposal
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}

export default Add
