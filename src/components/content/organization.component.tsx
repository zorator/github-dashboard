import RepositoryComponent from "./repository.component.tsx";
import {Badge, Collapse, CollapseProps, Typography} from "antd";
import {OrganizationsContext} from "../../contexts/organizations.context.tsx";
import {useContext, useMemo} from "react";

export function OrganizationComponent() {

    const {selectedOrganization} = useContext(OrganizationsContext);

    const items = useMemo<CollapseProps['items']>(() => {
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
                    defaultActiveKey={['1']}
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