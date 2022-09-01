import { Status } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const puppeteer = require("puppeteer")

const scrape = async () => {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()

    await page.goto("https://vote.makerdao.com/polling")
    var element = await page.waitForSelector("#__NEXT_DATA__")
    var text = await page.evaluate((element: { textContent: any }) => element.textContent, element)

    browser.close()
    return text
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).send({ message: "Only GET requests allowed" })
        return
    }

    const text = await scrape()
    const polls = JSON.parse(text).props.pageProps.polls
    const data = polls.map((p: any) => {
        return {
            title: p.title,
            type: "Poll",
            voteType: p.parameters.inputFormat.type
                .split("-")
                .map((word: string[]) => word[0].toUpperCase() + String(word).substring(1))
                .join(" "),
            options: Object.values(p.options),
            dateAdded: p.startDate,
            dateExpiry: p.endDate,
            voteUrl: `https://vote.makerdao.com/polling/${p.slug}`,
            forumUrl: p.discussionLink,
            status: Status.Unassigned,
        }
    })
    res.status(200).json(data)
}
