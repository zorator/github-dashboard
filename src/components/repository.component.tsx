import {OrganizationId, RepositoryConfig} from "../domain.ts";
import PullRequestComponent from "./pull-request.component.tsx";
import {usePromise} from "../hooks/promise.hook.ts";
import ReleaseStateComponent from "./release-state.component.tsx";
import GithubGraphql from "../github.graphql.ts";

interface Props {
    organizationId: OrganizationId
    repositoryConfig: RepositoryConfig
    showAheadCount?: boolean
}

function RepositoryComponent({repositoryConfig, organizationId, showAheadCount}: Props) {

    const {result: repoData, status: status} = usePromise(
        () => GithubGraphql.getRepositoryData(organizationId, repositoryConfig),
        [repositoryConfig, organizationId]
    )

    return <div>
        <h3>{repositoryConfig.id}&nbsp;<a href={`https://github.com/${organizationId}/${repositoryConfig.id}/pulls`}
                                          target="_blank"
                                          rel="noreferrer">🌐</a>
            {showAheadCount && repoData?.latestRelease ? <>&nbsp;<ReleaseStateComponent organizationId={organizationId}
                                                                                        repositoryConfig={repositoryConfig}
                                                                                        release={repoData.latestRelease}
            /></> : null}
        </h3>
        {
            status === "loading"
                ? "Chargement en cours"
                : (repoData?.pullRequests || []).map((pr) =>
                    <PullRequestComponent pullRequest={pr} key={pr.id}/>)
        }
    </div>
}


export default RepositoryComponent;
