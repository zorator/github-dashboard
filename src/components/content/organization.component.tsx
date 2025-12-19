import RepositoryComponent from "./repository.component.tsx";
import {Typography} from "antd";
import {OrganizationsContext} from "../../contexts/organizations.context.tsx";
import React, {useContext} from "react";

export function OrganizationComponent() {

    const {selectedOrganization} = useContext(OrganizationsContext);

    return selectedOrganization ? <div>
        {selectedOrganization.groups.map((group, index) => <React.Fragment key={`${group.name}-${index.toString()}`}>
            <Typography.Title level={3}>{group.name}</Typography.Title>
            {group.repositories.map((repositoryId) =>
                <RepositoryComponent key={repositoryId}
                                     groupConfig={group}
                                     repositoryId={repositoryId}
                                     organizationId={selectedOrganization.id}/>)}
        </React.Fragment>)}
    </div> : null
}
