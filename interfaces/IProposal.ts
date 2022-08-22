interface IProposal {
    id: number
    author: String
    dateAdded: Date
    type: String
    mip: String
    title: String
    dateCreated: Date
    dateExpiry: Date
    voteUrl: String
    forumUrl: String
    memo: number
    status: String
    commentors: Array<String>
    decision: String
    dateVoted: Date | undefined
}

export default IProposal
