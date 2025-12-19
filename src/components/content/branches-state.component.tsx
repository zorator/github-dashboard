import {OrganizationId, RepositoryId} from "../../domain.ts";
import {Tag} from "antd";

interface Props {
    organizationId: OrganizationId
    repositoryId: RepositoryId
    branchCount: number
    pullRequestCount: number
}

function BranchesStateComponent({repositoryId, organizationId, branchCount, pullRequestCount}: Props) {
    // minus one because of primary branch
    const branchDiff = branchCount - pullRequestCount;
    const tagColor = branchDiff > 10 ? "error" : "warning"
    return branchDiff > 0 ? <a
        href={`https://github.com/${organizationId}/${repositoryId}/branches/all`}
        target="_blank"
        rel="noreferrer">
        <Tag color={tagColor}>{branchDiff} branch{branchDiff > 1 ? 'es' : ''} without PR</Tag>
    </a> : null;
}


export default BranchesStateComponent;
