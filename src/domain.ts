export type OrganizationId = string
export type RepositoryId = string
export type UserLogin = string

export type BuildStatus = 'success' | 'failure' | 'in_progress' | null;

export type Author = {
    login: string
    avatarUrl: string
}

export type ReviewState = 'approved' | 'changes_requested' | 'pending' | 'commented' | 'dismissed';

export interface Review {
    id: string
    author: Author
    state: ReviewState
}

export interface Release {
    tagName: string
    url: string
    aheadCount: number
}

export interface PullRequest {
    id: string
    author: Author
    url: string
    title: string
    isDraft: boolean
    buildStatus: BuildStatus
    reviews: Review[]
}

export interface GithubRepositoryData {
    latestRelease: Release | null,
    pullRequests: PullRequest[]
    branchCount: number
}

export interface OrganizationConfig {
    id: OrganizationId,
    repositories: RepositoryConfig[]
}

export interface RepositoryConfig {
    id: RepositoryId,
    logins?: UserLogin[]
}