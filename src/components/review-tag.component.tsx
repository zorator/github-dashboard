import {Review} from "../github.api.ts";
import {CheckCircleFilled, ClockCircleFilled, MinusCircleFilled, QuestionCircleFilled} from "@ant-design/icons";
import {theme} from "antd";
import {useMemo} from "react";
import UserAvatarComponent from "./user-avatar.component.tsx";

interface Props {
    review: Review
}

function ReviewTagComponent({review}: Props) {
    const {token} = theme.useToken();
    const icon = useMemo(() => {
        switch (review.state) {
            // APPROVED, CHANGES_REQUESTED, COMMENTED, DISMISSED, PENDING
            case 'APPROVED':
                return <CheckCircleFilled style={{color: token.colorSuccess}}/>;
            case 'CHANGES_REQUESTED':
                return <MinusCircleFilled style={{color: token.colorWarning}}/>;
            case 'PENDING':
                return <ClockCircleFilled/>;
            case 'COMMENTED':
                return <QuestionCircleFilled style={{color: token.colorInfo}}/>;
            default:
                return null;
        }
    }, [review.state, token])

    return icon ? <UserAvatarComponent key={review.id} user={review.user} badge={icon}/> : null;
}

export default ReviewTagComponent