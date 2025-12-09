import {BuildStatus} from "../domain.ts";
import {CheckCircleFilled, CloseCircleFilled, LoadingOutlined} from "@ant-design/icons";
import {Tag, theme} from "antd";
import {PropsWithChildren, useMemo} from "react";

interface Props {
    status: BuildStatus | undefined
}

function StatusTagComponent({status, children}: PropsWithChildren<Props>) {
    const {token} = theme.useToken();
    const {color, icon} = useMemo(() => {
        switch (status) {
            case 'success':
                return {color: 'success', icon: <CheckCircleFilled/>};
            case 'failure':
                return {color: 'error', icon: <CloseCircleFilled/>};
            case 'in_progress':
                return {color: 'processing', icon: <LoadingOutlined/>};
            default:
                return {color: undefined, icon: null};
        }
    }, [status, token])
    return <Tag icon={icon} color={color}>{children}</Tag>
}

export default StatusTagComponent