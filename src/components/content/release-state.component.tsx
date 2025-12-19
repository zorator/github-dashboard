import {OrganizationId, Release, RepositoryId} from "../../domain.ts";
import {Tag} from "antd";
import {TagOutlined} from "@ant-design/icons";

interface Props {
    organizationId: OrganizationId
    repositoryId: RepositoryId
    release: Release
}

function ReleaseStateComponent({repositoryId, organizationId, release}: Props) {
    const version = release.tagName.replace("RELEASE-", "")
    const tagColor = release.aheadCount > 10 ? "error" : release.aheadCount > 5 ? "warning" : "default"
    return <>
        <a href={release.url} target="_blank" rel="noreferrer"><Tag icon={<TagOutlined/>}>{version}</Tag></a>
        {release.aheadCount ?
            <a href={`https://github.com/${organizationId}/${repositoryId}/compare/${release.tagName}...main`}
               target="_blank" rel="noreferrer">
                <Tag color={tagColor}>{release.aheadCount} commits unreleased</Tag>
            </a> : null}
    </>
}


export default ReleaseStateComponent;
