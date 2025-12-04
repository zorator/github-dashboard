import RepositoryComponent from "./repository.component.tsx";
import {OrganizationConfig} from "../domain.ts";
import {Typography} from "antd";

interface Props {
    organizationConfig: OrganizationConfig
}

export function OrganizationComponent({organizationConfig}: Props) {

    return <div>
        <Typography.Title level={2}>{organizationConfig.id}</Typography.Title>
        <Typography.Title level={3}>Team Repos</Typography.Title>
        {organizationConfig.teamRepositoryIds.map((repository) =>
            <RepositoryComponent key={repository.id}
                                 repositoryConfig={repository}
                                 organizationId={organizationConfig.id}/>)}
        <Typography.Title level={3}>Global Repos</Typography.Title>
        {organizationConfig.globalRepositoryIds.map((repository) =>
            <RepositoryComponent key={repository.id}
                                 repositoryConfig={repository}
                                 organizationId={organizationConfig.id}/>)}

    </div>
}
