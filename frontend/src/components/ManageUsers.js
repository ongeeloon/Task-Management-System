import "../index.css"
import React, { useState, useEffect } from "react"
import Axios from "axios"
import {
  Layout,
  Divider,
  Form,
  Input,
  Button,
  Table,
  message,
  InputNumber,
  Popover,
  Switch
} from "antd"
import {
  PlusCircleOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  TeamOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons"
const { Content } = Layout

const ManageUsers = () => {
  const [dataSource, setDataSource] = useState([])
  localStorage.setItem("page", "manageusers")

  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: "16px 0",
        minHeight: 280
      }}
    >
      <CreateNewUserComponent setDataSource={setDataSource} />
      <ViewEditAllUsersComponent
        dataSource={dataSource}
        setDataSource={setDataSource}
      />
    </Content>
  )
}

export default ManageUsers

const CreateNewUserComponent = ({ setDataSource }) => {
  let username
  let password
  let email
  let statusActive

  const onFinish = values => {
    console.log(values)
    username = values.username
    password = values.password
    email = values.email
    statusActive = true
    handleCreateNewUser()
  }

  const [newUserForm] = Form.useForm()

  async function handleCreateNewUser() {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/users/create",
        {
          username,
          password,
          email,
          statusActive
        },
        { withCredentials: true }
      )
      console.log(res)
      let successMessage = res.data.message
      message.success(successMessage)
      //clear form when successful
      newUserForm.resetFields()
      addNewUserRow(username, password, email, statusActive)
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

  const addNewUserRow = (username, password, email, statusActive) => {
    const newUser = {
      username: username,
      password: password,
      email: email,
      statusActive: statusActive
    }
    setDataSource(pre => {
      return [...pre, newUser]
    })
  }

  return (
    <>
      <Divider orientation="center">
        <PlusCircleOutlined /> Create New User
      </Divider>

      {/* New User Form */}

      <Form form={newUserForm} layout="inline" onFinish={onFinish}>
        <Popover
          content="alphanumeric characters only | max 15 characters | no whitespace"
          title="Requirements"
          trigger="hover"
        >
          <QuestionCircleOutlined />
        </Popover>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Username is required",
              validateTrigger: onFinish
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Popover
          content="8-10 characters | one letter | one number | one special character !@#$%^&* | no whitespace"
          title="Requirements"
          trigger="hover"
        >
          <QuestionCircleOutlined />
        </Popover>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Password is required",
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
        <Popover
          content="Valid email format"
          title="Requirements"
          trigger="hover"
        >
          <QuestionCircleOutlined />
        </Popover>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Email address is required",
              validateTrigger: onFinish
            }
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="johndoe@gmail.com"
          />
        </Form.Item>
        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Create New User
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

const ViewEditAllUsersComponent = ({ dataSource, setDataSource }) => {
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  //get userdata from db
  useEffect(() => {
    async function getAllUsers() {
      try {
        let res = await Axios.get("http://127.0.0.1:8080/api/users/", {
          withCredentials: true
        })
        console.log(res)
        console.log(res.data.users)
        let dbUsers = res.data.users
        let initialUsers = []
        dbUsers.map(user =>
          initialUsers.push({
            username: user.username,
            password: "",
            email: user.email,
            statusActive: user.statusActive === 1 ? true : false
          })
        )
        console.log(initialUsers)
        setDataSource(initialUsers)
      } catch (error) {
        console.log(error)
      }
    }
    getAllUsers()
  }, [])

  const [form] = Form.useForm()
  const [editingRow, setEditingRow] = useState("")
  const isEditing = record => record.username === editingRow
  console.log(`ViewEditAllUsersComponent Loaded: {editingRow}`)

  const edit = record => {
    form.setFieldsValue({
      username: "",
      password: "",
      email: "",
      ...record
    })
    setEditingRow(record.username)
  }

  //Cancel
  const cancel = () => {
    setEditingRow("")
  }

  const toggleActiveStatus = record => {
    console.log(`Toggled active status for ${record}`)

    const newData = [...dataSource]
    const index = newData.findIndex(item => record.username === item.username)
    if (index > -1) {
      const item = newData[index]
      item.statusActive = !item.statusActive
      newData.splice(index, 1, {
        ...item
      })
      setDataSource(newData)
    }
  }

  const save = async key => {
    console.log("saving...")
    try {
      const row = await form.validateFields()
      if (row.password.length === 0) {
        delete row.password
      }
      console.log(row)
      const newData = [...dataSource]
      const index = newData.findIndex(item => key === item.username)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        const selectedUser = newData[index]
        let updatedUser = {}
        if (selectedUser.password.length === 0) {
          updatedUser = {
            username: selectedUser.username,
            email: selectedUser.email,
            statusActive: selectedUser.statusActive
          }
        } else {
          updatedUser = {
            username: selectedUser.username,
            password: selectedUser.password,
            email: selectedUser.email,
            statusActive: selectedUser.statusActive
          }
        }
        //updated item to pass to backend
        let res = await Axios.post(
          "http://127.0.0.1:8080/api/users/adminUpdateAll",
          {
            ...updatedUser
          },
          { withCredentials: true }
        )
        console.log(res)
        setDataSource(newData)
        setEditingRow("")
      } else {
        newData.push(row)
        setDataSource(newData)
        setEditingRow("")
      }
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

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      editable: false
    },
    {
      title: "Password",
      dataIndex: "password",
      render: (text, record) => {
        if (editingRow === record.username) {
          return (
            <Form.Item name="password">
              <Input.Password type="password" />
            </Form.Item>
          )
        } else {
          return <p>{"********"}</p>
        }
      },
      editable: true
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => {
        if (editingRow === record.username) {
          return (
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input email"
                }
              ]}
              initialValue={text}
            >
              <Input />
            </Form.Item>
          )
        } else {
          return <p>{text}</p>
        }
      },
      editable: true
    },
    {
      title: "Active Status",
      dataIndex: "statusActive",
      render: (text, record) => {
        if (editingRow === record.username) {
          return (
            <Switch
              checked={record.statusActive}
              onChange={() => toggleActiveStatus(record)}
            />
          )
        } else {
          return <Switch checked={record.statusActive} disabled={true} />
        }
      },
      editable: true
    },
    {
      title: "Actions",
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <>
            <Button type="link" onClick={() => save(record.username)}>
              {" "}
              <SaveOutlined />{" "}
            </Button>
            <Button type="link" onClick={() => cancel()}>
              {" "}
              <CloseOutlined />{" "}
            </Button>
          </>
        ) : (
          <Button type="link" onClick={() => edit(record)}>
            <EditOutlined />
          </Button>
        )
      }
    }
  ]

  const onFinish = values => {
    const updatedDataSource = [...dataSource]
    updatedDataSource.splice(editingRow, 1, {
      ...values,
      statusActive: true,
      groups: ["editedgroup", "testedit"]
    })
    setDataSource(updatedDataSource)
    setEditingRow(0)
  }

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  return (
    <>
      <Divider orientation="center">
        <TeamOutlined /> All Users
      </Divider>

      <Form form={form} component={false} onFinish={onFinish}>
        <Table columns={mergedColumns} dataSource={dataSource}>
          components=
          {{
            body: {
              cell: EditableCell
            }
          }}
          rowClassName="editable-row"
        </Table>
      </Form>
    </>
  )
}
