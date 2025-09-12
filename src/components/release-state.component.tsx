import {OrganizationId, Release, RepositoryConfig} from "../domain.ts";
import {Tag} from "antd";
import {TagOutlined} from "@ant-design/icons";

interface Props {
    organizationId: OrganizationId
    repositoryConfig: RepositoryConfig
    release: Release
}

function ReleaseStateComponent({repositoryConfig, organizationId, release}: Props) {
    const version = release.tagName.replace("RELEASE-", "")
    const aheadCount = Math.ceil((release.aheadCount - 1) / 2)

    return <>
        <a href={release.url} target="_blank" rel="noreferrer"><Tag icon={<TagOutlined/>}>{version}</Tag></a>
        {aheadCount ?
            <a href={`https://github.com/${organizationId}/${repositoryConfig.id}/blob/main/CHANGELOG.md`}
               target="_blank" rel="noreferrer">
                <Tag>~{aheadCount} commits unreleased</Tag>
            </a> : null}
    </>
}


export default ReleaseStateComponent;
