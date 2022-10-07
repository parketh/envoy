import { Status } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const puppeteer = require("puppeteer")

enum ProposalType {
    poll,
    executive,
}

const scrape = async (type: ProposalType) => {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()

    const slug = type === ProposalType.poll ? "polling" : "executive"
    await page.goto(`https://vote.makerdao.com/${slug}`)
    var element = await page.waitForSelector("#__NEXT_DATA__")
    var text = await page.evaluate((element: { textContent: any }) => element.textContent, element)

    browser.close()

    const entries = JSON.parse(text).props.pageProps[slug === "polling" ? "polls" : "proposals"]
    const data =
        slug === "polling"
            ? entries.map((p: any) => {
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
                      voteUrl: `https://vote.makerdao.com/${slug}/${p.slug}`,
                      forumUrl: p.discussionLink,
                      status: Status.Unassigned,
                  }
              })
            : entries.map((p: any) => {
                  return {
                      title: p.title,
                      type: "Executive Proposal",
                      voteType: "Executive Proposal",
                      options: [],
                      dateAdded: p.spellData.datePassed,
                      dateExpiry: p.spellData.expiration,
                      dateExecuted: p.spellData.dateExecuted,
                      voteUrl: `https://vote.makerdao.com/${slug}/${"template-executive-vote-"}${String(p.title)
                          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                          .replace(/ +(?= )/g, "")
                          .toLowerCase()
                          .replace(/ /g, "-")}${"#proposal-detail"}`,
                      forumUrl: "",
                      status: Status.Unassigned,
                  }
              })
    return data
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).send({ message: "Only GET requests allowed" })
        return
    }

    const polls = await scrape(ProposalType.poll)
    const proposals = await scrape(ProposalType.executive)

    const data = polls.concat(proposals)

    res.status(200).json(data)
}
