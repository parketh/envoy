import { NextApiRequest, NextApiResponse } from "next"

interface IProposalInfo {
    title: string
    protocol: {
        connect: {
            name: string
        }
    }
    type: string
    dateAdded: Date
    dateExpiry: Date
    dateExexcuted: Date
    voteType: string
    options: Array<string>
    voteUrl: string
    forumUrl: string
    status: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).send({ message: "Only GET requests allowed" })
        return
    }

    const proposalResponse: any = await fetch("/api/proposal/fetch/makerdao", {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        },
    })

    const fetchedProposals: Promise<Array<IProposalInfo>> = await proposalResponse.json()

    for (const selectedProposal of await fetchedProposals) {
        const data = {
            title: selectedProposal.title,
            protocol: {
                connect: {
                    name: "MakerDAO",
                },
            },
            type: selectedProposal.type,
            dateAdded: selectedProposal.dateAdded,
            dateExpiry: selectedProposal.dateExpiry,
            voteType: selectedProposal.voteType,
            options: selectedProposal.options,
            voteUrl: selectedProposal.voteUrl,
            forumUrl: selectedProposal.forumUrl,
            status: selectedProposal.status,
        }

        const response: any = await fetch("/api/proposal/add", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json, text/plain, */*",
                "User-Agent": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
            },
            body: JSON.stringify(data),
        })

        // const newProposal = await response.json()
    }
    res.status(200).json({ message: "done" })
}
