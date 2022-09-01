import { Prisma, Proposal, Status } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const data = req.body

        const createProposal = async (data: Prisma.ProposalCreateInput): Promise<Proposal> => {
            return await prisma.proposal.create({
                data: data,
            })
        }

        try {
            const newProposal = await createProposal(data)
            res.status(200).json(newProposal)
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    res.status(404).send({
                        error: "There is a unique constraint violation, a new proposal with this title already exists",
                    })
                }
            }
        }
    } else if (req.method === "GET") {
        const data = {
            title: "PPG - Open Market Committee Proposal - August 29, 2022",
            protocol: {
                connect: {
                    name: "MakerDAO",
                },
            },
            type: "Poll",
            dateAdded: "2022-08-29T16:00:00.000Z",
            dateExpiry: "2022-09-01T16:00:00.000Z",
            voteType: "Rank Free",
            options: ["Abstain", "Option 1", "Option 2", "No changes"],
            voteUrl: "https://vote.makerdao.com/polling/QmXHnn2u",
            forumUrl: "https://forum.makerdao.com/t/parameter-changes-proposal-ppg-omc-001-25-august-2022/17448",
            status: Status.Unassigned,
        }

        const createProposal = async (data: Prisma.ProposalCreateInput): Promise<Proposal> => {
            return await prisma.proposal.create({
                data: data,
            })
        }

        try {
            const newProposal = await createProposal(data)
            res.status(200).json(newProposal)
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    res.status(404).send({
                        error: "There is a unique constraint violation, a new proposal with this title already exists",
                    })
                }
            }
        }
    } else {
        res.status(405).send({ message: "Only POST requests allowed" })
        return
    }
}
