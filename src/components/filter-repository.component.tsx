import {RepositoryId} from "../domain.ts";
import {Form} from "antd";
import {InputTags} from "./input-tags.component.tsx";

interface Props {
    repositoryIds: RepositoryId[]
    onChange: (repositoryIds: RepositoryId[]) => void
}

export function FilterRepositoryComponent({repositoryIds, onChange}: Props) {
    return <Form.Item label="Repositories" layout="vertical">
        <InputTags
            placeholder="Enter a repository id"
            values={repositoryIds}
            onChange={onChange}
        />
    </Form.Item>
}
