import {GroupConfigV3, GroupConfigV3Parser} from "../../hooks/filter-config.hook.ts";
import {Organization} from "../../domain.ts";
import {useCallback, useMemo} from "react";
import {ItemType} from "@rc-component/collapse/es/interface";
import {Button, Collapse, message, Space, Typography} from "antd";
import {AppstoreAddOutlined, ImportOutlined} from "@ant-design/icons";
import {RepositoryGroupConfigComponent} from "./repository-group-config.component.tsx";
import {RepositoryGroupConfigActionsComponent} from "./repository-group-config-actions.component.tsx";

interface Props {
    groups: GroupConfigV3[],
    setGroups: (val: GroupConfigV3[]) => void,
    organization: Organization
}

export function OrganizationConfigComponent({groups, setGroups, organization}: Props) {
    const [messageApi, contextHolder] = message.useMessage();

    const updateGroup = useCallback((groupIdx: number, newGroup: GroupConfigV3) => {
        setGroups(groups.map((group, index) => {
            return index === groupIdx ? newGroup : group
        }));
    }, [groups, setGroups])

    const deleteGroup = useCallback((groupIdx: number) => {
        setGroups(groups.filter((_, index) => index !== groupIdx))
    }, [groups, setGroups])

    const createGroup = useCallback(() => {
        setGroups([...groups, {name: 'new group', repositoryIds: [], showIndicators: false}])
    }, [groups, setGroups])

    const importGroup = useCallback(() => {
        void navigator.clipboard.readText().then(data => {
            try {
                setGroups([...groups, GroupConfigV3Parser.parse(JSON.parse(data))])
                return messageApi.info('Group imported !')
            } catch (e) {
                console.error('Error during import', e)
                return messageApi.error('Error during import')
            }
        })
    }, [groups, setGroups, messageApi])

    const switchGroups = useCallback((fromIndex: number, toIndex: number) => {
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
    }, [groups, setGroups])

    const copyGroup = useCallback((group: GroupConfigV3) => {
        void navigator.clipboard.writeText(JSON.stringify(group))
            .then(() => messageApi.info('Group config copied !'))
    }, [messageApi])

    const items = useMemo<ItemType[]>(() => {
        return groups.map((group, groupIdx) => ({
            key: `${group.name}-${groupIdx.toString()}`,
            label: <Typography.Title level={3} style={{margin: 'auto'}}>{group.name}</Typography.Title>,
            children: <RepositoryGroupConfigComponent
                group={group}
                updateGroup={newGroup => {
                    updateGroup(groupIdx, newGroup);
                }}/>,
            extra: <RepositoryGroupConfigActionsComponent
                onMoveBefore={groupIdx !== 0 ? () => {
                    switchGroups(groupIdx, groupIdx - 1)
                } : undefined}
                onMoveAfter={groupIdx !== (groups.length - 1) ? () => {
                    switchGroups(groupIdx, groupIdx + 1)
                } : undefined}
                onDelete={() => {
                    deleteGroup(groupIdx);
                }}
                onCopy={() => {
                    copyGroup(group);
                }}
            />
        }))
    }, [groups, updateGroup, switchGroups, deleteGroup, copyGroup])

    return <>
        {contextHolder}
        <Typography.Title level={2}>
            {organization.label}
        </Typography.Title>
        <Collapse items={items}
                  style={{
                      marginTop: '24px'
                  }}
                  styles={{
                      header: {
                          display: 'flex',
                          alignItems: 'center'
                      }
                  }}
        />
        <Space style={{
            marginTop: '24px'
        }}>
            <Button type="primary"
                    icon={<AppstoreAddOutlined/>}
                    onClick={createGroup}>
                Add new group
            </Button>
            <Button type="primary"
                    icon={<ImportOutlined/>}
                    onClick={importGroup}>
                Import from clipboard
            </Button>
        </Space>
    </>
}