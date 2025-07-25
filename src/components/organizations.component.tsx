import {OrganizationComponent} from "./organization.component.tsx";
import {FilterConfig, useFilterConfig} from "../hooks/filter-config.hook.ts";
import {Typography} from "antd";
import {OrganizationConfig, RepositoryConfig, RepositoryId} from "../github.api.ts";
import {useMemo} from "react";

function OrganizationsComponent() {

    const {teamConfig, globalConfig} = useFilterConfig()
    const teamHierarchy = useMemo(() => convertToOrganizationConfig(teamConfig), [teamConfig]);
    const globalHierarchy = useMemo(() => convertToOrganizationConfig(globalConfig), [globalConfig]);

    return <>
        <Typography.Title level={2}>Team Repos</Typography.Title>
        {teamHierarchy.map((organization) =>
            <OrganizationComponent key={organization.id}
                                   data={organization}
                                   showAheadCount={true}/>)}
        <Typography.Title level={2}>Global Repos</Typography.Title>
        {globalHierarchy.map((organization) =>
            <OrganizationComponent key={organization.id}
                                   data={organization}/>)}
    </>
}

export default OrganizationsComponent


const convertToOrganizationConfig = (config: FilterConfig): OrganizationConfig[] => {
    return Object.entries(config)
        .map(([orgId, repoConfig]): OrganizationConfig => ({
            id: orgId,
            repositories: repoConfig.repositoryIds
                .map((repoId: RepositoryId): RepositoryConfig => ({
                    id: repoId, logins: repoConfig.userLogins
                })).sort(sortById)
        })).sort(sortById)
}

const sortById = <T extends { id: string }>(a: T, b: T) => a.id.localeCompare(b.id)