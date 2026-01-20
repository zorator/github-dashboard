import {Button, Flex} from "antd";
import {CopyOutlined, DeleteOutlined, DownCircleOutlined, UpCircleOutlined} from "@ant-design/icons";

interface Props {
    onMoveBefore?: () => void
    onMoveAfter?: () => void
    onDelete: () => void
    onCopy: () => void
}

export function RepositoryGroupConfigActionsComponent(
    {onMoveBefore, onMoveAfter, onDelete, onCopy}: Props) {

    return <Flex gap="small" wrap justify="flex-end"
                 onClick={event => {
                     // prevent collapse to toggle when clicking on button
                     event.stopPropagation();
                 }}>
        <Button title="Move before"
                color="primary"
                variant="filled"
                icon={<UpCircleOutlined/>}
                shape="circle"
                disabled={!onMoveBefore}
                onClick={onMoveBefore}/>
        <Button title="Move after"
                color="primary"
                variant="filled"
                icon={<DownCircleOutlined/>}
                shape="circle"
                disabled={!onMoveAfter}
                onClick={onMoveAfter}/>
        <Button title="Copy group"
                type="primary"

                icon={<CopyOutlined />}
                shape="circle"
                onClick={onCopy}/>
        <Button title="Delete group"
                type="primary"
                danger
                icon={<DeleteOutlined/>}
                shape="circle"
                onClick={onDelete}/>
    </Flex>
}