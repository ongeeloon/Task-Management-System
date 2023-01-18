import { Link } from "react-router-dom"

import "../index.css"

import {
  UserOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
  BookOutlined
} from "@ant-design/icons"
import { Layout, Menu, Divider } from "antd"
import React from "react"

const { Sider } = Layout

const DashboardMenuUser = () => (
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
          <Link to="/user/profile"> My Profile</Link>
        </Menu.Item>
      </Menu.ItemGroup>

      {/* TASK MANAGEMENT */}
      <Menu.ItemGroup key="taskmgt" title="Task Management">
        <Menu.Item key="manageapps">
          <AppstoreAddOutlined />
          <Link to="/user/applications"> Manage Applications</Link>
        </Menu.Item>
        <Menu.Item key="managetasks">
          <BookOutlined />
          <Link to="/user/tasks"> Manage Tasks & Plans</Link>
        </Menu.Item>
      </Menu.ItemGroup>

      {/* DIVIDER */}
      <Menu.Item>
        <Divider />
      </Menu.Item>

      {/* LOGOUT */}
      <Menu.Item key="logout">
        <LogoutOutlined />
        <Link to="/user/logout"> Log Out</Link>
      </Menu.Item>
    </Menu>
  </Sider>
)

export default DashboardMenuUser
