import { Prisma, Proposal, Status } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const data = req.body

        const createProposal = async (data: Prisma.ProposalCreateInput): Promise<Proposal> => {
            return await prisma.proposal.create({
                data: {
                    title: data.title,
                    protocol: {
                        connect: {
                            name: "MakerDAO",
                        },
                    },
                    type: data.type,
                    voteType: data.voteType,
                    options: data.options,
                    dateAdded: data.dateAdded,
                    dateExpiry: data.dateExpiry,
                    voteUrl: data.voteUrl,
                    forumUrl: data.forumUrl,
                    status: data.status,
                },
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
                } else {
                    res.status(404).send({
                        error: "Unknown Prisma error",
                    })
                }
            } else {
                res.status(404).send({
                    error: "Unknown error",
                })
            }
        }
    } else {
        res.status(405).send({ message: "Only POST requests allowed" })
        return
    }
}
