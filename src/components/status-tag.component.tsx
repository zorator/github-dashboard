import {BuildStatus} from "../domain.ts";
import {CheckCircleFilled, CloseCircleFilled, LoadingOutlined} from "@ant-design/icons";
import {Tag} from "antd";
import {PropsWithChildren, useMemo} from "react";

interface Props {
    status: BuildStatus | undefined
}

function StatusTagComponent({status, children}: PropsWithChildren<Props>) {
    const {className, icon} = useMemo(() => {
        switch (status) {
            case 'success':
                return {className: 'tag-with-icon-success', icon: <CheckCircleFilled/>};
            case 'failure':
                return {className: 'tag-with-icon-error', icon: <CloseCircleFilled/>};
            case 'in_progress':
                return {className: 'processing', icon: <LoadingOutlined/>};
            default:
                return {className: undefined, icon: null};
        }
    }, [status])
    return <Tag icon={icon} className={className}>{children}</Tag>
}

export default StatusTagComponent