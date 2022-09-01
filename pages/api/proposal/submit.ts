import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed" })
        return
    }

    const data = JSON.parse(req.body)
    res.status(200).json({ data: data })
    console.log(data)
    const { user, protocol, type, title, dateAdded, deadline, voteUrl, forumUrl } = data

    const retrievedProtocol = await prisma.protocol.findUnique({
        where: {
            name: protocol,
        },
    })

    const retrievedDelegate = await prisma.delegate.findUnique({
        where: {
            email: user?.name ? user.name : undefined,
        },
    })

    console.log(retrievedProtocol)
    console.log(retrievedDelegate)

    if (!retrievedDelegate) {
        console.error("Delegate not found.")
        return
    }

    if (!retrievedProtocol) {
        console.error("Delegate not found.")
        return
    }

    // const newProposal = await prisma.proposal.create({
    //     data: {
    //         title: title || "",
    //         author: {
    //             connect: { id: retrievedDelegate.id },
    //         },
    //         authorId: retrievedDelegate.id,
    //         protocol: {
    //             connect: { id: retrievedProtocol.id },
    //         },
    //         protocolId: retrievedProtocol.id,
    //         type: type || "",
    //         dateAdded: dateAdded || "",
    //         dateExpiry: deadline || "",
    //         voteUrl: voteUrl || "",
    //         forumUrl: forumUrl || "",
    //     },
    // })
    // res.status(200).json({ data: newProposal })
    return
}
