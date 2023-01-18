import React,{useContext} from "react"
import "../index.css"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Row } from "antd"
import Axios from "axios"
import Cookies from "universal-cookie"

//Import context
import DispatchContext from "../DispatchContext"

const cookies = new Cookies()

const LoginForm = () => {
  const appDispatch = useContext(DispatchContext)

  let username
  let password

  const onFinish = values => {
    username = values.username
    password = values.password
    handleFormSubmit()
  }

  async function handleFormSubmit() {
    try {
      let res = await Axios.post("http://127.0.0.1:8080/api/auth/login", {
        username,
        password
      })
      console.log(res.data.accessToken) //Access token that is passed back
      console.log(res)
      //display success message 
      let successMessage = res.data.message
      message.success(successMessage)

      //Create cookie and store accesstoken
      cookies.set("accessToken", res.data.accessToken)

      //Redirect to Dashboard
      redirectToDashboard()
    } catch (error) {
      if (error.response) {
        let errMessage = error.response.data.message
        message.error(errMessage)
      }
    }
  }

  async function redirectToDashboard() {
    try {
      let res = await Axios.get("http://127.0.0.1:8080/api/views/checkAdmin", {
        withCredentials: true
      })
      console.log(res)
      if (res.data.isAdmin) {
        console.log("User is admin, navigating to /admin")
        appDispatch({type: "isAdmin"})
      } else {
        console.log("User is not admin, navigating to /user")
        appDispatch({type: "isNotAdmin"})
      }
      appDispatch({type: "login"})
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row className="loginFormAlignment">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
              validateTrigger: onFinish
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
              validateTrigger: onFinish
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Row>
  )
}

export default LoginForm
