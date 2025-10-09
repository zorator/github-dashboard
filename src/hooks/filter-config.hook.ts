// using localStoragehook from another lib than usehook-ts as it is buggy
import { useLocalStorage } from "@uidotdev/usehooks";
import {OrganizationId, RepositoryId, UserLogin} from "../domain.ts";

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