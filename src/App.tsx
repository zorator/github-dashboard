import OrganizationsComponent from "./components/organizations.component.tsx";
import {Button, ConfigProvider, Drawer, Layout, Switch, theme} from 'antd';
import {FilterFilled, MoonFilled, SunFilled} from "@ant-design/icons";
import {useBoolean, useDarkMode} from "usehooks-ts";
import {FilterComponent} from "./components/filter.component.tsx";

function App() {
    const {value: isDrawerOpen, setTrue: openDrawer, setFalse: closeDrawer} = useBoolean(false)
    const {isDarkMode, toggle: toggleDarkMode} = useDarkMode()

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
            <Layout style={{minHeight: '100%', overflow: 'auto', paddingBottom: '24px'}}>
                <Layout.Header style={{display: 'flex', alignItems: 'center'}}>
                    <Button type="primary" icon={<FilterFilled/>} onClick={openDrawer}>
                        Filter
                    </Button>
                    <div style={{flex: 'auto'}}/>
                    <Switch
                        checkedChildren={<SunFilled/>}
                        unCheckedChildren={<MoonFilled/>}
                        defaultChecked={!isDarkMode}
                        onChange={toggleDarkMode}
                    />
                </Layout.Header>
                <Layout.Content style={{padding: '0 48px 24px 48px'}}>
                    <OrganizationsComponent/>
                </Layout.Content>
                <Drawer title="Repository Filter"
                        placement="left"
                        onClose={closeDrawer}
                        open={isDrawerOpen}>
                    <FilterComponent/>
                </Drawer>
            </Layout>
        </ConfigProvider>
    );
}

export default App
