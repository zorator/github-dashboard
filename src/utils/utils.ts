import {FilterConfigV3, GroupConfigV3} from "../hooks/filter-config.hook.ts";
import {Organization, OrganizationWithConfig, RepositoryGroupConfig} from "../domain.ts";

export const isNotNullish = <T>(value: T | null | undefined): value is T =>
    value !== undefined && value !== null;

export const convertToOrganizationConfig = (config: FilterConfigV3, organization: Organization | null): OrganizationWithConfig => {
    if (!organization) {
        return {
            id: '', label: '', groups: [], avatarUrl: ''
        }
    }
    const organizationGroupsConfig = (config[organization.id]||[]) as unknown as GroupConfigV3[];
    return {
        ...organization,
        groups: organizationGroupsConfig.map((group: GroupConfigV3): RepositoryGroupConfig => ({
            name: group.name,
            repositories: group.repositoryIds.sort(),
            logins: group.userLogins,
            showIndicators: group.showIndicators
        }))
    }
}