import {Layout, Menu, MenuProps} from "antd";
import {useBoolean} from "usehooks-ts";
import {FilterFilled, PullRequestOutlined} from "@ant-design/icons";
import {MenuInfo} from "rc-menu/lib/interface";


export type Screen = 'pull-requests' | 'config';
type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {key: 'pull-requests', icon: <PullRequestOutlined/>, label: 'Pull Requests'},
    {key: 'config', icon: <FilterFilled/>, label: 'Config'}
]

interface Props {
    onScreenChange: (screen: Screen) => void
}

const SiderComponent = ({onScreenChange}: Props) => {
    const {value: isMenuCollapsed, setValue: setMenuCollapsed} = useBoolean(true)

    const onMenuSelect = (event: MenuInfo) => {
        onScreenChange(event.key as Screen)
    }

    return <Layout.Sider collapsible collapsed={isMenuCollapsed} onCollapse={setMenuCollapsed}>
        <div className="demo-logo-vertical"/>
        <Menu theme="dark"
              defaultSelectedKeys={['pull-requests']}
              mode="inline"
              items={menuItems}
              onSelect={onMenuSelect}
        />
    </Layout.Sider>
}

export default SiderComponent