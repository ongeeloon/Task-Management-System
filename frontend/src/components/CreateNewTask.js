import React, { useState } from "react"
import Axios from "axios"

import { Form, Input, Button, message, Modal, DatePicker } from "antd"
import { PlusOutlined } from "@ant-design/icons"

import {
  ProFormSelect,
  ProFormTextArea,
  ProForm,
  ProFormGroup
} from "@ant-design/pro-components"
import moment from "moment"

const CreateNewTaskComponent = ({
  currentUsername,
  applicationNames,
  selectedApp,
  applicationPlans,
  setApplicationTasks,
  currentUserGroups,
  permitCreate
}) => {
  //Task fields
  let taskID
  let taskName
  let taskDescription
  let taskNotes
  let taskPlanName
  let taskAppAcronym
  let taskState
  let taskCreator
  let taskOwner
  let taskCreateDate

  // Handle modal
  const [open, setOpen] = useState(false)

  const showModal = () => {
    setOpen(true)
    //set the task form to have currently selected app, task state active
    createNewTaskForm.setFieldsValue({
      taskAppAcronym: selectedApp,
      taskState: "Open", //task state default set to open
      taskCreator: currentUsername,
      taskOwner: currentUsername
    })
  }

  const onFinish = values => {
    //map values to variables
    taskName = values.taskName
    taskDescription = values.taskDescription
    taskNotes = values.taskNotes
    taskPlanName = values.taskPlanName
    taskAppAcronym = values.taskAppAcronym
    taskState = values.taskState
    taskCreator = values.taskCreator
    taskOwner = values.taskOwner
    taskCreateDate = moment(values.taskCreateDate).format("YYYY-MM-DD")

    handleCreateNewTask()
  }
  const handleCancel = () => {
    console.log("Clicked cancel button")
    createNewTaskForm.resetFields()
    setOpen(false)
  }

  //Handle form submit
  async function handleCreateNewTask() {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/task/create",
        {
          taskName,
          taskDescription,
          taskNotes,
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
      //receive task object just created
      const newTaskCreated = res.data.newtaskcreated

      //display success message
      let successMessage = res.data.message
      message.success(successMessage)

      //clear form when successful
      createNewTaskForm.resetFields()
      createNewTaskForm.setFieldsValue({
        taskAppAcronym: selectedApp,
        taskState: "Open", //task state default set to open
        taskCreator: currentUsername,
        taskOwner: currentUsername
      })

      //Close modal when successful
      //setOpen(false)

      //Add task to kanban view component
      addNewTaskToView(newTaskCreated)
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

  const addNewTaskToView = task => {
    const newTask = {
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
    }
    setApplicationTasks(pre => {
      return [...pre, newTask]
    })
  }
  const [createNewTaskForm] = Form.useForm()

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 10
        }}
      >
        {selectedApp && currentUserGroups.includes(permitCreate) ? (
          <>
            <Button type="primary" shape="round" onClick={() => showModal()}>
              <PlusOutlined />
              New Task
            </Button>
          </>
        ) : (
          <>
            <Button
              type="primary"
              shape="round"
              onClick={() => showModal()}
              disabled
            >
              <PlusOutlined />
              New Task
            </Button>
          </>
        )}
      </div>

      <Modal
        title="Create New Task"
        open={open}
        onOk={createNewTaskForm.submit}
        onCancel={handleCancel}
        width={900}
      >
        <Form
          form={createNewTaskForm}
          autoFocusFirstInput
          onFinish={onFinish}
          layout="vertical"
        >
          <ProForm.Group>
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
          </ProForm.Group>

          <ProFormTextArea
            width={800}
            name="taskDescription"
            label="Description"
            placeholder="Brief description of task"
          />

          <ProFormTextArea
            width={800}
            name="taskNotes"
            label="Notes"
            placeholder="Add notes to task"
          />

          <ProFormGroup>
            <Form.Item width={200} name="taskState" label="* Task State">
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              width="xs"
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
          </ProFormGroup>
        </Form>
      </Modal>
    </>
  )
}

export default CreateNewTaskComponent
