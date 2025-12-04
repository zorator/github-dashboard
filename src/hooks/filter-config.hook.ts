// using localStorage hook from another lib than usehook-ts as it is buggy
import {useLocalStorage} from "@uidotdev/usehooks";
import {OrganizationId, RepositoryId, UserLogin} from "../domain.ts";

export type OldFilterConfig = Record<OrganizationId, OldFilterRepositoryConfig>

export interface OldFilterRepositoryConfig {
    repositoryIds: RepositoryId[],
    userLogins?: UserLogin[]
}

export interface FilterRepositoryConfig {
    teamRepositoryIds: RepositoryId[],
    globalRepositoryIds: RepositoryId[],
    userLogins?: UserLogin[]
}

export type FilterConfig = Record<OrganizationId, FilterRepositoryConfig>

type UseConfigReturn = {
    repoConfig: FilterConfig
    setRepoConfig: (config: FilterConfig) => void
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
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                teamRepositoryIds: config[orgId] == null ? [] : config[orgId].teamRepositoryIds,
                globalRepositoryIds: filterConf.repositoryIds,
                userLogins: filterConf.userLogins
            }
        })
        return config;
    }

    const [repoConfig, setRepoConfig] = useLocalStorage<FilterConfig>('repo-config', buildFromLegacyConfig(teamConfig, globalConfig))

    return {
        repoConfig, setRepoConfig
    }
}