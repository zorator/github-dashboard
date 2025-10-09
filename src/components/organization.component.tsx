import RepositoryComponent from "./repository.component.tsx";
import {OrganizationConfig} from "../domain.ts";

interface Props {
    data: OrganizationConfig
    showIndicators?: boolean
}

export function OrganizationComponent({data, showIndicators}: Props) {

    return <div>
        <h2>{data.id}</h2>
        {data.repositories.map((repository) =>
            <RepositoryComponent key={repository.id}
                                 repositoryConfig={repository}
                                 showIndicators={showIndicators}
                                 organizationId={data.id}/>)}
    </div>
}
