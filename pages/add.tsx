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
    Select,
} from "@chakra-ui/react"
import { Dispatch, SetStateAction, useState } from "react"
import NavBar from "../components/NavBar"
import { useUser } from "@auth0/nextjs-auth0"

const Add = () => {
    const { user } = useUser()

    const [protocol, setProtocol] = useState<string>()
    const [type, setType] = useState<string>()
    const [title, setTitle] = useState<string>()
    const [dateAdded, setDateAdded] = useState<string>()
    const [deadline, setDeadline] = useState<string>()
    const [voteUrl, setVoteUrl] = useState<string>()
    const [forumUrl, setForumUrl] = useState<string>()

    const submitProposal = async () => {
        const data = {
            user: user,
            protocol: protocol,
            type: type,
            title: title,
            dateAdded: dateAdded,
            deadline: deadline,
            voteUrl: voteUrl,
            forumUrl: forumUrl,
        }

        console.log(data)

        const response = await fetch("api/proposal/submit", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
            },
            body: JSON.stringify(data),
        })

        return
    }

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
                            <FormFieldSelect
                                label="Protocol"
                                options={["MakerDAO", "Aave"]}
                                placeholder={"Select protocol"}
                                input={protocol}
                                setInput={setProtocol}
                            />
                            <FormField
                                type="text"
                                label="Proposal title"
                                placeholder="e.g. Onboarding Real World Assets"
                                input={title}
                                setInput={setTitle}
                                autofocus={true}
                            />
                            <FormField
                                type="date"
                                label="Vote type"
                                placeholder="e.g. Executive Vote"
                                input={type}
                                setInput={setType}
                            />
                            <FormField
                                type="date"
                                label="Date created"
                                placeholder=""
                                input={dateAdded}
                                setInput={setDateAdded}
                            />
                            <FormField
                                type="text"
                                label="Deadline"
                                placeholder=""
                                input={deadline}
                                setInput={setDeadline}
                            />
                            <FormField
                                type="text"
                                label="Vote URL"
                                placeholder="https://vote.makerdao.com/..."
                                input={voteUrl}
                                setInput={setVoteUrl}
                            />
                            <FormField
                                type="text"
                                label="Forum URL"
                                placeholder="https://forum.makerdao.com/..."
                                input={forumUrl}
                                setInput={setForumUrl}
                            />
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="md"
                                    bg="blue.400"
                                    color="white"
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                    onClick={() => submitProposal()}
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

const FormField = ({
    type,
    label,
    placeholder,
    input,
    setInput,
    autofocus,
}: {
    type: string
    label: string
    placeholder: string
    input: any
    setInput: Dispatch<SetStateAction<string | undefined>>
    autofocus?: boolean
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setInput(e.target.value)
    const isError = input === ""

    return (
        <FormControl id="protocol" isInvalid={isError} isRequired>
            <FormLabel fontSize="sm">{label}</FormLabel>
            <Input
                type={type}
                placeholder={placeholder}
                size="sm"
                value={input}
                onChange={handleInputChange}
                autoFocus={autofocus || false}
            />
        </FormControl>
    )
}

const FormFieldSelect = ({
    label,
    placeholder,
    options,
    input,
    setInput,
}: {
    label: string
    placeholder: string
    options: Array<string>
    input: any
    setInput: Dispatch<SetStateAction<string | undefined>>
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setInput(e.target.value)
    const isError = input === ""

    return (
        <FormControl id="protocol" isInvalid={isError} isRequired>
            <FormLabel fontSize="sm">{label}</FormLabel>
            <Select size="sm" placeholder={placeholder} value={input} onChange={handleInputChange}>
                {options.map((op, i) => (
                    <option key={i}>{op}</option>
                ))}
            </Select>
        </FormControl>
    )
}

export default Add
