import {CheckCircleFilled, ClockCircleFilled, MinusCircleFilled, QuestionCircleFilled} from "@ant-design/icons";
import {theme} from "antd";
import {useMemo} from "react";
import UserAvatarComponent from "./user-avatar.component.tsx";
import {Review} from "../domain.ts";

interface Props {
    review: Review
}

function ReviewTagComponent({review}: Props) {
    const {token} = theme.useToken();
    const icon = useMemo(() => {
        switch (review.state) {
            case 'approved':
                return <CheckCircleFilled style={{color: token.colorSuccess}}/>;
            case 'changes_requested':
                return <MinusCircleFilled style={{color: token.colorWarning}}/>;
            case 'pending':
                return <ClockCircleFilled/>;
            case 'commented':
                return <QuestionCircleFilled style={{color: token.colorInfo}}/>;
            default:
                return null;
        }
    }, [review.state, token])

    return icon ? <UserAvatarComponent key={review.id} user={review.author} badge={icon}/> : null;
}

export default ReviewTagComponent