import "../index.css"
import React, { useEffect, useState } from "react"
import Axios from "axios"
import {
  Layout,
  Button,
  Col,
  Divider,
  Row,
  Form,
  Input,
  Popover,
  message
} from "antd"
import { EditOutlined, QuestionCircleOutlined } from "@ant-design/icons"

const { Content } = Layout

const Profile = () => {
  const [username, setUsername] = useState(0)
  const [password, setPassword] = useState(0)
  const [email, setEmail] = useState(0)
  const [statusActive, setStatusActive] = useState(0)
  localStorage.setItem("page", "profile")

  useEffect(() => {
    async function getCurrentUser() {
      try {
        let res = await Axios.get(
          "http://127.0.0.1:8080/api/views/currentUser",
          {
            withCredentials: true
          }
        )

        console.log(res.data.currentUser)
        let userObject = res.data.currentUser

        setUsername(userObject.username)
        setPassword(userObject.password)
        setEmail(userObject.email)
        setStatusActive(userObject.statusActive)
      } catch (error) {
        console.log(error)
      }
    }
    getCurrentUser()
  }, [])

  console.log(username, password, email, statusActive)

  return (
    <>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: "16px 0",
          minHeight: 280
        }}
      >
        <MyProfileComponent
          username={username}
          password={password}
          email={email}
          statusActive={statusActive}
        />
        <Row>
          <Col className="gutter-row" span={12}>
            <ChangePasswordComponent setPassword={setPassword} />
          </Col>
          <Col className="gutter-row" span={12}>
            <ChangeEmailComponent setEmail={setEmail} />
          </Col>
        </Row>
      </Content>
    </>
  )
}

export default Profile

const MyProfileComponent = ({ username, password, email, statusActive }) => {
  return (
    <>
      <Divider orientation="center">My Profile</Divider>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={12}>
          <h1>Username</h1>
        </Col>
        <Col className="gutter-row" span={12}>
          <p>{username}</p>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={12}>
          <h1>Password</h1>
        </Col>
        <Col className="gutter-row" span={12}>
          {/* <p>{password}</p> */}
          <p>{"********"}</p>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={12}>
          <h1>Email Address</h1>
        </Col>
        <Col className="gutter-row" span={12}>
          <p>{email}</p>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={12}>
          <h1>Status</h1>
        </Col>
        <Col className="gutter-row" span={12}>
          <p>{statusActive ? "Active" : "Inactive"}</p>
        </Col>
      </Row>
    </>
  )
}

const ChangePasswordComponent = ({ setPassword }) => {
  let password

  const onFinish = values => {
    password = values.password
    handleChangePassword()
  }

  const [changePasswordForm] = Form.useForm()

  async function handleChangePassword() {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/users/updatePassword",
        { password },
        { withCredentials: true }
      )
      console.log(res)
      let successMessage = res.data.message
      message.success(successMessage)
      //clear form when successful
      changePasswordForm.resetFields()
      //update password on display
      let newHashedPassword = res.data.updatedPassword
      setPassword(newHashedPassword)
    } catch (error) {
      console.log(error)
      //Error message for validation errors
      if (error.response.data.validationErrors) {
        let validationErrorArray = error.response.data.validationErrors
        let allValidationErrMsg = []
        validationErrorArray.map(error => allValidationErrMsg.push(error.msg))
        message.error(allValidationErrMsg)
        allValidationErrMsg = []
      }
      //Error message for error handler
      if (error.response.data.message) {
        let errMessage = error.response.data.message
        message.error(errMessage)
      }
    }
  }

  return (
    <>
      <Divider orientation="center">
        <EditOutlined />
        Change Password
      </Divider>

      {/* change password form */}
      <Form form={changePasswordForm} layout="vertical" onFinish={onFinish}>
        <Form.Item>
          <Popover
            content="8-10 characters | one letter | one number | one special character !@#$%^&* | no whitespace"
            title="Requirements"
            trigger="hover"
          >
            <QuestionCircleOutlined />
          </Popover>
        </Form.Item>
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
              validateTrigger: onFinish
            }
          ]}
        >
          <Input.Password placeholder="password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

const ChangeEmailComponent = ({ setEmail }) => {
  let email

  const onFinish = values => {
    email = values.email
    handleChangeEmail()
  }

  const [changeEmailForm] = Form.useForm()

  async function handleChangeEmail() {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/users/updateEmail",
        { email },
        { withCredentials: true }
      )
      let successMessage = res.data.message
      message.success(successMessage)
      //clear form when successful
      changeEmailForm.resetFields()
      //update email on display
      let newEmail = res.data.updatedEmail
      setEmail(newEmail)
    } catch (error) {
      console.log(error)
      //Error message for validation errors
      if (error.response.data.validationErrors) {
        let validationErrorArray = error.response.data.validationErrors
        let allValidationErrMsg = []
        validationErrorArray.map(error => allValidationErrMsg.push(error.msg))
        message.error(allValidationErrMsg)
        allValidationErrMsg = []
      }
      //Error message for error handler
      if (error.response.data.message) {
        let errMessage = error.response.data.message
        message.error(errMessage)
      }
    }
  }

  return (
    <>
      <Divider orientation="center">
        <EditOutlined />
        Change Email Address
      </Divider>

      {/* change email address form */}
      <Form form={changeEmailForm} layout="vertical" onFinish={onFinish}>
        <Form.Item>
          <Popover
            content="Valid email address"
            title="Requirements"
            trigger="hover"
          >
            <QuestionCircleOutlined />
          </Popover>
        </Form.Item>
        <Form.Item
          label="New Email Address"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
              validateTrigger: handleChangeEmail
            }
          ]}
        >
          <Input placeholder="johndoe@gmail.com" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
