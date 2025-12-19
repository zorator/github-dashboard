import {Avatar, Badge, Tooltip} from "antd";
import {PropsWithChildren, ReactNode} from "react";
import {Author} from "../../domain.ts";

interface Props {
    user: Author;
    badge?: ReactNode
}

function UserAvatarComponent({user, badge}: PropsWithChildren<Props>) {
    const avatarNode = <Tooltip title={user.login} placement="top">
        <Avatar src={user.avatarUrl}/>
    </Tooltip>

    if (badge) {
        return <Badge count={badge} offset={[0, 5]}>
            {avatarNode}
        </Badge>
    }
    return avatarNode
}

export default UserAvatarComponent