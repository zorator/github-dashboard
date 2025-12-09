import {Menu, MenuProps, Skeleton} from "antd";
import {useContext} from "react";
import {OrganizationsContext} from "../../contexts/organizations.context.tsx";
import {SelectInfo} from "@rc-component/menu/lib/interface";

const OrganizationMenuComponent = () => {

    const {
        organizations,
        organizationsLoadingStatus: status,
        selectedOrganization,
        selectOrganization
    } = useContext(OrganizationsContext);

    const onMenuSelect = (event: SelectInfo) => {
        selectOrganization(event.key)
    }

    if (status === 'loading') {
        return <MenuSkeleton/>
    } else if (status === 'error') {
        return 'Error while loading user organizations'
    } else if (organizations.length === 0) {
        return 'No organizations associated to current user'
    }
    const menuItems: MenuProps['items'] = organizations.map((organization) => ({
        key: organization.id,
        label: organization.label
    }))
    return <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[selectedOrganization ? selectedOrganization.id : organizations[0].id]}
        items={menuItems}
        style={{flex: 1, minWidth: 0}}
        onSelect={onMenuSelect}
    />
}

const MenuSkeleton = () => <>
    {[1, 2].map((idx) =>
        <Skeleton.Input key={idx} active={true}
                        style={{display: 'flex', marginRight: '16px'}}
        />)}
</>

export default OrganizationMenuComponent