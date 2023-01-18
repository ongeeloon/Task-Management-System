import "../index.css"
import { Outlet } from "react-router-dom"

//Import components
import DashboardHeader from "../components/DashboardHeader"
import DashboardMenuAdmin from "../components/DashboardMenuAdmin"

import { Layout } from "antd"
import React from "react"

const AdminDashboardPage = () => {
  // useLayoutEffect(() => {
  //   const openNotification = () => {
  //     notification.open({
  //       message: "Welcome!",
  //       description: "Click on the menu bar on the left to start navigating.",
  //       icon: <SmileOutlined style={{ color: "#108ee9" }} />
  //     })
  //   }
  //   openNotification()
  // }, [])

  return (
    <Layout>
      <DashboardHeader />
      <Layout>
        <DashboardMenuAdmin />
        <Layout
          style={{
            padding: "0 24px 24px"
            //backgroundColor: "white"
          }}
        >
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}
export default AdminDashboardPage
