import {FilterConfig, OrganizationConfig} from "../hooks/filter-config.hook.ts";
import {Organization, OrganizationWithConfig, RepositoryConfig, RepositoryId} from "../domain.ts";

export const sortById = <T extends { id: string }>(a: T, b: T) =>
    a.id.localeCompare(b.id);

export const isNotNullish = <T>(value: T | null | undefined): value is T =>
    value !== undefined && value !== null;


export const convertToOrganizationConfig = (config: FilterConfig, organization: Organization | null): OrganizationWithConfig => {
    if (!organization || !config[organization.id]) {
        return {
            id: '', label: '', teamRepositoryIds: [], globalRepositoryIds: []
        }
    }
    const organizationConfig = config[organization.id] as unknown as OrganizationConfig;
    return {
        ...organization,
        teamRepositoryIds: organizationConfig.teamRepositoryIds
            .map((repoId: RepositoryId): RepositoryConfig => ({id: repoId, showIndicators: true}))
            .sort(sortById),
        globalRepositoryIds: organizationConfig.globalRepositoryIds
            .map((repoId: RepositoryId): RepositoryConfig => ({
                id: repoId,
                logins: organizationConfig.userLogins,
                showIndicators: false
            }))
            .sort(sortById)
    }
}