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
        {id: user.login, label: user.login},
        ...organizations.map(organization => ({id: organization.login, label: organization.login}))
    ]
}

export default {
    getOrganizations
}
