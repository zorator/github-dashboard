// using localStorage hook from another lib than usehook-ts as it is buggy
import {useLocalStorage} from "@uidotdev/usehooks";
import {OrganizationId, RepositoryId, UserLogin} from "../domain.ts";

export type OldFilterConfig = Record<OrganizationId, OldOrganizationConfig>

export interface OldOrganizationConfig {
    repositoryIds: RepositoryId[],
    userLogins?: UserLogin[]
}

export interface OrganizationConfig {
    teamRepositoryIds: RepositoryId[],
    globalRepositoryIds: RepositoryId[],
    userLogins?: UserLogin[]
}

export type FilterConfig = Record<OrganizationId, OrganizationConfig | undefined>

type UseConfigReturn = {
    filterConfig: FilterConfig
    setFilterConfig: (config: FilterConfig) => void
}

export function useFilterConfig(): UseConfigReturn {
    const [teamConfig] = useLocalStorage<OldFilterConfig>('repo-filter-team', {})
    const [globalConfig] = useLocalStorage<OldFilterConfig>('repo-filter-global', {})

    function buildFromLegacyConfig(teamConfig: OldFilterConfig, globalConfig: OldFilterConfig) {
        const config: FilterConfig = {}
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

    const [filterConfig, setFilterConfig] = useLocalStorage<FilterConfig>('repo-config', buildFromLegacyConfig(teamConfig, globalConfig))

    return {
        filterConfig, setFilterConfig
    }
}