import {Octokit} from "@octokit/core";
import {Endpoints} from "@octokit/types";

export type OrganizationId = string
export type RepositoryId = string
export type UserLogin = string

const octokit = new Octokit({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    auth: import.meta.env.VITE_GITHUB_TOKEN
})

type Unpacked<T> = T extends (infer U)[] ? U : T;
export type PullRequests = Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"];
export type PullRequest = Unpacked<PullRequests>;
export type OrganizationList = Endpoints["GET /user/orgs"]["response"]["data"];
export type OrganizationListItem = Unpacked<OrganizationList>;
export type CheckSuite = Endpoints["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"]["response"]["data"];
export type BuildStatus = 'success' | 'failure' | 'in_progress' | null;
export type Reviews = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"]["response"]["data"];
export type User = Unpacked<Reviews>["user"];

const getPullRequests = async (organizationId: OrganizationId, repoConfig: RepositoryConfig): Promise<PullRequest[]> => {
    return await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: organizationId,
        repo: repoConfig.id,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(res => res.data)
        .then(prs => {
            if (repoConfig.logins) {
                return prs.filter(filterByLogin(repoConfig.logins))
            }
            return prs;
        })
}

const filterByLogin = (logins: UserLogin[]) => (pr: PullRequest): boolean => {
    return pr.user?.login ? logins.includes(pr.user.login) : true
}

const getBuildStatus = async (pullRequest: PullRequest): Promise<BuildStatus> => {
    return await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}/check-suites', {
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        ref: pullRequest.head.ref,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(res => res.data)
        .then(data => {
            const pendingStatuses: CheckSuite['check_suites'][0]['status'][] = ["in_progress", "waiting", "requested", "pending"];
            const pendingCheck = data.check_suites.find(check => pendingStatuses.includes(check.status))
            if(pendingCheck){
                return 'in_progress';
            }

            const failureConclusions: CheckSuite['check_suites'][0]['conclusion'][] = [
                "failure", "cancelled", "timed_out", "action_required", "startup_failure", "stale"]

            const failCheck = data.check_suites.find(check => failureConclusions.includes(check.conclusion))
            const successCheck = data.check_suites.find(check => check.conclusion === 'success')

            return failCheck ? 'failure' : successCheck ? 'success' : null;
        })
}

const getReviews = async (pullRequest: PullRequest): Promise<Reviews> => {
    return await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        pull_number: pullRequest.number,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(res => res.data)
}

const getOrganizations = async (): Promise<OrganizationListItem[]> => {
    return await octokit.request('GET /user/orgs', {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(res => res.data)
}

export interface OrganizationConfig {
    id: OrganizationId,
    repositories: RepositoryConfig[]
}

export interface RepositoryConfig {
    id: RepositoryId,
    logins?: UserLogin[]
}

export default {
    getOrganizations,
    getPullRequests,
    getBuildStatus,
    getReviews
}
