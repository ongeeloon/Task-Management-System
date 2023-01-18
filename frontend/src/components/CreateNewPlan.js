import React, { useState } from "react"
import Axios from "axios"

import { Form, Input, Button, message, Modal, DatePicker } from "antd"
import { PlusOutlined } from "@ant-design/icons"

import { ProFormSelect } from "@ant-design/pro-components"
import moment from "moment"
import { CirclePicker } from "react-color"

const CreateNewPlanComponent = ({
  applicationNames,
  selectedApp,
  setApplicationPlans,
  isProjectManager
}) => {
  //Plan fields
  let planName
  let planStartDate
  let planEndDate
  let planAppAcronym
  let planColour

  //Handle modal
  const [open, setOpen] = useState(false)

  const showModal = () => {
    setOpen(true)
    //set the plan form to have currently selected app
    createNewPlanForm.setFieldsValue({
      planAppAcronym: selectedApp
    })
  }

  const onFinish = values => {
    //map values to variables
    planName = values.planName
    console.log("onfinish plan name value:" + planName)
    if (values.planStartDate !== undefined && values.planStartDate !== null) {
      planStartDate = moment(values.planStartDate).format("YYYY-MM-DD")
    } else {
      planStartDate = null
    }
    if (values.planEndDate !== undefined && values.planEndDate !== null) {
      planEndDate = moment(values.planEndDate).format("YYYY-MM-DD")
    } else {
      planEndDate = null
    }
    planAppAcronym = values.planAppAcronym
    if (values.planColour !== undefined && values.planColour !== null) {
      planColour = values.planColour.hex
    } else {
      planColour = null
    }

    handleCreateNewPlan()
  }

  const handleCancel = () => {
    console.log("Clicked cancel button")
    createNewPlanForm.resetFields()
    setOpen(false)
  }

  //Handle form submit
  async function handleCreateNewPlan() {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/plan/create",
        {
          planName,
          planStartDate,
          planEndDate,
          planAppAcronym,
          planColour
        },
        { withCredentials: true }
      )
      console.log(res)

      //display success message
      let successMessage = res.data.message
      message.success(successMessage)

      //clear form when successful
      createNewPlanForm.resetFields()
      createNewPlanForm.setFieldsValue({
        planAppAcronym: selectedApp
      })

      //Close modal when successful
      //setOpen(false)

      //Add plan to view plan component
      addNewPlanToView()
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

  const addNewPlanToView = () => {
    const newPlan = {
      planName,
      planStartDate,
      planEndDate,
      planAppAcronym,
      planColour
    }
    setApplicationPlans(pre => {
      return [...pre, newPlan]
    })
  }

  const [createNewPlanForm] = Form.useForm()

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {selectedApp && isProjectManager ? (
          <>
            <Button type="primary" shape="round" onClick={() => showModal()}>
              <PlusOutlined />
              New Plan
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
              New Plan
            </Button>
          </>
        )}
      </div>

      <Modal
        title="Create New Plan"
        open={open}
        onOk={createNewPlanForm.submit}
        onCancel={handleCancel}
      >
        <Form form={createNewPlanForm} autoFocusFirstInput onFinish={onFinish}>
          <Form.Item width="md" name="planName" label="* Name">
            <Input placeholder="Plan name" />
          </Form.Item>
          <Form.Item width="md" name="planStartDate" label="* Start Date">
            <DatePicker />
          </Form.Item>
          <Form.Item width="md" name="planEndDate" label="* End Date">
            <DatePicker />
          </Form.Item>
          <Form.Item width="md" name="planColour" label="* Plan Colour">
            <CirclePicker />
          </Form.Item>
          <Form.Item>
            <ProFormSelect
              width="md"
              label="* Application Name"
              name="planAppAcronym"
              options={applicationNames.map(app => {
                return { value: `${app}`, label: `${app}` }
              })}
              disabled={true}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CreateNewPlanComponent
