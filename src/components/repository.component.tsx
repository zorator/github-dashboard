import GithubApi, {OrganizationId, RepositoryConfig} from "../github.api.ts";
import PullRequestComponent from "./pull-request.component.tsx";
import {usePromise} from "../hooks/promise.hook.ts";

interface Props {
    organizationId: OrganizationId
    repositoryConfig: RepositoryConfig
}

function RepositoryComponent({repositoryConfig, organizationId}: Props) {

    const {result: prs, status} = usePromise(
        () => GithubApi.getPullRequests(organizationId, repositoryConfig),
        [repositoryConfig, organizationId]
    )

    return <div>
        <h3>{repositoryConfig.id}&nbsp;<a href={`https://github.com/${organizationId}/${repositoryConfig.id}/pulls`}
                                          target="_blank"
                                          rel="noreferrer">🌐</a></h3>
        {
            status === "loading"
                ? "Chargement en cours"
                : (prs || []).map((pr) =>
                    <PullRequestComponent pullRequest={pr} key={pr.id}/>)
        }
    </div>
}


export default RepositoryComponent;
