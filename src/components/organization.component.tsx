import RepositoryComponent from "./repository.component.tsx";
import {OrganizationConfig} from "../domain.ts";

interface Props {
    data: OrganizationConfig
    showAheadCount?: boolean
}

export function OrganizationComponent({data, showAheadCount}: Props) {

    return <div>
        <h2>{data.id}</h2>
        {data.repositories.map((repository) =>
            <RepositoryComponent key={repository.id}
                                 repositoryConfig={repository}
                                 showAheadCount={showAheadCount}
                                 organizationId={data.id}/>)}
    </div>
}
