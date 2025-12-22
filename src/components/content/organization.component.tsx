import RepositoryComponent from "./repository.component.tsx";
import {Badge, Collapse, Typography} from "antd";
import {OrganizationsContext} from "../../contexts/organizations.context.tsx";
import {useContext, useMemo} from "react";
import {ItemType} from "@rc-component/collapse/es/interface";

export function OrganizationComponent() {

    const {selectedOrganization} = useContext(OrganizationsContext);

    const items = useMemo<ItemType[]>(() => {
        if (selectedOrganization == null) {
            return []
        }
        return selectedOrganization.groups.map((group, index) => ({
            key: `${group.name}-${index.toString()}`,
            label: <Typography.Title level={3} style={{margin: 'auto'}}>{group.name}</Typography.Title>,
            children: group.repositories.map((repositoryId) =>
                <RepositoryComponent key={repositoryId}
                                     groupConfig={group}
                                     repositoryId={repositoryId}
                                     organizationId={selectedOrganization.id}/>),
            extra: <Badge count={group.repositories.length} showZero color="blue"/>
        }))
    }, [selectedOrganization])

    return selectedOrganization
        ? <Collapse items={items}
                    defaultActiveKey={items.length > 0 ? items[0].key as string : undefined}
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
        : null
}