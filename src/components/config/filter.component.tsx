import {Button, Divider, Flex, Form, Input, Switch, Typography} from "antd";
import {FilterRepositoryComponent} from "./filter-repository.component.tsx";
import {GroupConfigV3, useFilterConfig} from "../../hooks/filter-config.hook.ts";
import {useContext} from "react";
import {OrganizationsContext} from "../../contexts/organizations.context.tsx";
import {Organization} from "../../domain.ts";
import {FilterUserComponent} from "./filter-user.component.tsx";
import {AppstoreAddOutlined, DeleteOutlined, DownCircleOutlined, UpCircleOutlined} from "@ant-design/icons";


export function FilterComponent() {
    const {filterConfig, setFilterConfig} = useFilterConfig()
    const {selectedOrganization} = useContext(OrganizationsContext)

    return selectedOrganization
        ? <OrganizationConfigComponent key={selectedOrganization.id}
                                       organization={selectedOrganization}
                                       groups={filterConfig[selectedOrganization.id] || []}
                                       setGroups={newConfig => {
                                           setFilterConfig({
                                                   ...filterConfig,
                                                   [selectedOrganization.id]: newConfig
                                               }
                                           )
                                       }}/>
        : <p>Error</p>
}

interface OrganizationConfigComponentProps {
    groups: GroupConfigV3[],
    setGroups: (val: GroupConfigV3[]) => void,
    organization: Organization
}

function OrganizationConfigComponent({groups, setGroups, organization}: OrganizationConfigComponentProps) {

    const updateGroup = (groupIdx: number) => (newGroup: GroupConfigV3) => {
        setGroups(groups.map((group, index) => {
            return index === groupIdx ? newGroup : group
        }));
    }

    const deleteGroup = (groupIdx: number) => () => {
        setGroups(groups.filter((_, index) => index !== groupIdx))
    }

    const createGroup = () => {
        setGroups([...groups, {name: 'new group', repositoryIds: [], showIndicators: false}])
    }

    const switchGroups = (fromIndex: number, toIndex: number) => () => {
        const fromGroup = groups[fromIndex]
        const toGroup = groups[toIndex]
        setGroups(groups.map((group, index) => {
            if (index === fromIndex) {
                return toGroup
            } else if (index === toIndex) {
                return fromGroup
            }
            return group
        }));
    }

    return <>
        <Typography.Title level={2}>{organization.label}</Typography.Title>
        {groups.map((group, groupIdx) =>
            <GroupConfigComponent key={`${group.name}-${groupIdx.toString()}`}
                                  group={group}
                                  moveBefore={groupIdx !== 0 ? switchGroups(groupIdx, groupIdx - 1) : undefined}
                                  moveAfter={groupIdx !== (groups.length - 1) ? switchGroups(groupIdx, groupIdx + 1) : undefined}
                                  updateGroup={updateGroup(groupIdx)}
                                  deleteGroup={deleteGroup(groupIdx)}/>)}
        <Divider/>
        <Button type="primary" icon={<AppstoreAddOutlined/>} onClick={createGroup}>Add new group</Button>
    </>
}

interface GroupConfigComponentProps {
    group: GroupConfigV3,
    updateGroup: (val: GroupConfigV3) => void
    deleteGroup: () => void
    moveBefore: undefined | (() => void)
    moveAfter: undefined | (() => void)
}

function GroupConfigComponent({group, updateGroup, deleteGroup, moveBefore, moveAfter}: GroupConfigComponentProps) {
    return <>
        <Divider titlePlacement="left">{group.name}</Divider>
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
        <Flex gap="small" wrap justify="flex-end">
            <Button color="primary" variant="filled" icon={<DownCircleOutlined/>}
                    disabled={!moveBefore}
                    onClick={moveBefore}>Move before</Button>
            <Button color="primary" variant="filled" icon={<UpCircleOutlined/>}
                    disabled={!moveAfter}
                    onClick={moveAfter}>Move after</Button>
            <Button type="primary" danger icon={<DeleteOutlined/>}
                    onClick={deleteGroup}>Delete group</Button>
        </Flex>
    </>
}
