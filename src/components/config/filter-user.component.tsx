import {UserLogin} from "../../domain.ts";
import {Form} from "antd";
import {InputTags} from "./input-tags.component.tsx";

interface Props {
    userLogins: UserLogin[]
    onChange: (userLogins: UserLogin[]) => void
}

export function FilterUserComponent({userLogins, onChange}: Props) {
    return <Form.Item label="Users">
        <InputTags
            placeholder="Enter users"
            values={userLogins}
            onChange={onChange}
        />
    </Form.Item>
}
