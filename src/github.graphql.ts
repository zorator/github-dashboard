/* eslint-disable */
import {graphql} from "@octokit/graphql";
import GetRepoData from "./getRepoData.graphql?raw"
import {
    Author,
    BuildStatus,
    GithubRepositoryData,
    OrganizationId,
    PullRequest,
    Release,
    RepositoryConfig,
    Review,
    ReviewState
} from "./domain.ts";
import {Actor, GetRepoDataQuery, PullRequestCommit, PullRequestReview, StatusState} from "./generated/types.ts";

const octokitGraphql = graphql.defaults({
    headers: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    }
});

const isNotNullish = <T>(value: T | null | undefined): value is T =>
    value !== undefined && value !== null

// New function to fetch all data with a single GraphQL query
export const getRepositoryData = async (organizationId: OrganizationId, repoConfig: RepositoryConfig): Promise<GithubRepositoryData> => {
    const response: GetRepoDataQuery = await octokitGraphql(GetRepoData, {
        owner: organizationId,
        repoName: repoConfig.id,
    });
    return {
        pullRequests: extractPullRequests(response, repoConfig),
        latestRelease: extractLatestRelease(response),
        // minus one to remove main branch
        branchCount: (response.repository?.refs?.totalCount || 1) - 1
    };
};

const extractLatestRelease = (response: GetRepoDataQuery): Release | null => {
    const latestRelease = response.repository?.latestRelease;
    return latestRelease ? {
        tagName: latestRelease.tagName,
        url: latestRelease.url,
        aheadCount: latestRelease.tag?.compare?.aheadBy || 0
    } : null
}

const extractPullRequests = (response: GetRepoDataQuery, repoConfig: RepositoryConfig): PullRequest[] => {
    const nodes = response.repository?.pullRequests?.nodes || [];
    return nodes
        .filter(isNotNullish)
        .filter(pr => {
            // Apply the user login filter
            if (repoConfig.logins && pr.author) {
                return repoConfig.logins.includes(pr.author.login);
            }
            return true;
        })
        .map(pr => {
            return {
                id: pr.id,
                author: toAuthor(pr.author as Actor),
                url: pr.url,
                title: pr.title,
                isDraft: pr.isDraft,
                buildStatus: processBuildStatus((pr.commits.nodes || []) as PullRequestCommit[]),
                reviews: processReviews((pr.reviews?.nodes || []) as PullRequestReview[]),
            } as PullRequest;
        });
}

const toAuthor = (author: Actor): Author => {
    return {
        login: author.login,
        avatarUrl: author.avatarUrl
    }
}

const processReviews = (reviews: PullRequestReview[]): Review[] => {
    const groupedReviews = reviews
        .filter(isNotNullish)
        .reduce((group: Record<string, Review[]>, review: PullRequestReview) => {
            const key = review.author?.login || '';
            if (!group[key]) {
                group[key] = [];
            }
            group[key].push({
                id: review.id,
                author: toAuthor(review.author as Actor),
                state: review.state.toLowerCase() as ReviewState
            });
            return group;
        }, {});

    return Object.values(groupedReviews).flatMap(reviews => {
        const states: ReviewState[] = ["approved", "changes_requested", "commented", "pending", "dismissed"];
        reviews.sort((a, b) => states.indexOf(a.state) - states.indexOf(b.state));
        return reviews[0];
    });
}

const processBuildStatus = (commits: PullRequestCommit[]): BuildStatus => {
    const commitInfo = commits ? commits[0] : null
    const state = commitInfo?.commit.statusCheckRollup?.state
    switch (state) {
        case StatusState.Error:
        case StatusState.Failure:
            return 'failure'
        case StatusState.Expected:
        case StatusState.Pending:
            return 'in_progress'
        case StatusState.Success:
            return 'success'
    }
    return null;
}

export default {
    getRepositoryData
}
