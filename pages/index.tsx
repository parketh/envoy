import React, { useEffect } from "react"
import Router from "next/router"
import NavBar from "../components/NavBar"

export default function Home() {
    useEffect(() => {
        const { pathname } = Router
        if (pathname == "/") {
            Router.push("/dashboard")
        }
    })

    return (
        <>
            <NavBar />
        </>
    )
}
