import React, { useEffect, useState } from "react"
import Axios from "axios"

import {
  Divider,
  Form,
  Input,
  Row,
  Col,
  message,
  Modal,
  DatePicker,
  Card,
  Typography,
  Tooltip,
  Descriptions
} from "antd"
import {
  BookOutlined,
  CaretRightOutlined,
  CaretLeftOutlined,
  EyeOutlined,
  EditOutlined
} from "@ant-design/icons"

import {
  ProFormSelect,
  ProFormTextArea,
  ProForm,
  ProFormGroup
} from "@ant-design/pro-components"
import moment from "moment"
const { Title } = Typography

const KanbanBoardComponent = ({
  applicationTasks,
  applicationPlans,
  applicationNames,
  setApplicationTasks,
  currentUsername,
  currentUserGroups,
  permitOpen,
  permitToDo,
  permitDoing,
  permitDone
}) => {
  const [planColours, setPlanColours] = useState([])

  useEffect(() => {
    async function loadProjectPlanColours() {
      let planColours = []
      applicationPlans.map(plan =>
        planColours.push({
          planName: plan.planName,
          planColour: plan.planColour
        })
      )
      console.log(planColours)
      setPlanColours(planColours)
    }
    loadProjectPlanColours()
  }, [applicationPlans])

  //Modal for viewing task details
  const [viewTaskOpen, setViewTaskOpen] = useState(false)
  const [modalViewObject, setModalViewObject] = useState([])

  const viewTaskDetails = taskID => {
    const index = applicationTasks.findIndex(item => taskID === item.taskID)
    const selectedTask = applicationTasks[index]
    setModalViewObject(selectedTask)
    if (modalViewObject) {
      setViewTaskOpen(true)
    }
  }

  const handleViewTaskCancel = () => {
    setViewTaskOpen(false)
    setModalViewObject([])
  }

  //Modal for editing task details
  const [editTaskOpen, setEditTaskOpen] = useState(false)

  const editTaskDetails = taskID => {
    setEditTaskOpen(true)
    const index = applicationTasks.findIndex(item => taskID === item.taskID)
    const selectedTask = applicationTasks[index]
    editTaskForm.setFieldsValue({
      taskID: "",
      taskName: "",
      taskDescription: "",
      newNotes: "",
      taskNotes: "",
      taskPlanName: "",
      taskAppAcronym: "",
      taskState: "",
      taskCreator: "",
      taskOwner: "",
      taskCreateDate: "",
      ...selectedTask
    })
  }

  let taskID
  let taskName
  let taskDescription
  let newNotes
  let taskPlanName
  let taskAppAcronym
  let taskState
  let taskCreator
  let taskOwner
  let taskCreateDate

  const onFinish = values => {
    //map values to variables
    taskID = values.taskID
    taskName = values.taskName
    taskDescription = values.taskDescription
    newNotes = values.newNotes
    taskPlanName = values.taskPlanName
    taskAppAcronym = values.taskAppAcronym
    taskState = values.taskState
    taskCreator = values.taskCreator
    taskOwner = currentUsername
    taskCreateDate = moment(values.taskCreateDate).format("YYYY-MM-DD")

    //call handle edit task method
    handleEditTask()
  }

  const handleEditTaskCancel = () => {
    setEditTaskOpen(false)
  }

  async function handleEditTask() {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/task/edit",
        {
          taskID,
          taskName,
          taskDescription,
          newNotes,
          taskPlanName,
          taskAppAcronym,
          taskState,
          taskCreator,
          taskOwner,
          taskCreateDate
        },
        { withCredentials: true }
      )
      console.log(res)

      //receive task object just updated
      const updatedTask = res.data.editedTask

      //display success message
      let successMessage = res.data.message
      message.success(successMessage)

      //Close modal when successful
      setEditTaskOpen(false)

      //Update task in view
      updateTaskInView(updatedTask)
    } catch (error) {
      console.log(error)
      //Error message for validation errors
      if (error.response.data.validationErrors) {
        let validationErrorArray = error.response.data.validationErrors
        let allValidationErrMsg = []
        validationErrorArray.map(error => allValidationErrMsg.push(error.msg))
        message.error(allValidationErrMsg.join(" | "))
        allValidationErrMsg = []
      }
      //Error message for error handler
      if (error.response.data.message) {
        let errMessage = error.response.data.message
        message.error(errMessage)
      }
    }
  }

  const updateTaskInView = updatedTask => {
    const newData = [...applicationTasks]

    const index = newData.findIndex(item => taskID === item.taskID)
    if (index > -1) {
      const editedTask = newData[index]
      editedTask.taskName = updatedTask.task_name
      editedTask.taskDescription = updatedTask.task_description
      editedTask.taskNotes = updatedTask.task_notes
      editedTask.taskPlanName = updatedTask.task_plan_name
      editedTask.taskOwner = updatedTask.task_owner
      newData[index] = editedTask
    }
    setApplicationTasks(newData)
  }
  const [editTaskForm] = Form.useForm()

  const promoteTask = (taskID, taskState) => {
    let newState
    switch (taskState) {
      case "Open":
        newState = "ToDo"
        break
      case "ToDo":
        newState = "Doing"
        break
      case "Doing":
        newState = "Done"
        break
      case "Done":
        newState = "Closed"
        break
      default:
        newState = taskState
        message.error("Task at this state cannot be promoted")
        break
    }

    if (newState !== taskState) {
      handleTaskStateChange(taskID, newState)
      console.log(newState)
    }
  }

  const demoteTask = (taskID, taskState) => {
    let newState
    switch (taskState) {
      case "Done":
        newState = "Doing"
        break
      case "Doing":
        newState = "ToDo"
        break
      default:
        newState = taskState
        message.error("Task at this state cannot be demoted")
        break
    }

    if (newState !== taskState) {
      handleTaskStateChange(taskID, newState)
      console.log(newState)
    }
  }

  async function handleTaskStateChange(taskID, newState) {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/task/editState",
        {
          taskID,
          newState,
          currentUsername
        },
        { withCredentials: true }
      )
      console.log(res)

      //receive task object just updated
      const updatedTask = res.data.editedTask

      //set application task with edited data
      const newData = [...applicationTasks]
      const index = newData.findIndex(item => taskID === item.taskID)
      if (index > -1) {
        const editedTask = newData[index]
        editedTask.taskState = updatedTask.task_state
        editedTask.taskOwner = updatedTask.task_owner
        editedTask.taskNotes = updatedTask.task_notes
        newData[index] = editedTask
      }
      setApplicationTasks(newData)
    } catch (error) {
      console.log(error)
      //Error message for error handler
      if (error.response.data.message) {
        let errMessage = error.response.data.message
        message.error(errMessage)
      }
    }
  }

  const KanbanCard = task => {
    let planColour
    if (task.taskPlanName !== null && task.taskPlanName !== undefined) {
      const index = planColours.findIndex(
        item => task.taskPlanName === item.planName
      )
      if (index > -1) {
        const plan = planColours[index]
        planColour = plan.planColour
      }
    } else {
      planColour = "#ffffff"
    }

    if (planColour !== undefined) {
      return (
        <>
          <div style={{ paddingTop: 10 }}>
            <Card
              size="small"
              title={task.taskName}
              style={{
                width: 180,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "lightgrey"
              }}
            >
              <Row>
                <Col
                  span={1}
                  style={{
                    backgroundColor: `${planColour}`
                  }}
                ></Col>

                <Col span={23} style={{ textAlign: "center" }}>
                  <Row justify="space-evenly" align="middle">
                    <Col flex={1}>
                      <CaretLeftOutlined
                        style={{ fontSize: 20 }}
                        onClick={() => {
                          if (
                            task.taskState === "Doing" &&
                            currentUserGroups.includes(permitDoing)
                          ) {
                            demoteTask(task.taskID, task.taskState)
                          } else if (
                            task.taskState === "Done" &&
                            currentUserGroups.includes(permitDone)
                          ) {
                            demoteTask(task.taskID, task.taskState)
                          } else if (
                            task.taskState === "Open" ||
                            task.taskState === "ToDo" ||
                            task.taskState === "Closed"
                          ) {
                            message.error(
                              "Task at this state cannot be demoted"
                            )
                          } else {
                            message.error(
                              "You do not have the permissions required to demote task at this state"
                            )
                          }
                        }}
                      />
                    </Col>
                    <Col flex={4}>
                      <div>
                        <span style={{ fontWeight: "bold" }}>ID </span>
                        {task.taskID}
                      </div>

                      <div style={{ paddingBottom: 10 }}>
                        <span style={{ fontWeight: "bold" }}>Owner </span>
                        {task.taskOwner}
                      </div>
                      <Tooltip title="View Details">
                        <Typography.Link
                          onClick={() => viewTaskDetails(task.taskID)}
                          style={{
                            marginRight: 30
                          }}
                        >
                          <EyeOutlined style={{ color: "black" }} />
                        </Typography.Link>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <Typography.Link
                          onClick={() => {
                            if (task.taskState !== "Closed") {
                              if (
                                task.taskState === "Open" &&
                                currentUserGroups.includes(permitOpen)
                              ) {
                                editTaskDetails(task.taskID)
                              } else if (
                                task.taskState === "ToDo" &&
                                currentUserGroups.includes(permitToDo)
                              ) {
                                editTaskDetails(task.taskID)
                              } else if (
                                task.taskState === "Doing" &&
                                currentUserGroups.includes(permitDoing)
                              ) {
                                editTaskDetails(task.taskID)
                              } else if (
                                task.taskState === "Done" &&
                                currentUserGroups.includes(permitDone)
                              ) {
                                editTaskDetails(task.taskID)
                              } else {
                                message.error(
                                  "You do not have the permissions required to edit task at this state"
                                )
                              }
                            } else {
                              message.error(
                                "Task is closed and cannot be edited further"
                              )
                            }
                          }}
                        >
                          <EditOutlined style={{ color: "black" }} />
                        </Typography.Link>
                      </Tooltip>
                    </Col>
                    <Col flex={1}>
                      <CaretRightOutlined
                        style={{ fontSize: 20 }}
                        onClick={() => {
                          if (
                            task.taskState === "Open" &&
                            currentUserGroups.includes(permitOpen)
                          ) {
                            promoteTask(task.taskID, task.taskState)
                          } else if (
                            task.taskState === "ToDo" &&
                            currentUserGroups.includes(permitToDo)
                          ) {
                            promoteTask(task.taskID, task.taskState)
                          } else if (
                            task.taskState === "Doing" &&
                            currentUserGroups.includes(permitDoing)
                          ) {
                            promoteTask(task.taskID, task.taskState)
                          } else if (
                            task.taskState === "Done" &&
                            currentUserGroups.includes(permitDone)
                          ) {
                            promoteTask(task.taskID, task.taskState)
                          } else if (task.taskState === "Closed") {
                            message.error(
                              "Task at this state cannot be promoted"
                            )
                          } else {
                            message.error(
                              "You do not have the permissions required to promote task at this state"
                            )
                          }
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </div>
        </>
      )
    }
  }

  const ColumnHeader = state => {
    return (
      <>
        <div
          style={{
            //backgroundColor: "rgb(8, 44, 78)",
            backgroundColor: "#797D81",
            width: 182,
            textAlign: "center",
            color: "white",
            borderStyle: "solid",
            padding: 4
          }}
        >
          <Title level={5} style={{ color: "white", fontSize: 15 }}>
            {state}
          </Title>
        </div>
      </>
    )
  }

  return (
    <>
      <Divider orientation="center">
        <BookOutlined /> Tasks
      </Divider>
      <Col span={4.8}>
        {ColumnHeader("Open")}
        {applicationTasks
          .filter(task => task.taskState === "Open")
          .map(filteredTask => KanbanCard(filteredTask))}
      </Col>
      <Col span={4.8}>
        {ColumnHeader("To Do")}
        {applicationTasks
          .filter(task => task.taskState === "ToDo")
          .map(filteredTask => KanbanCard(filteredTask))}
      </Col>
      <Col span={4.8}>
        {ColumnHeader("Doing")}
        {applicationTasks
          .filter(task => task.taskState === "Doing")
          .map(filteredTask => KanbanCard(filteredTask))}
      </Col>
      <Col span={4.8}>
        {ColumnHeader("Done")}
        {applicationTasks
          .filter(task => task.taskState === "Done")
          .map(filteredTask => KanbanCard(filteredTask))}
      </Col>
      <Col span={4.8}>
        {ColumnHeader("Closed")}
        {applicationTasks
          .filter(task => task.taskState === "Closed")
          .map(filteredTask => KanbanCard(filteredTask))}
      </Col>

      <Modal
        open={viewTaskOpen}
        onCancel={handleViewTaskCancel}
        footer={null}
        width={1000}
      >
        <Descriptions title={`Task ID: ${modalViewObject.taskID}`} bordered>
          <Descriptions.Item label="Task Name">
            {modalViewObject.taskName}
          </Descriptions.Item>
          <Descriptions.Item label="Plan Name">
            {modalViewObject.taskPlanName}
          </Descriptions.Item>
          <Descriptions.Item label="Application Name">
            {modalViewObject.taskAppAcronym}
          </Descriptions.Item>
          <Descriptions.Item label="Task Creator">
            {modalViewObject.taskCreator}
          </Descriptions.Item>
          <Descriptions.Item label="Task Owner">
            {modalViewObject.taskOwner}
          </Descriptions.Item>
          <Descriptions.Item label="Task Create Date">
            {moment(modalViewObject.taskCreateDate).format("YYYY-MM-DD")}
          </Descriptions.Item>
          <Descriptions.Item label="Task State" span={3}>
            {modalViewObject.taskState}
          </Descriptions.Item>
          <Descriptions.Item label="Task Description" span={3}>
            {modalViewObject.taskDescription}
          </Descriptions.Item>
          <Descriptions.Item label="Task Notes / Audit Log" span={3}>
            <ProFormTextArea
              width="lg"
              value={modalViewObject.taskNotes}
              disabled
            />
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <Modal
        title="Edit Task"
        open={editTaskOpen}
        onOk={editTaskForm.submit}
        onCancel={handleEditTaskCancel}
        width={1000}
      >
        <Form
          form={editTaskForm}
          autoFocusFirstInput
          onFinish={onFinish}
          layout="vertical"
        >
          <ProFormGroup>
            <Form.Item width={200} name="taskID" label="* Task ID">
              <Input disabled />
            </Form.Item>
            <Form.Item width={200} name="taskName" label="* Task Name">
              <Input placeholder="Task name" />
            </Form.Item>
            <ProFormSelect
              width={200}
              label="Plan Name"
              name="taskPlanName"
              options={applicationPlans.map(plan => {
                return {
                  value: `${plan.planName}`,
                  label: `${plan.planName}`
                }
              })}
              disabled={
                editTaskForm.getFieldValue("taskState") === "ToDo" ||
                editTaskForm.getFieldValue("taskState") === "Doing"
                  ? true
                  : false
              }
            />
            <ProFormSelect
              width={200}
              label="* Application Name"
              name="taskAppAcronym"
              options={applicationNames.map(app => {
                return { value: `${app}`, label: `${app}` }
              })}
              disabled={true}
            />
          </ProFormGroup>
          <ProFormGroup>
            <ProFormTextArea
              width={420}
              name="taskDescription"
              label="Description"
              placeholder="Brief description of task"
            />

            <ProFormTextArea
              width={420}
              name="newNotes"
              label="Notes"
              placeholder="Add notes to task"
            />
          </ProFormGroup>

          <ProFormTextArea
            width={880}
            name="taskNotes"
            label="Audit Log"
            disabled
          />

          <ProForm.Group>
            <Form.Item width={200} name="taskState" label="* Task State">
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              width={200}
              name="taskCreateDate"
              label="* Task Create Date"
            >
              <DatePicker defaultValue={moment()} disabled />
            </Form.Item>

            <Form.Item width={200} name="taskCreator" label="* Task Creator">
              <Input disabled={true} />
            </Form.Item>

            <Form.Item width={200} name="taskOwner" label="* Task Owner">
              <Input disabled={true} />
            </Form.Item>
          </ProForm.Group>
        </Form>
      </Modal>
    </>
  )
}

export default KanbanBoardComponent
