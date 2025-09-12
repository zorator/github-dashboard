import {BranchesOutlined} from "@ant-design/icons";
import {Tag} from "antd";
import StatusTagComponent from "./status-tag.component.tsx";
import ReviewTagComponent from "./review-tag.component.tsx";
import {PullRequest} from "../domain.ts";

interface Props {
    pullRequest: PullRequest
}

function PullRequestStatusComponent({pullRequest}: Props) {
    return <>
        {pullRequest.isDraft ? <Tag>Draft</Tag> : null}
        <StatusTagComponent status={pullRequest.buildStatus}><BranchesOutlined/></StatusTagComponent>
        {pullRequest.reviews.map(review =>
            <ReviewTagComponent key={review.id} review={review}/>
        )}
    </>
}

export default PullRequestStatusComponent