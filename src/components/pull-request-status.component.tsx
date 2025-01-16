import GithubApi, {PullRequest} from "../github.api.ts";
import {BranchesOutlined} from "@ant-design/icons";
import {Tag} from "antd";
import {usePromise} from "../hooks/promise.hook.ts";
import StatusTagComponent from "./status-tag.component.tsx";

interface Props {
    pullRequest: PullRequest
}

function PullRequestStatusComponent({pullRequest}: Props) {
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
            <StatusTagComponent key={review.id} status="success">{review.user?.login}</StatusTagComponent>)}
    </>
}

export default PullRequestStatusComponent