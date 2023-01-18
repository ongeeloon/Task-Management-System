import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Axios from "axios"

import { Divider, Form } from "antd"
import { BookOutlined } from "@ant-design/icons"

import { ProFormSelect } from "@ant-design/pro-components"
import moment from "moment"

const SelectApplicationComponent = ({
  applicationNames,
  selectedApp,
  setSelectedApp,
  setApplicationPlans,
  setApplicationTasks,
  setPermitCreate,
  setPermitOpen,
  setPermitToDo,
  setPermitDoing,
  setPermitDone
}) => {
  const [selectAppForm] = Form.useForm()

  //If page is accessed from button click from applications page
  const location = useLocation()
  if (location.state !== null) {
    const { clickedApp } = location.state
    setSelectedApp(clickedApp)
    console.log("clickedapp" + clickedApp)
    console.log("selectedappstate" + selectedApp)
    //set form value to clicked app
    if (selectedApp !== null && selectedApp !== undefined) {
      selectAppForm.setFieldsValue({
        appSelectFromDropdown: selectedApp
      })
      location.state = null
    }
  }

  const onFinish = values => {
    setSelectedApp(values.appSelectFromDropdown)
    console.log(values.appSelectFromDropdown)
  }

  //Load selected application's plans, tasks, task permissions
  useEffect(() => {
    async function loadApplicationPlans() {
      try {
        let res = await Axios.get(
          "http://127.0.0.1:8080/api/plan/" + `${selectedApp}`,
          { withCredentials: true }
        )
        console.log(res.data.plans)
        let appPlans = res.data.plans
        let initialPlans = []
        appPlans.map(plan =>
          initialPlans.push({
            planName: plan.plan_name,
            planStartDate: moment(plan.plan_startdate),
            planEndDate: moment(plan.plan_enddate),
            planAppAcronym: plan.plan_app_acronym,
            planColour: plan.plan_colour
          })
        )
        setApplicationPlans(initialPlans)
      } catch (error) {
        console.log(error)
      }
    }

    async function loadApplicationTasks() {
      try {
        let res = await Axios.get(
          "http://127.0.0.1:8080/api/task/" + `${selectedApp}`,
          { withCredentials: true }
        )
        console.log(res.data.tasks)
        let appTasks = res.data.tasks
        let initialTasks = []
        appTasks.map(task =>
          initialTasks.push({
            taskID: task.task_id,
            taskName: task.task_name,
            taskDescription: task.task_description,
            taskNotes: task.task_notes,
            taskPlanName: task.task_plan_name,
            taskAppAcronym: task.task_app_acronym,
            taskState: task.task_state,
            taskCreator: task.task_creator,
            taskOwner: task.task_owner,
            taskCreateDate: moment(task.task_createdate)
          })
        )
        setApplicationTasks(initialTasks)
      } catch (error) {
        console.log(error)
      }
    }

    async function loadApplicationTaskPermissions() {
      try {
        let res = await Axios.get(
          "http://127.0.0.1:8080/api/application/permissions/" +
            `${selectedApp}`,
          { withCredentials: true }
        )
        console.log(res)
        console.log(res.data.appPermissions[0])
        setPermitCreate(res.data.appPermissions[0].app_permitcreate)
        setPermitOpen(res.data.appPermissions[0].app_permitopen)
        setPermitToDo(res.data.appPermissions[0].app_permittodo)
        setPermitDoing(res.data.appPermissions[0].app_permitdoing)
        setPermitDone(res.data.appPermissions[0].app_permitdone)
      } catch (error) {
        console.log(error)
      }
    }

    loadApplicationPlans()
    loadApplicationTasks()
    loadApplicationTaskPermissions()
  }, [selectedApp])

  return (
    <>
      <Divider orientation="center">
        <BookOutlined /> Select Application
      </Divider>

      <Form form={selectAppForm} onFinish={onFinish} layout="vertical">
        <ProFormSelect
          width="xs"
          name="appSelectFromDropdown"
          options={applicationNames.map(app => {
            return { value: `${app}`, label: `${app}` }
          })}
          placeholder="Select Application to Start"
          onChange={selectAppForm.submit}
        />
      </Form>
    </>
  )
}

export default SelectApplicationComponent
