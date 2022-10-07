import { Status } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { launchChromium } from "playwright-aws-lambda"

enum ProposalType {
    poll,
    executive,
}

const scrape = async (type: ProposalType) => {
    const slug = type === ProposalType.poll ? "polling" : "executive"

    const browser = await launchChromium({
        headless: true, // setting this to true will not run the UI
    })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(`https://vote.makerdao.com/${slug}`)
    let text = await page.innerHTML("#__NEXT_DATA__")
    await browser.close()

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
