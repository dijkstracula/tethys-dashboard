import React from 'react';
import { Layout, Menu } from 'antd';
import { useHistory } from 'react-router';

import {
    DashboardOutlined,
    FundProjectionScreenOutlined,
    PartitionOutlined,
    SettingOutlined,
    TeamOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface Props {
    onChangeCollapsed: () => void,
    collapsed: boolean
}

function partitionAndTitle(title: string) {
    return (
        <span>
            <PartitionOutlined />
            <span>{title}</span>
        </span>
    )
}


const SideMenu = (props: Props) => {

    const history = useHistory();

    return (
        <Sider
            width="256"
            theme="dark"
            onCollapse={props.onChangeCollapsed}
            collapsed={props.collapsed}
        >
            <a>
                <div className="menu-logo"></div>
            </a>
            <Menu mode="inline">
                <Menu.Item key="dashboard">
                    <DashboardOutlined />
                    <span className="nav-text">Dashboard</span>
                </Menu.Item>

                <SubMenu key="tags" title={partitionAndTitle("Tags")}>

                </SubMenu>

                <Menu.Item key="settings">
                    <SettingOutlined />
                    <span className="nav-text">Settings</span>
                </Menu.Item>
            </Menu>
        </Sider>
    )
}

export default SideMenu;