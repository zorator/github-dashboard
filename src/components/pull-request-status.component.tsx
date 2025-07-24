import GithubApi, {PullRequest} from "../github.api.ts";
import {BranchesOutlined} from "@ant-design/icons";
import {Tag} from "antd";
import {usePromise} from "../hooks/promise.hook.ts";
import StatusTagComponent from "./status-tag.component.tsx";
import ReviewTagComponent from "./review-tag.component.tsx";

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

    return <>
        {pullRequest.draft ? <Tag>Draft</Tag> : null}
        <StatusTagComponent status={status}><BranchesOutlined/></StatusTagComponent>
        {(reviews || []).map(review => <ReviewTagComponent key={review.id} review={review}/>)}
    </>
}

export default PullRequestStatusComponent