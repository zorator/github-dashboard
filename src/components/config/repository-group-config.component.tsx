import {Form, Input, Switch} from "antd";
import {GroupConfigV3} from "../../hooks/filter-config.hook.ts";
import {FilterUserComponent} from "./filter-user.component.tsx";
import {FilterRepositoryComponent} from "./filter-repository.component.tsx";

interface Props {
    group: GroupConfigV3,
    updateGroup: (val: GroupConfigV3) => void
}

export function RepositoryGroupConfigComponent({group, updateGroup}: Props) {
    return <>
        <Form.Item label="Group Name">
            <Input type="text"
                   placeholder="Group name"
                   defaultValue={group.name}
                   onBlur={(event) => {
                       updateGroup({...group, name: event.target.value});
                   }}
            />
        </Form.Item>
        <Form.Item label="Show indicators">
            <Switch value={group.showIndicators}
                    onChange={(checked) => {
                        updateGroup({...group, showIndicators: checked});
                    }}/>
        </Form.Item>
        <FilterUserComponent userLogins={group.userLogins || []}
                             onChange={(userLogins) => {
                                 updateGroup({...group, userLogins});
                             }}/>
        <FilterRepositoryComponent repositoryIds={group.repositoryIds}
                                   onChange={(repositoryIds) => {
                                       updateGroup({...group, repositoryIds});
                                   }}/>
    </>
}