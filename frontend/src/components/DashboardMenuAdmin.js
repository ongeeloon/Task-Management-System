import { Link } from "react-router-dom"

import "../index.css"

import {
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  ApartmentOutlined
} from "@ant-design/icons"
import { Layout, Menu, Divider } from "antd"
import React from "react"

const { Sider } = Layout

const DashboardMenuAdmin = () => (
  <Sider width={200} className="site-layout-background">
    <Menu
      mode="inline" //subnavs/children open vertically downwards
      style={{
        height: "200vh",
        borderRight: 0
        //backgroundColor: "rgb(242, 234, 226)"
      }}
    >
      {/* MY PROFILE */}
      <Menu.ItemGroup key="profilemgt" title="Profile">
        <Menu.Item key="profile">
          <UserOutlined />
          <Link to="/admin/profile"> My Profile</Link>
        </Menu.Item>
      </Menu.ItemGroup>

      {/* USER MANAGEMENT */}
      <Menu.ItemGroup key="usermgt" title="User Management">
        <Menu.Item key="manageusers">
          <TeamOutlined />
          <Link to="/admin/users"> Manage Users</Link>
        </Menu.Item>
        <Menu.Item key="managegroups">
          <ApartmentOutlined />
          <Link to="/admin/groups"> Manage Groups</Link>
        </Menu.Item>
      </Menu.ItemGroup>

      {/* DIVIDER */}
      <Menu.Item>
        <Divider />
      </Menu.Item>

      {/* LOGOUT */}
      <Menu.Item key="logout">
        <LogoutOutlined />
        <Link to="/admin/logout"> Log Out</Link>
      </Menu.Item>
    </Menu>
  </Sider>
)

export default DashboardMenuAdmin
