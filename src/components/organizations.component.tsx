import {FilterConfig, useFilterConfig} from "../hooks/filter-config.hook.ts";
import {OrganizationConfig, RepositoryConfig, RepositoryId} from "../domain.ts";
import {useMemo} from "react";
import {OrganizationComponent} from "./organization.component.tsx";

function OrganizationsComponent() {
    const {repoConfig} = useFilterConfig()
    const hierarchy = useMemo(() => convertToOrganizationConfig(repoConfig), [repoConfig]);

    return hierarchy.map((organizationConfig) =>
        <OrganizationComponent key={organizationConfig.id}
                               organizationConfig={organizationConfig}
        />
    )
}

export default OrganizationsComponent

const convertToOrganizationConfig = (config: FilterConfig): OrganizationConfig[] => {
    return Object.entries(config)
        .map(([orgId, repoConfig]): OrganizationConfig => ({
            id: orgId,
            teamRepositoryIds: repoConfig.teamRepositoryIds
                .map((repoId: RepositoryId): RepositoryConfig => ({id: repoId, showIndicators: true}))
                .sort(sortById),
            globalRepositoryIds: repoConfig.globalRepositoryIds
                .map((repoId: RepositoryId): RepositoryConfig => ({
                    id: repoId,
                    logins: repoConfig.userLogins,
                    showIndicators: false
                }))
                .sort(sortById)
        })).sort(sortById)
}

const sortById = <T extends { id: string }>(a: T, b: T) => a.id.localeCompare(b.id)