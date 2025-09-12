import {UserLogin} from "../domain.ts";
import {Form, Select} from "antd";

interface Props {
    value: UserLogin[] | undefined
    onChange: (logins: UserLogin[]) => void
}

export function FilterUserComponent({value, onChange}: Props) {

    return <Form.Item label="Filter PullRequest by users" layout="vertical">
        <Select filterOption={false}
                mode="tags"
                value={value}
                placeholder="Enter users"
                onChange={onChange}
                style={{width: '100%'}}
        />
    </Form.Item>
}
