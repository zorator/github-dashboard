import {RepositoryId} from "../github.api.ts";
import {Form, Select} from "antd";

interface Props {
    value: RepositoryId[]
    onChange: (repoIds: RepositoryId[]) => void
}

export function FilterRepositoryComponent({value, onChange}: Props) {
    return <Form.Item label="Repositories">
        <Select filterOption={false}
                mode="tags"
                value={value}
                placeholder="Select repositories"
                onChange={onChange}
                style={{width: '100%'}}
        />
    </Form.Item>
}
