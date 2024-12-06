import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import logo from "@/assets/images/logo.png";
import { useDispatch } from 'react-redux';
import { clearToken } from '@/store/slices/authSlice';
import { BsBoxArrowRight } from "react-icons/bs"

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];
interface AdminLayoutProps {
    children: React.ReactNode;
}


const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearToken());
        localStorage.removeItem('authToken');
    };


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}><div className="w-full flex justify-center align-middle">
                <div className="w-full flex justify-between m-4 rounded-lg p-1 bg-[#ffffff2b]">
                    <img className="demo-logo-vertical flex m-auto" src={logo} alt="Jobify" width={80} />
                </div>
            </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header
                    className="w-full flex justify-end align-middle p-4"
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={<BsBoxArrowRight />}
                        onClick={handleLogout}
                        className="bg-white text-red-600 rounded-full "
                    />
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer className='flex justify-center items-center text-center gap-1'>
                    <img src={logo} alt="Jobify" width={80} />
                    ©{new Date().getFullYear()}
                    Created by
                    <a
                        href="https://github.com/ja-shuvro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-green-600 hover:text-green-800'
                    >
                        J.A Shuvro
                    </a>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;