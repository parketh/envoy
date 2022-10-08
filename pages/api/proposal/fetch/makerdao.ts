import { Status } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

import puppeteer from "puppeteer-core"
import chrome from "chrome-aws-lambda"

enum ProposalType {
    poll,
    executive,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).send({ message: "Only GET requests allowed" })
        return
    }

    const scrape = async (type: ProposalType) => {
        const slug = type === ProposalType.poll ? "polling" : "executive"

        const browser = await puppeteer.launch(
            process.env.NODE_ENV === "production"
                ? {
                      args: chrome.args,
                      executablePath: await chrome.executablePath,
                      headless: chrome.headless,
                  }
                : {}
        )

        const page = await browser.newPage()
        page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
        )
        await page.goto(`https://vote.makerdao.com/${slug}`)
        const element = await page.waitForSelector("#__NEXT_DATA__")
        const text = await page.evaluate((element: any) => element?.textContent, element)

        browser.close()

        if (!text) return []

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

    const polls = await scrape(ProposalType.poll)
    const proposals = await scrape(ProposalType.executive)

    const data = polls.concat(proposals)

    res.status(200).json(data)
}
