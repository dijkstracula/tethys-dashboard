import React from 'react';
import { Badge, Layout, Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;
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
        <div>
            {getCollapsedIcon(props)}
        </div>
    </Header>
);

export default Banner;