import {OrganizationId, RepositoryGroupConfig, RepositoryId} from "../../domain.ts";
import PullRequestComponent from "./pull-request.component.tsx";
import {usePromise} from "../../hooks/promise.hook.ts";
import ReleaseStateComponent from "./release-state.component.tsx";
import BranchesStateComponent from "./branches-state.component.tsx";
import {useContext} from "react";
import {OrganizationsContext} from "../../contexts/organizations.context.tsx";
import {Flex, Skeleton, Space} from "antd";

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
                ? <PullRequestsSkeleton/>
                : (repoData?.pullRequests || []).map((pr) =>
                    <PullRequestComponent pullRequest={pr} key={pr.id}/>)
        }
    </div>
}

const PullRequestsSkeleton = () => <Space vertical size={3}>
    <Flex gap="small" align="center">
        <Skeleton.Avatar active/>
        <Skeleton.Input size="small" active style={{width: 550}}/>
        <Skeleton.Button size="small" active/>
        <Skeleton.Button size="small" active/>
    </Flex>
    <Flex gap="small" align="center">
        <Skeleton.Avatar active/>
        <Skeleton.Input size="small" active/>
        <Skeleton.Button size="small" active/>
        <Skeleton.Avatar active/>
    </Flex>
    <Flex gap="small" align="center">
        <Skeleton.Avatar active/>
        <Skeleton.Input size="small" active style={{width: 300}}/>
        <Skeleton.Button size="small" active/>
        <Skeleton.Avatar active/>
        <Skeleton.Avatar active/>
    </Flex>
</Space>


export default RepositoryComponent;
