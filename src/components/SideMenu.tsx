import { Layout, Menu } from 'antd';
import { useHistory } from 'react-router';
import { MenuInfo } from 'rc-menu/lib/interface';

import {
    DashboardOutlined,
    PartitionOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import TagTypeahead from './TagTypeahead';

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


    const onMenuSelect = (info: MenuInfo) => {
        switch (info.key) {
            case 'dashboard':
                history.push('/');
                break;
            case 'tags':
                history.push('/tags');
                break;
            default:
                history.push('/');
                break;
        }
    }

    return (
        <Sider
            width="256"
            theme="dark"
            onCollapse={props.onChangeCollapsed}
            collapsed={props.collapsed}
        >
            <a href="#top">
                <div className="menu-logo"></div>
            </a>
            <Menu mode="inline" onClick={onMenuSelect}>
                <Menu.Item key="dashboard">
                    <DashboardOutlined />
                    <span className="nav-text">Dashboard</span>
                </Menu.Item>

                <SubMenu key="tag-menu" title={partitionAndTitle("Tags")}>
                    <Menu.Item key="tags">
                        <span className="nav-text">All tags</span>
                    </Menu.Item>
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