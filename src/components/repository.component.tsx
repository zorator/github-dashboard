import {OrganizationId, RepositoryConfig} from "../domain.ts";
import PullRequestComponent from "./pull-request.component.tsx";
import {usePromise} from "../hooks/promise.hook.ts";
import ReleaseStateComponent from "./release-state.component.tsx";
import BranchesStateComponent from "./branches-state.component.tsx";
import {useContext} from "react";
import {OrganizationsContext} from "../contexts/organizations.context.tsx";

interface Props {
    organizationId: OrganizationId
    repositoryConfig: RepositoryConfig
}

function RepositoryComponent({repositoryConfig, organizationId}: Props) {

    const {fetchRepository} = useContext(OrganizationsContext)
    const {result: repoData, status: status} = usePromise(
        () => fetchRepository(organizationId, repositoryConfig),
        [organizationId, repositoryConfig]
    )

    return <div>
        <h3>{repositoryConfig.id}&nbsp;<a href={`https://github.com/${organizationId}/${repositoryConfig.id}/pulls`}
                                          target="_blank"
                                          rel="noreferrer">🌐</a>&nbsp;
            {repositoryConfig.showIndicators && repoData?.latestRelease ?
                <ReleaseStateComponent organizationId={organizationId}
                                       repositoryConfig={repositoryConfig}
                                       release={repoData.latestRelease}
            /> : null}
            {repositoryConfig.showIndicators && repoData ?
                <BranchesStateComponent organizationId={organizationId}
                                        repositoryConfig={repositoryConfig}
                                        pullRequestCount={repoData.pullRequests.length}
                                        branchCount={repoData.branchCount}
            /> : null}
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
