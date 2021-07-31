import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import RoutingList from '../RoutingList'
import SideMenu from './SideMenu';
import Banner from './Banner';

const { Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const onChangeCollapsed = () => {
        setCollapsed(prevState => !prevState)
    }

    return (
        <Layout className="layout-toplevel">
            <SideMenu collapsed={collapsed} onChangeCollapsed={onChangeCollapsed} />
            <Layout>
                <Banner collapsed={collapsed} onChangeCollapsed={onChangeCollapsed} />
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 20 }}>
                        <RoutingList />
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default MainLayout;