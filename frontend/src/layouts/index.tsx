import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Breadcrumb, theme } from 'antd';
import type { MenuProps } from 'antd'; // Import MenuProps
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import { useDispatch } from 'react-redux';
import { clearToken } from '@/store/slices/authSlice';
import { BsBoxArrowRight, BsBriefcase, BsBuildings } from 'react-icons/bs';

const { Header, Content, Footer, Sider } = Layout;

interface CustomMenuItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    path?: string;
    children?: CustomMenuItem[];
}

const menuItems: CustomMenuItem[] = [
    { key: '/', label: 'Dashboard', icon: <BsBuildings />, path: '/' },
    {
        key: '',
        label: 'Jobs',
        icon: <BsBriefcase />,
        children: [
            { key: '/jobs', label: 'Jobs', path: '/jobs' },
            { key: '/categories', label: 'Category', path: '/categories' },
            { key: '/type', label: 'Type', path: '/type' },
        ],
    },
    { key: '/companies', label: 'Companies', icon: <BsBuildings />, path: '/companies' },
    { key: '/users', label: 'Users', icon: <UserOutlined />, path: '/users' },
];

const convertToAntMenuItems = (items: CustomMenuItem[]): MenuProps['items'] =>
    items.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: item.children ? convertToAntMenuItems(item.children) : undefined,
    }));

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Get the current route

    const handleLogout = () => {
        dispatch(clearToken());
        localStorage.removeItem('authToken');
    };

    const handleMenuClick: MenuProps['onClick'] = (menuInfo) => {
        const findPath = (menuItems: CustomMenuItem[], key: string): string | undefined => {
            for (const item of menuItems) {
                if (item.key === key) return item.path;
                if (item.children) {
                    const foundPath = findPath(item.children, key);
                    if (foundPath) return foundPath;
                }
            }
            return undefined;
        };

        const path = findPath(menuItems, menuInfo.key);
        if (path) {
            // Only navigate if the path is different from the current path
            if (location.pathname !== path) {
                navigate(path);
            }
        }
    };

    // Function to determine the selected menu item based on the current route
    const getSelectedKeys = () => {
        const currentPath = location.pathname;
        return [currentPath]; // Set the selected key based on the current path
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="w-full flex justify-center align-middle">
                    <div className="w-full flex justify-between m-4 rounded-lg p-1 bg-[#ffffff2b]">
                        <img className="demo-logo-vertical flex m-auto" src={logo} alt="Jobify" width={80} />
                    </div>
                </div>
                <Menu
                    theme="dark"
                    selectedKeys={getSelectedKeys()} // Dynamically set selected keys based on the current route
                    mode="inline"
                    items={convertToAntMenuItems(menuItems)}
                    onClick={handleMenuClick}
                />
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
                        className="bg-white text-red-600 rounded-full"
                    />
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} items={[
                        { title: 'User' },
                        { title: 'Bill' }
                    ]} />
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

                <Footer className="flex justify-center items-center text-center gap-1">
                    <img src={logo} alt="Jobify" width={80} />
                    ©{new Date().getFullYear()} Created by{' '}
                    <a
                        href="https://github.com/ja-shuvro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                    >
                        J.A Shuvro
                    </a>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
