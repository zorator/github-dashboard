import {ConfigProvider, Layout, Switch, theme} from 'antd';
import {MoonFilled, SunFilled} from "@ant-design/icons";
import {useDarkMode} from "usehooks-ts";
import {FilterComponent} from "./components/filter.component.tsx";
import SiderComponent, {Screen} from "./components/nav/sider.component.tsx";
import {useState} from "react";
import OrganizationMenuComponent from "./components/nav/organization-menu.component.tsx";
import {OrganizationsProvider} from "./contexts/organizations.context.tsx";
import {OrganizationComponent} from "./components/organization.component.tsx";

function App() {
    const [selectedScreen, setSelectedScreen] = useState<Screen>('pull-requests')
    const {isDarkMode, toggle: toggleDarkMode} = useDarkMode()

    return (
        <ConfigProvider
            tag={{
                styles: {root: {marginInlineEnd: 4}}
            }}
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
            <OrganizationsProvider>
                <Layout style={{minHeight: '100%', overflow: 'auto', paddingBottom: '24px'}}>
                    <SiderComponent onScreenChange={setSelectedScreen}/>
                    <Layout>
                        <Layout.Header style={{display: 'flex', alignItems: 'center'}}>
                            <OrganizationMenuComponent/>
                            <div style={{flex: 'auto'}}/>
                            <Switch
                                checkedChildren={<SunFilled/>}
                                unCheckedChildren={<MoonFilled/>}
                                defaultChecked={!isDarkMode}
                                onChange={toggleDarkMode}
                            />
                        </Layout.Header>
                        <Layout.Content style={{padding: '0 48px 24px 48px'}}>
                            {selectedScreen == 'pull-requests'
                                ? <OrganizationComponent/>
                                : <FilterComponent/>}
                        </Layout.Content>
                    </Layout>
                </Layout>
            </OrganizationsProvider>
        </ConfigProvider>
    );
}

export default App
