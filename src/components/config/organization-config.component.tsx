import {GroupConfigV3} from "../../hooks/filter-config.hook.ts";
import {Organization} from "../../domain.ts";
import {useCallback, useMemo} from "react";
import {ItemType} from "@rc-component/collapse/es/interface";
import {Button, Collapse, Typography} from "antd";
import {AppstoreAddOutlined} from "@ant-design/icons";
import {RepositoryGroupConfigComponent} from "./repository-group-config.component.tsx";
import {RepositoryGroupConfigActionsComponent} from "./repository-group-config-actions.component.tsx";

interface Props {
    groups: GroupConfigV3[],
    setGroups: (val: GroupConfigV3[]) => void,
    organization: Organization
}

export function OrganizationConfigComponent({groups, setGroups, organization}: Props) {

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

    const items = useMemo<ItemType[]>(() => {
        return groups.map((group, groupIdx) => ({
            key: `${group.name}-${groupIdx.toString()}`,
            label: <Typography.Title level={3} style={{margin: 'auto'}}>{group.name}</Typography.Title>,
            children: <RepositoryGroupConfigComponent
                key={`${group.name}-${groupIdx.toString()}`}
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
            />
        }))
    }, [groups, updateGroup, switchGroups, deleteGroup])

    return <>
        <Typography.Title level={2}>
            {organization.label}
        </Typography.Title>
        <Collapse items={items}
                  bordered={false}
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
        <Button type="primary"
                icon={<AppstoreAddOutlined/>}
                onClick={createGroup}>
            Add new group
        </Button>
    </>
}