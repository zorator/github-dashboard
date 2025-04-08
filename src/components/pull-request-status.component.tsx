import GithubApi, {PullRequest} from "../github.api.ts";
import {BranchesOutlined, CheckCircleFilled} from "@ant-design/icons";
import {Tag, theme} from "antd";
import {usePromise} from "../hooks/promise.hook.ts";
import StatusTagComponent from "./status-tag.component.tsx";
import UserAvatarComponent from "./user-avatar.component.tsx";

interface Props {
    pullRequest: PullRequest
}

function PullRequestStatusComponent({pullRequest}: Props) {
    const {token} = theme.useToken();
    const {result: status} = usePromise(
        () => GithubApi.getBuildStatus(pullRequest),
        [pullRequest]
    )

    const {result: reviews} = usePromise(
        () => GithubApi.getReviews(pullRequest),
        [pullRequest]
    )

    const filteredReviews = (reviews || []).filter(review => review.state === 'APPROVED')

    return <>
        {pullRequest.draft ? <Tag>Draft</Tag> : null}
        <StatusTagComponent status={status}><BranchesOutlined/></StatusTagComponent>
        {filteredReviews.map(review =>
            <UserAvatarComponent key={review.id} user={review.user}
                                 badge={<CheckCircleFilled style={{color: token.colorSuccess}}/>}/>
        )}
    </>
}

export default PullRequestStatusComponent