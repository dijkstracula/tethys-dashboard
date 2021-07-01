import React from 'react';
import { Layout, Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    QuestionCircleOutlined,
    GlobalOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

interface Props {
    onChangeCollapsed: () => void,
    collapsed: boolean
}

function getCollapsedIcon(props: Props) {
    if (props.collapsed) {
        return (<MenuUnfoldOutlined onClick={props.onChangeCollapsed} className="trigger" />)
    } else {
        return (<MenuFoldOutlined onClick={props.onChangeCollapsed} className="trigger" />)
    }
}

const Banner = (props: Props) => (
    <Header className="banner">
        <div className="banner">
            {getCollapsedIcon(props)}
        </div>
    </Header>
);

export default Banner;