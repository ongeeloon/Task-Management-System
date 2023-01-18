import React, { useEffect, useState } from "react"
import Axios from "axios"
import enUS from "antd/es/locale/en_US"

import { Layout, ConfigProvider } from "antd"

//import components
import CreateNewApplicationComponent from "./CreateNewApplication"
import ViewEditAllApplicationsComponent from "./ViewEditAllApplications"

const { Content } = Layout

const ManageApplications = () => {
  localStorage.setItem("page", "manageapplications")

  const [appDataSource, setAppDataSource] = useState([])
  const [groupnames, setGroupnames] = useState()
  const [currentUsername, setCurrentUsername] = useState()
  const [currentUserGroups, setCurrentUserGroups] = useState([])
  const [isProjectLead, setIsProjectLead] = useState(false)

  useEffect(() => {
    async function getAllGroups() {
      try {
        let res = await Axios.get("http://127.0.0.1:8080/api/group/", {
          withCredentials: true
        })
        console.log(res)
        console.log(res.data.groups)
        let dbGroups = res.data.groups
        let initialGroups = []
        dbGroups.map(group => initialGroups.push(group.groupname))

        setGroupnames(initialGroups)
      } catch (error) {
        console.log(error)
      }
    }
    async function getCurrentUsername() {
      try {
        let res = await Axios.get(
          "http://127.0.0.1:8080/api/views/currentUser",
          {
            withCredentials: true
          }
        )
        console.log("use effect function getCurrentUsername")
        console.log(res.data.currentUser)
        let currentUsername = res.data.currentUser.username
        setCurrentUsername(currentUsername)
      } catch (error) {
        console.log(error)
      }
    }
    getAllGroups()
    getCurrentUsername()
  }, [])

  //get current user's groups once the username is set
  useEffect(() => {
    async function getCurrentUserGroups() {
      try {
        let res = await Axios.get(
          "http://127.0.0.1:8080/api/userGroup/" + `${currentUsername}`,
          {
            withCredentials: true
          }
        )
        console.log("use effect function getCurrentUserGroups")
        console.log(res.data.groups)
        let ug = res.data.groups
        let currentUG = []
        ug.map(group => {
          if (group.groupname === "project-lead") {
            setIsProjectLead(true)
          }
          currentUG.push(group.groupname)
        })
        setCurrentUserGroups(currentUG)
      } catch (error) {
        console.log(error)
      }
    }
    getCurrentUserGroups()
  }, [currentUsername])

  if (groupnames != null) {
    return (
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: "16px 0",
          minHeight: 280
        }}
      >
        <ConfigProvider locale={enUS}>
          <CreateNewApplicationComponent
            groupnames={groupnames}
            setAppDataSource={setAppDataSource}
            isProjectLead={isProjectLead}
          />
          <ViewEditAllApplicationsComponent
            groupnames={groupnames}
            appDataSource={appDataSource}
            setAppDataSource={setAppDataSource}
            isProjectLead={isProjectLead}
          />
        </ConfigProvider>
      </Content>
    )
  }
}

export default ManageApplications
