import React, { useEffect, useState } from "react"
import Axios from "axios"
import moment from "moment"
import { Link } from "react-router-dom"
import logo from "../logo.png"

import {
  Divider,
  Form,
  Input,
  Button,
  message,
  InputNumber,
  DatePicker,
  Avatar,
  List,
  Modal,
  Space,
  Descriptions
} from "antd"

import {
  CodeOutlined,
  EditOutlined,
  EyeOutlined,
  ArrowRightOutlined
} from "@ant-design/icons"

import {
  ProForm,
  ProFormSelect,
  ProFormTextArea
} from "@ant-design/pro-components"

const ViewEditAllApplicationsComponent = ({
  appDataSource,
  setAppDataSource,
  groupnames,
  isProjectLead
}) => {
  //get data of applications from DB
  useEffect(() => {
    async function getAllApplications() {
      try {
        let res = await Axios.get("http://127.0.0.1:8080/api/application/", {
          withCredentials: true
        })
        console.log(res)
        console.log(res.data.applications)
        let dbApplications = res.data.applications
        let initialApplications = []
        dbApplications.map(app =>
          initialApplications.push({
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
          })
        )

        setAppDataSource(initialApplications)
      } catch (error) {
        console.log(error)
      }
    }
    getAllApplications()
  }, [])

  //Modal for viewing application details
  const [viewAppDetailsOpen, setViewAppDetailsOpen] = useState(false)
  const [modalViewObject, setModalViewObject] = useState([])

  const viewAppDetails = appName => {
    const index = appDataSource.findIndex(item => appName === item.appName)
    const selectedApp = appDataSource[index]
    setModalViewObject(selectedApp)
    if (modalViewObject) {
      setViewAppDetailsOpen(true)
    }
  }

  const handleViewAppCancel = () => {
    setModalViewObject([])
    setViewAppDetailsOpen(false)
  }

  // Modal for editing application
  const [open, setOpen] = useState(false)

  const showModal = appName => {
    setOpen(true)
    const index = appDataSource.findIndex(item => appName === item.appName)
    const selectedApp = appDataSource[index]
    editApplicationForm.setFieldsValue({
      appName: "",
      appDescription: "",
      appRNumber: "",
      appStartDate: "",
      appEndDate: "",
      appPermitCreate: "",
      appPermitOpen: "",
      appPermitToDo: "",
      appPermitDoing: "",
      appPermitDone: "",
      ...selectedApp
    })
  }

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

  const onFinish = values => {
    //map values to variables
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

    //call handleeditapplication method
    handleEditApplication()
  }
  const handleCancel = () => {
    console.log("Clicked cancel button")
    setOpen(false)
  }

  async function handleEditApplication() {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/application/edit",
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
        //check group, make sure group allowed --add in backend=============================================================================================
      )
      console.log(res)
      //setAppDataSource with edited data
      const newData = [...appDataSource]
      const row = await editApplicationForm.validateFields()
      const index = newData.findIndex(item => appName === item.appName)
      if (index > -1) {
        const editedApp = newData[index]
        newData.splice(index, 1, {
          ...editedApp,
          ...row
        })
      }
      setAppDataSource(newData)

      //display success message
      let successMessage = res.data.message
      message.success(successMessage)

      //close modal
      setOpen(false)
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

  //Form in modal for editing application details
  const [editApplicationForm] = Form.useForm()

  return (
    <>
      <Divider orientation="center">
        <CodeOutlined /> All Applications
      </Divider>

      <List
        itemLayout="horizontal"
        dataSource={appDataSource}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={logo} />}
              title={item.appName}
              description={
                item.appDescription !== undefined ? (
                  <span description={item.appDescription}>
                    {item.appDescription.length > 60
                      ? item.appDescription.substr(0, 60) + "..."
                      : item.appDescription}
                  </span>
                ) : (
                  <span description=""></span>
                )
              }
            />
            <Space>
              <Button
                type="primary"
                shape="round"
                onClick={() => viewAppDetails(item.appName)}
              >
                View <EyeOutlined />
              </Button>

              {isProjectLead ? (
                <Button
                  type="primary"
                  shape="round"
                  onClick={() => showModal(item.appName)}
                >
                  Edit <EditOutlined />
                </Button>
              ) : (
                <Button
                  type="primary"
                  shape="round"
                  onClick={() => showModal(item.appName)}
                  disabled
                >
                  Edit <EditOutlined />
                </Button>
              )}

              <Button>
                <Link
                  to="/user/tasks"
                  state={{ clickedApp: `${item.appName}` }}
                >
                  Go To Kanban <ArrowRightOutlined />
                </Link>
              </Button>
            </Space>

            {/* Modal to view application details */}
            <Modal
              open={viewAppDetailsOpen}
              onCancel={handleViewAppCancel}
              footer={null}
              width={800}
              mask={false}
            >
              <Descriptions
                title={`Application: ${modalViewObject.appName}`}
                bordered
              >
                <Descriptions.Item label="R Number">
                  {modalViewObject.appRNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {moment(modalViewObject.appStartDate).format("YYYY-MM-DD")}
                </Descriptions.Item>
                <Descriptions.Item label="End Date">
                  {moment(modalViewObject.appEndDate).format("YYYY-MM-DD")}
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={3}>
                  {modalViewObject.appDescription}
                </Descriptions.Item>
                <Descriptions.Item label="Permissions">
                  <p>
                    <span style={{ fontWeight: "bold" }}>Create: </span>
                    {modalViewObject.appPermitCreate}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Open: </span>
                    {modalViewObject.appPermitOpen}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>To Do: </span>
                    {modalViewObject.appPermitToDo}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Doing: </span>
                    {modalViewObject.appPermitDoing}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Done: </span>
                    {modalViewObject.appPermitDone}
                  </p>
                </Descriptions.Item>
              </Descriptions>
            </Modal>

            {/* Modal and Form to edit application */}
            <Modal
              title="Edit Application"
              open={open}
              onOk={editApplicationForm.submit}
              onCancel={handleCancel}
              width={800}
              mask={false}
            >
              <Form
                form={editApplicationForm}
                autoFocusFirstInput
                onFinish={onFinish}
              >
                <ProForm.Group>
                  <Form.Item width="xs" name="appName" label="* Name">
                    <Input placeholder="App name" disabled={true} />
                  </Form.Item>
                  <Form.Item width="xs" name="appRNumber" label="* RNumber">
                    <InputNumber
                      placeholder="Number"
                      min={1}
                      step={1}
                      precision={0}
                      disabled={true}
                    />
                  </Form.Item>
                </ProForm.Group>
                <ProForm.Group>
                  <Form.Item
                    width="xs"
                    name="appStartDate"
                    label="* Start Date"
                  >
                    <DatePicker />
                  </Form.Item>

                  <Form.Item width="xs" name="appEndDate" label="* End Date">
                    <DatePicker />
                  </Form.Item>
                </ProForm.Group>
                <ProFormTextArea
                  width="xl"
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
          </List.Item>
        )}
      />
    </>
  )
}

export default ViewEditAllApplicationsComponent
