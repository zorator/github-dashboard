import {OrganizationId, RepositoryGroupConfig, RepositoryId} from "../../domain.ts";
import PullRequestComponent from "./pull-request.component.tsx";
import {usePromise} from "../../hooks/promise.hook.ts";
import ReleaseStateComponent from "./release-state.component.tsx";
import BranchesStateComponent from "./branches-state.component.tsx";
import {useContext} from "react";
import {OrganizationsContext} from "../../contexts/organizations.context.tsx";

interface Props {
    organizationId: OrganizationId
    repositoryId: RepositoryId
    groupConfig: RepositoryGroupConfig
}

function RepositoryComponent({repositoryId, groupConfig, organizationId}: Props) {

    const {fetchRepository} = useContext(OrganizationsContext)
    const {result: repoData, status: status} = usePromise(
        () => fetchRepository(organizationId, groupConfig, repositoryId),
        [organizationId, groupConfig, repositoryId]
    )

    return <div>
        <h3>{repositoryId}&nbsp;<a href={`https://github.com/${organizationId}/${repositoryId}/pulls`}
                                          target="_blank"
                                          rel="noreferrer">🌐</a>&nbsp;
            {groupConfig.showIndicators && repoData?.latestRelease ?
                <ReleaseStateComponent organizationId={organizationId}
                                       repositoryId={repositoryId}
                                       release={repoData.latestRelease}
            /> : null}
            {groupConfig.showIndicators && repoData ?
                <BranchesStateComponent organizationId={organizationId}
                                        repositoryId={repositoryId}
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
