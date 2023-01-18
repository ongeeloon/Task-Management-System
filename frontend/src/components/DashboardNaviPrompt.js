import "../index.css"
import React from "react"
import { Result, Layout } from "antd"
const { Content } = Layout

const DashboardNaviPrompt = (
  <>
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: "16px 0",
        minHeight: 280
      }}
    >
      <Result
        status="success"
        title="Welcome to your Task Management App"
        subTitle="Click on the menu bar on the left to start navigating"
      />
    </Content>
  </>
)

export default DashboardNaviPrompt
