import {Divider, Typography} from "antd";
import {FilterRepositoryComponent} from "./filter-repository.component.tsx";
import {OrganizationConfig, useFilterConfig} from "../hooks/filter-config.hook.ts";
import {FilterUserComponent} from "./filter-user.component.tsx";
import {useContext} from "react";
import {OrganizationsContext} from "../contexts/organizations.context.tsx";
import {Organization} from "../domain.ts";


export function FilterComponent() {
    const {filterConfig, setFilterConfig} = useFilterConfig()
    const {selectedOrganization} = useContext(OrganizationsContext)

    return selectedOrganization
        ? <OrganizationConfigComponent key={selectedOrganization.id}
                                       organization={selectedOrganization}
                                       value={filterConfig[selectedOrganization.id] || {
                                           teamRepositoryIds: [],
                                           globalRepositoryIds: []
                                       }}
                                       setValue={newConfig => {
                                           setFilterConfig({
                                                   ...filterConfig,
                                                   [selectedOrganization.id]: newConfig
                                               }
                                           )
                                       }}/>
        : <p>Error</p>
}

interface AbstractProps {
    value: OrganizationConfig,
    setValue: (val: OrganizationConfig) => void,
    organization: Organization
}

function OrganizationConfigComponent({value, setValue, organization}: AbstractProps) {
    return <>
        <Typography.Title level={2}>{organization.label}</Typography.Title>
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
