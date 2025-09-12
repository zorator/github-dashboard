import {Octokit} from "@octokit/core";
import {Endpoints} from "@octokit/types";

const octokit = new Octokit({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    auth: import.meta.env.VITE_GITHUB_TOKEN
})

type Unpacked<T> = T extends (infer U)[] ? U : T;
export type OrganizationList = Endpoints["GET /user/orgs"]["response"]["data"];
export type OrganizationListItem = Unpacked<OrganizationList>;

const getOrganizations = async (): Promise<OrganizationListItem[]> => {
    return await octokit.request('GET /user/orgs', {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(res => res.data)
}

export default {
    getOrganizations
}
