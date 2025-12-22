import {Octokit} from "@octokit/core";
import {Organization} from "./domain.ts";

const octokit = new Octokit({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    auth: import.meta.env.VITE_GITHUB_TOKEN
})

const getOrganizations = async (): Promise<Organization[]> => {
    const user = await octokit.request('GET /user', {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(res => res.data)
    const organizations = await octokit.request('GET /user/orgs', {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(res => res.data)
    return [
        {id: user.login, label: user.login, avatarUrl: user.avatar_url},
        ...organizations.map((organization): Organization => ({
            id: organization.login,
            label: organization.login,
            avatarUrl: organization.avatar_url
        }))
    ]
}

export default {
    getOrganizations
}
