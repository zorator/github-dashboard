import {User} from "../github.api.ts";
import {Avatar, Badge, Tooltip} from "antd";
import {PropsWithChildren, ReactNode} from "react";

interface Props {
    user: User
    badge?: ReactNode
}

function UserAvatarComponent({user, badge}: PropsWithChildren<Props>) {
    const avatarNode = <Tooltip title={user?.login} placement="top">
        <Avatar src={user?.avatar_url} />
    </Tooltip>

    if (badge) {
        return <Badge count={badge} offset={[0, 5]}>
            {avatarNode}
        </Badge>
    }
    return avatarNode
}

export default UserAvatarComponent