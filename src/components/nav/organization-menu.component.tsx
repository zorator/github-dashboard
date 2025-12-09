import {Menu, MenuProps, Skeleton} from "antd";
import {MenuInfo} from "rc-menu/lib/interface";
import {useContext} from "react";
import {OrganizationsContext} from "../../contexts/organizations.context.tsx";

const OrganizationMenuComponent = () => {

    const {organizations, organizationsLoadingStatus: status, selectOrganization} = useContext(OrganizationsContext);

    const onMenuSelect = (event: MenuInfo) => {
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
        defaultSelectedKeys={[organizations[0].id]}
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