import "../styles/globals.css"
import { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { UserProvider } from "@auth0/nextjs-auth0"
import { extendTheme } from "@chakra-ui/react"

const colors = {}

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </UserProvider>
    )
}

export default MyApp
