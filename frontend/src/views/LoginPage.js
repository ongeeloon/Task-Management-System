import "../index.css"
//Import components
import LoginForm from "../components/LoginForm"
import DashboardHeader from "../components/DashboardHeader"

import { Layout, Typography } from "antd"
import React from "react"
const { Content } = Layout
const { Title } = Typography

const LoginPage = () => {
  return (
    <>
      <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <DashboardHeader />
        <Content>
          <Title level={3} style={{ textAlign: "center", padding: 30 }}>
            Login to your account
          </Title>
          <LoginForm />
        </Content>
      </Layout>
    </>
  )
}
export default LoginPage
