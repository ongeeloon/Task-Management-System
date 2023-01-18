import React, { useState } from "react"
import Axios from "axios"
import moment from "moment"

import {
  Divider,
  Form,
  Input,
  Button,
  message,
  InputNumber,
  DatePicker,
  Modal
} from "antd"

import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons"

import {
  ProForm,
  ProFormSelect,
  ProFormTextArea
} from "@ant-design/pro-components"

const CreateNewApplicationComponent = ({
  setAppDataSource,
  groupnames,
  isProjectLead
}) => {
  let appName
  let appDescription
  let appRNumber
  let appStartDate
  let appEndDate
  let appPermitCreate
  let appPermitOpen
  let appPermitToDo
  let appPermitDoing
  let appPermitDone

  //Handle modal
  const [open, setOpen] = useState(false)

  const showModal = () => {
    setOpen(true)
  }
  const onFinish = values => {
    appName = values.appName
    appDescription = values.appDescription
    appRNumber = values.appRNumber
    if (values.appStartDate !== undefined && values.appStartDate !== null) {
      appStartDate = moment(values.appStartDate).format("YYYY-MM-DD")
    } else {
      appStartDate = null
    }
    if (values.appEndDate !== undefined && values.appEndDate !== null) {
      appEndDate = moment(values.appEndDate).format("YYYY-MM-DD")
    } else {
      appEndDate = null
    }
    appPermitCreate = values.appPermitCreate
    appPermitOpen = values.appPermitOpen
    appPermitToDo = values.appPermitToDo
    appPermitDoing = values.appPermitDoing
    appPermitDone = values.appPermitDone

    console.log(values)
    console.log(appStartDate)
    console.log(appEndDate)

    handleCreateNewApplication()
  }

  const handleCancel = () => {
    newApplicationForm.resetFields()
    setOpen(false)
  }

  const [newApplicationForm] = Form.useForm()

  async function handleCreateNewApplication() {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/application/create",
        {
          appName,
          appDescription,
          appRNumber,
          appStartDate,
          appEndDate,
          appPermitCreate,
          appPermitOpen,
          appPermitToDo,
          appPermitDoing,
          appPermitDone
        },
        { withCredentials: true }
        //check group, make sure group allowed --add in backend================================================================================================
      )
      console.log(res)
      //receive application object just created
      const newAppCreated = res.data.newappcreated

      //display success message
      let successMessage = res.data.message
      message.success(successMessage)

      //clear form when successful
      newApplicationForm.resetFields()

      //close modal when successful
      //setOpen(false)

      //add new application to list below
      addNewApplicationRow(newAppCreated)
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

  const addNewApplicationRow = app => {
    const newApplication = {
      appName: app.app_acronym,
      appDescription: app.app_description,
      appRNumber: app.app_Rnumber,
      appStartDate: moment(app.app_startdate),
      appEndDate: moment(app.app_enddate),
      appPermitCreate: app.app_permitcreate,
      appPermitOpen: app.app_permitopen,
      appPermitToDo: app.app_permittodo,
      appPermitDoing: app.app_permitdoing,
      appPermitDone: app.app_permitdone
    }
    setAppDataSource(pre => {
      return [...pre, newApplication]
    })
  }

  return (
    <>
      <Divider orientation="center">
        <PlusCircleOutlined /> Create New Application
      </Divider>

      {/* New Application Form */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {isProjectLead ? (
          <Button type="primary" shape="round" onClick={() => showModal()}>
            <PlusOutlined />
            New Application
          </Button>
        ) : (
          <Button
            type="primary"
            shape="round"
            onClick={() => showModal()}
            disabled
          >
            <PlusOutlined />
            New Application
          </Button>
        )}

        <Modal
          title="Create New Application"
          open={open}
          onOk={newApplicationForm.submit}
          onCancel={handleCancel}
          width={800}
        >
          <Form
            form={newApplicationForm}
            autofocusfirstinput
            onFinish={onFinish}
          >
            <ProForm.Group>
              <Form.Item width="xs" name="appName" label="* Name">
                <Input placeholder="App name" />
              </Form.Item>
              <Form.Item width="xs" name="appRNumber" label="* RNumber">
                <InputNumber
                  placeholder="Number"
                  min={1}
                  step={1}
                  precision={0}
                />
              </Form.Item>
            </ProForm.Group>
            <ProForm.Group>
              <Form.Item width="xs" name="appStartDate" label="* Start Date">
                <DatePicker />
              </Form.Item>
              <Form.Item width="xs" name="appEndDate" label="* End Date">
                <DatePicker />
              </Form.Item>
            </ProForm.Group>
            <ProFormTextArea
              width="md"
              name="appDescription"
              label="Description"
              placeholder="Input brief description of app"
            />
            <ProForm.Group>
              <ProFormSelect
                width="xs"
                label="* Create"
                name="appPermitCreate"
                options={groupnames.map(group => {
                  return { value: `${group}`, label: `${group}` }
                })}
              />
              <ProFormSelect
                width="xs"
                label="* Open"
                name="appPermitOpen"
                options={groupnames.map(group => {
                  return { value: `${group}`, label: `${group}` }
                })}
              />
              <ProFormSelect
                width="xs"
                label="* To Do"
                name="appPermitToDo"
                options={groupnames.map(group => {
                  return { value: `${group}`, label: `${group}` }
                })}
              />
              <ProFormSelect
                width="xs"
                label="* Doing"
                name="appPermitDoing"
                options={groupnames.map(group => {
                  return { value: `${group}`, label: `${group}` }
                })}
              />
              <ProFormSelect
                width="xs"
                label="* Done"
                name="appPermitDone"
                options={groupnames.map(group => {
                  return { value: `${group}`, label: `${group}` }
                })}
              />
            </ProForm.Group>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default CreateNewApplicationComponent
