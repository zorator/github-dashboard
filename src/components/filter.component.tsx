import GithubApi, {OrganizationListItem} from "../github.api.ts";
import {Divider, Skeleton, Typography} from "antd";
import {usePromise} from "../hooks/promise.hook.ts";
import {FilterRepositoryComponent} from "./filter-repository.component.tsx";
import {FilterRepositoryConfig, useFilterConfig} from "../hooks/filter-config.hook.ts";
import {FilterUserComponent} from "./filter-user.component.tsx";


export function FilterComponent() {
    const {repoConfig, setRepoConfig} = useFilterConfig()
    const {status, result: organizations} = usePromise<OrganizationListItem[]>(() => GithubApi.getOrganizations());

    return <Skeleton active={true} loading={status === 'loading'}>
        {status === 'success' ? organizations.map(organization =>
            <OrganizationConfigComponent key={organization.login}
                                         organization={organization}
                                         value={repoConfig[organization.login]}
                                         setValue={newConfig => {
                                             setRepoConfig({
                                                     ...repoConfig,
                                                     [organization.login]: newConfig
                                                 }
                                             )
                                         }}/>
        ) : <p>Error</p>}
        </Skeleton>
}

interface AbstractProps {
    value: FilterRepositoryConfig,
    setValue: (val: FilterRepositoryConfig) => void,
    organization: OrganizationListItem
}

function OrganizationConfigComponent({value, setValue, organization}: AbstractProps) {
    return <>
        <Typography.Title level={2}>{organization.login}</Typography.Title>
        <Divider orientation="left">Team Projects</Divider>
        <FilterRepositoryComponent repositoryIds={value.teamRepositoryIds}
                                   onChange={(newRepoIds) => {
                                       setValue({...value, teamRepositoryIds: newRepoIds});
                                   }}/>

        <Divider orientation="left">Global Projects</Divider>
        <FilterUserComponent userLogins={value.userLogins || []}
                             onChange={(userLogins) => {
                                 setValue({...value, userLogins: userLogins});
                             }}/>
        <FilterRepositoryComponent repositoryIds={value.globalRepositoryIds}
                                   onChange={(newRepoIds) => {
                                       setValue({...value, globalRepositoryIds: newRepoIds});
                                   }}/>
    </>
}
