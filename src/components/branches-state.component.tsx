import {OrganizationId, RepositoryConfig} from "../domain.ts";
import {Tag} from "antd";

interface Props {
    organizationId: OrganizationId
    repositoryConfig: RepositoryConfig
    branchCount: number
    pullRequestCount: number
}

function BranchesStateComponent({repositoryConfig, organizationId, branchCount, pullRequestCount}: Props) {
    // minus one because of primary branch
    const branchDiff = branchCount - pullRequestCount;
    const tagColor = branchDiff > 10 ? "error" : branchDiff > 2 ? "warning" : "default"
    return <a
        href={`https://github.com/${organizationId}/${repositoryConfig.id}/branches/all`}
        target="_blank"
        rel="noreferrer">
        <Tag color={tagColor}>{branchCount} branches</Tag>
    </a>
}


export default BranchesStateComponent;
