import RepositoryComponent from "./repository.component.tsx";
import {OrganizationConfig} from "../github.api.ts";

interface Props {
    data: OrganizationConfig
}

export function OrganizationComponent({data}: Props) {

    return <div>
        <h2>{data.id}</h2>
        {data.repositories.map((repository) =>
            <RepositoryComponent key={repository.id}
                                 repositoryConfig={repository}
                                 organizationId={data.id}/>)}
    </div>
}
