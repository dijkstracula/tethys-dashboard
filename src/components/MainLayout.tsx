import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Routes from '../Routes'
import SideMenu from './SideMenu';
import Banner from './Banner';
import Footer from './Footer';

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
                <Content>
                    {Routes}
                </Content>
                <Footer />
            </Layout>
        </Layout>
    )
}

export default MainLayout;