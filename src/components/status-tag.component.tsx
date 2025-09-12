import {BuildStatus} from "../domain.ts";
import {CheckCircleFilled, CloseCircleFilled, LoadingOutlined} from "@ant-design/icons";
import {Tag, theme} from "antd";
import {PropsWithChildren, useMemo} from "react";

interface Props {
    status: BuildStatus | undefined
}

function StatusTagComponent({status, children}: PropsWithChildren<Props>) {
    const {token} = theme.useToken();
    const icon = useMemo(() => {
        switch (status) {
            case 'success':
                return <CheckCircleFilled style={{color: token.colorSuccess}}/>;
            case 'failure':
                return <CloseCircleFilled style={{color: token.colorError}}/>;
            case 'in_progress':
                return <LoadingOutlined/>;
            default:
                return null;
        }
    }, [status, token])
    return <Tag icon={icon}>{children}</Tag>
}

export default StatusTagComponent