import GithubApi, {OrganizationId, RepositoryConfig} from "../github.api.ts";
import {usePromise} from "../hooks/promise.hook.ts";
import {Tag} from "antd";
import {TagOutlined} from "@ant-design/icons";

interface Props {
    organizationId: OrganizationId
    repositoryConfig: RepositoryConfig
}

function ReleaseStateComponent({repositoryConfig, organizationId}: Props) {

    const {result: releaseInfo} = usePromise(
        () => GithubApi.getReleaseInfo(organizationId, repositoryConfig)
            .then(result => ({
                tagName: result.tagName,
                version: result.tagName.replace("RELEASE-", ""),
                // always 1 commit for snapshot
                // always +1 commits for [skip-ci] changelog..
                aheadCount: Math.ceil((result.aheadCount - 1) / 2)
            })),
        [repositoryConfig, organizationId]
    )

    return releaseInfo ? <>
        <a href={`https://github.com/${organizationId}/${repositoryConfig.id}/releases/tag/${releaseInfo.tagName}`}
           target="_blank"
           rel="noreferrer"><Tag icon={<TagOutlined/>}>{releaseInfo.version}</Tag></a>
        {releaseInfo.aheadCount ? <a href={`https://github.com/${organizationId}/${repositoryConfig.id}/blob/main/CHANGELOG.md`}
                                     target="_blank"
                                     rel="noreferrer"><Tag>~{releaseInfo.aheadCount} commits
            unreleased</Tag></a> : null}
    </> : null
}


export default ReleaseStateComponent;
