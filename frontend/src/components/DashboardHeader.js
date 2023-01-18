import "../index.css"
import { Layout } from "antd"
import React from "react"
import logo from "../logo3.png"
const { Header } = Layout

const DashboardHeader = () => (
  <Header className="header">
    <div className="logo" />
    <img src={logo} style={{ width: 300, height: 50 }} alt="logo" />
  </Header>
)

export default DashboardHeader
