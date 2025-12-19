// using localStorage hook from another lib than usehook-ts as it is buggy
import {useLocalStorage} from "@uidotdev/usehooks";
import {OrganizationId, RepositoryId, UserLogin} from "../domain.ts";


export interface OrganizationConfigV1 {
    repositoryIds: RepositoryId[],
    userLogins?: UserLogin[]
}

export interface OrganizationConfigV2 {
    teamRepositoryIds: RepositoryId[],
    globalRepositoryIds: RepositoryId[],
    userLogins?: UserLogin[]
}

export interface GroupConfigV3 {
    name: string,
    repositoryIds: RepositoryId[],
    userLogins?: UserLogin[],
    showIndicators: boolean
}

export type FilterConfigV1 = Record<OrganizationId, OrganizationConfigV1>
export type FilterConfigV2 = Record<OrganizationId, OrganizationConfigV2 | undefined>
export type FilterConfigV3 = Record<OrganizationId, GroupConfigV3[] | undefined>

type UseConfigReturn = {
    filterConfig: FilterConfigV3
    setFilterConfig: (config: FilterConfigV3) => void
}

export function useFilterConfig(): UseConfigReturn {
    const [teamConfig] = useLocalStorage<FilterConfigV1>('repo-filter-team', {})
    const [globalConfig] = useLocalStorage<FilterConfigV1>('repo-filter-global', {})

    const [filterConfigV2] = useLocalStorage<FilterConfigV2>('repo-config', convertV1toV2(teamConfig, globalConfig))

    const [filterConfig, setFilterConfig] = useLocalStorage<FilterConfigV3>('grouped-repo-config', convertV2toV3(filterConfigV2))

    return {
        filterConfig, setFilterConfig
    }
}

function convertV1toV2(teamConfig: FilterConfigV1, globalConfig: FilterConfigV1) {
    const config: FilterConfigV2 = {}
    Object.entries(teamConfig).forEach(([orgId, filterConf]) => {
        config[orgId] = {
            teamRepositoryIds: filterConf.repositoryIds,
            globalRepositoryIds: []
        }
    })
    Object.entries(globalConfig).forEach(([orgId, filterConf]) => {
        config[orgId] = {
            teamRepositoryIds: config[orgId] == null ? [] : config[orgId].teamRepositoryIds,
            globalRepositoryIds: filterConf.repositoryIds,
            userLogins: filterConf.userLogins
        }
    })
    return config;
}

function convertV2toV3(filterConfig: FilterConfigV2) {
    const config: FilterConfigV3 = {}
    Object.entries(filterConfig).forEach(([orgId, filterConf]) => {
        config[orgId] = [{
            name: "Team repositories",
            repositoryIds: filterConf?.teamRepositoryIds || [],
            showIndicators: true
        }, {
            name: "Global repositories",
            repositoryIds: filterConf?.globalRepositoryIds || [],
            userLogins: filterConf?.userLogins,
            showIndicators: false
        }]
    })
    return config;
}