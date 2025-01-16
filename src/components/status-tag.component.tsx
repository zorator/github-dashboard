import {BuildStatus} from "../github.api.ts";
import {CheckCircleFilled, CloseCircleFilled, LoadingOutlined} from "@ant-design/icons";
import {Tag, theme} from "antd";
import {PropsWithChildren} from "react";

interface Props {
    status: BuildStatus | undefined
}

function StatusTagComponent({status, children}: PropsWithChildren<Props>) {
    const {token} = theme.useToken();
    const checkCircleFilled = <CheckCircleFilled style={{color: token.colorSuccess}}/>;
    const closeCircleFilled = <CloseCircleFilled style={{color: token.colorError}}/>;
    const icon =
        status === 'success' ? checkCircleFilled :
            status === 'failure' ? closeCircleFilled :
                <LoadingOutlined/>;
    return <Tag icon={icon}>{children}</Tag>
}

export default StatusTagComponent