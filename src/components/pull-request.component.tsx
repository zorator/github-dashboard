import {PullRequest} from "../github.api.ts";
import PullRequestStatusComponent from "./pull-request-status.component.tsx";
import {Space} from "antd";

interface Props {
    pullRequest: PullRequest
}

function PullRequestComponent({pullRequest}: Props) {
    return <Space style={{display: 'flex', flexWrap: 'wrap'}}>
        <a href={pullRequest.html_url} target="_blank" rel="noreferrer">{pullRequest.title}</a>
        <span>by {pullRequest.user?.login}</span>
        <PullRequestStatusComponent pullRequest={pullRequest}/>
    </Space>
}

export default PullRequestComponent