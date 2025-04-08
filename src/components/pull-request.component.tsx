import {PullRequest} from "../github.api.ts";
import PullRequestStatusComponent from "./pull-request-status.component.tsx";
import {Space} from "antd";
import UserAvatarComponent from "./user-avatar.component.tsx";

interface Props {
    pullRequest: PullRequest
}

function PullRequestComponent({pullRequest}: Props) {
    return <Space style={{display: 'flex', flexWrap: 'wrap'}}>
        <UserAvatarComponent user={pullRequest.user}/>
        <a href={pullRequest.html_url} target="_blank" rel="noreferrer">{pullRequest.title}</a>
        <PullRequestStatusComponent pullRequest={pullRequest}/>
    </Space>
}

export default PullRequestComponent