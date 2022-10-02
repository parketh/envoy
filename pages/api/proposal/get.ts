import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).send({ message: "Only GET requests allowed" })
        return
    }

    const { status, past } = req.query

    let whereOptions = {}

    if (Number(past) === 1) {
        whereOptions = {
            dateExpiry: {
                lt: new Date(),
            },
        }
    } else {
        whereOptions = {
            status: status,
            dateExpiry: {
                gte: new Date(),
            },
        }
    }

    const proposals = await prisma.proposal.findMany({
        where: whereOptions,
        include: {
            memo: {
                include: {
                    author: true,
                },
            },
        },
    })

    res.status(200).json(proposals)
}
