import RepositoryComponent from "./repository.component.tsx";
import {Typography} from "antd";
import {OrganizationsContext} from "../contexts/organizations.context.tsx";
import {useContext} from "react";

export function OrganizationComponent() {

    const {selectedOrganization} = useContext(OrganizationsContext);

    return selectedOrganization ? <div>
        <Typography.Title level={3}>Team Repos</Typography.Title>
        {selectedOrganization.teamRepositoryIds.map((repository) =>
            <RepositoryComponent key={repository.id}
                                 repositoryConfig={repository}
                                 organizationId={selectedOrganization.id}/>)}
        <Typography.Title level={3}>Global Repos</Typography.Title>
        {selectedOrganization.globalRepositoryIds.map((repository) =>
            <RepositoryComponent key={repository.id}
                                 repositoryConfig={repository}
                                 organizationId={selectedOrganization.id}/>)}

    </div> : null
}
