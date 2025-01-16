import {OrganizationId, RepositoryId, UserLogin} from "../github.api.ts";
import {useLocalStorage} from "usehooks-ts";

export type FilterConfig = Record<OrganizationId, FilterRepositoryConfig>

export interface FilterRepositoryConfig {
    repositoryIds: RepositoryId[],
    userLogins?: UserLogin[]
}

type UseConfigReturn = {
    teamConfig: FilterConfig
    setTeamConfig: (config: FilterConfig) => void
    globalConfig: FilterConfig
    setGlobalConfig: (config: FilterConfig) => void
}

export function useFilterConfig(): UseConfigReturn {
    const [teamConfig, setTeamConfig] = useLocalStorage<FilterConfig>('repo-filter-team', {})
    const [globalConfig, setGlobalConfig] = useLocalStorage<FilterConfig>('repo-filter-global', {})

    return {
        teamConfig, setTeamConfig, globalConfig, setGlobalConfig
    }
}