import GithubApi, {OrganizationId, OrganizationListItem, RepositoryId} from "../github.api.ts";
import {Divider, Skeleton, Typography} from "antd";
import {usePromise} from "../hooks/promise.hook.ts";
import {FilterRepositoryComponent} from "./filter-repository.component.tsx";
import React from "react";
import {FilterConfig, useFilterConfig} from "../hooks/filter-config.hook.ts";
import {FilterUserComponent} from "./filter-user.component.tsx";


export function FilterComponent() {
    const {teamConfig, setTeamConfig, globalConfig, setGlobalConfig} = useFilterConfig()
    const {status, result: organizations} = usePromise<OrganizationListItem[]>(() => GithubApi.getOrganizations());

    return <div>
        <Typography.Title level={2}>Team Projects</Typography.Title>
        <Skeleton active={true} loading={status === 'loading'}>
            {status === 'success'
                ? <AbstractFilterComponent organizations={organizations}
                                           value={teamConfig}
                                           setValue={setTeamConfig}/>
                : <p>Error</p>}
        </Skeleton>

        <Typography.Title level={2}>Global Projects</Typography.Title>
        <Skeleton active={true} loading={status === 'loading'}>
            {status === 'success'
                ? <AbstractFilterComponent organizations={organizations}
                                           showUserLogins={true}
                                           value={globalConfig}
                                           setValue={setGlobalConfig}/>
                : <p>Error</p>}
        </Skeleton>
    </div>
}

interface AbstractProps {
    value: FilterConfig,
    setValue: (val: FilterConfig) => void,
    showUserLogins?: boolean
    organizations: OrganizationListItem[]
}

function AbstractFilterComponent({value, setValue, showUserLogins, organizations}: AbstractProps) {

    const onOrganizationFilterChange = (organizationId: OrganizationId, repositoryIds: RepositoryId[], userLogins?: string[]): void => {
        setValue({...value, [organizationId]: {repositoryIds, userLogins}})
    }

    return <div>
        {organizations.map(organization => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const repoFilter = value[organization.login] || {repositoryIds: []}
            return (
                <React.Fragment key={organization.id}>
                    <Divider orientation="left">{organization.login}</Divider>
                    {showUserLogins
                        ? <FilterUserComponent value={repoFilter.userLogins}
                                               onChange={(userLogins) => {
                                                   onOrganizationFilterChange(organization.login, repoFilter.repositoryIds, userLogins);
                                               }}/>
                        : null}
                    <FilterRepositoryComponent value={repoFilter.repositoryIds}
                                               onChange={(newRepoIds) => {
                                                   onOrganizationFilterChange(organization.login, newRepoIds, repoFilter.userLogins);
                                               }}/>
                </React.Fragment>
            );
        })}
    </div>
}
