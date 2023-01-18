import React, { useEffect, useState } from "react"
import Axios from "axios"
import enUS from "antd/es/locale/en_US"

import { Layout, Divider, Row, Col, ConfigProvider } from "antd"
import { BookOutlined } from "@ant-design/icons"

//Import components
import SelectApplicationComponent from "./SelectApplication"
import CreateNewTaskComponent from "./CreateNewTask"
import CreateNewPlanComponent from "./CreateNewPlan"
import ViewPlansComponent from "./ViewPlans"
import KanbanBoardComponent from "./KanbanBoardComponent"

const { Content } = Layout

const ManageTasksPlans = () => {
  localStorage.setItem("page", "managetasks")

  const [selectedApp, setSelectedApp] = useState()
  const [applicationNames, setApplicationNames] = useState([])
  const [applicationPlans, setApplicationPlans] = useState([])
  const [currentUsername, setCurrentUsername] = useState()
  const [currentUserGroups, setCurrentUserGroups] = useState([])
  const [applicationTasks, setApplicationTasks] = useState([])
  const [isProjectManager, setIsProjectManager] = useState(false)
  const [permitCreate, setPermitCreate] = useState()
  const [permitOpen, setPermitOpen] = useState()
  const [permitToDo, setPermitToDo] = useState()
  const [permitDoing, setPermitDoing] = useState()
  const [permitDone, setPermitDone] = useState()

  //get all application names from DB and get current username
  useEffect(() => {
    async function getAllApplicationNames() {
      try {
        let res = await Axios.get("http://127.0.0.1:8080/api/application/", {
          withCredentials: true
        })
        console.log("use effect function getAllApplicationNames")
        console.log(res)
        console.log(res.data.applications)
        let dbApplications = res.data.applications
        let initialApplications = []
        dbApplications.map(app => initialApplications.push(app.app_acronym))
        setApplicationNames(initialApplications)
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
    getAllApplicationNames()
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
          if (group.groupname === "project-manager") {
            setIsProjectManager(true)
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

  if (currentUserGroups != null) {
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
          <Row gutter={14}>
            <Col span={8}>
              <SelectApplicationComponent
                applicationNames={applicationNames}
                selectedApp={selectedApp}
                setSelectedApp={setSelectedApp}
                setApplicationPlans={setApplicationPlans}
                setApplicationTasks={setApplicationTasks}
                setPermitCreate={setPermitCreate}
                setPermitOpen={setPermitOpen}
                setPermitToDo={setPermitToDo}
                setPermitDoing={setPermitDoing}
                setPermitDone={setPermitDone}
              />
            </Col>
            <Col span={8}>
              <Divider orientation="center">
                <BookOutlined /> Create Task / Plan
              </Divider>
              <CreateNewTaskComponent
                currentUsername={currentUsername}
                applicationNames={applicationNames}
                selectedApp={selectedApp}
                applicationPlans={applicationPlans}
                setApplicationTasks={setApplicationTasks}
                currentUserGroups={currentUserGroups}
                permitCreate={permitCreate}
              />
              <CreateNewPlanComponent
                applicationNames={applicationNames}
                selectedApp={selectedApp}
                setApplicationPlans={setApplicationPlans}
                isProjectManager={isProjectManager}
              />
            </Col>
            <Col span={8}>
              <Divider orientation="center">
                <BookOutlined /> Plans
              </Divider>
              <ViewPlansComponent applicationPlans={applicationPlans} />
            </Col>
          </Row>
          <Row>
            <KanbanBoardComponent
              applicationTasks={applicationTasks}
              applicationPlans={applicationPlans}
              applicationNames={applicationNames}
              setApplicationTasks={setApplicationTasks}
              currentUsername={currentUsername}
              currentUserGroups={currentUserGroups}
              permitOpen={permitOpen}
              permitToDo={permitToDo}
              permitDoing={permitDoing}
              permitDone={permitDone}
            />
          </Row>
        </ConfigProvider>
      </Content>
    )
  }
}

export default ManageTasksPlans
