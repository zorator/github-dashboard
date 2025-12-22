import PullRequestStatusComponent from "./pull-request-status.component.tsx";
import UserAvatarComponent from "./user-avatar.component.tsx";
import {PullRequest} from "../../domain.ts";

interface Props {
    pullRequest: PullRequest
}

function PullRequestComponent({pullRequest}: Props) {
    return <div className="pull-request-inline">
        <UserAvatarComponent user={pullRequest.author}/>
        <a href={pullRequest.url} target="_blank" rel="noreferrer">{pullRequest.title}</a>
        <PullRequestStatusComponent pullRequest={pullRequest}/>
    </div>
}

export default PullRequestComponent