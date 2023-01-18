import React, { useEffect, useState } from "react"
import Axios from "axios"

import {
  Layout,
  Divider,
  Form,
  Input,
  Tag,
  Button,
  Row,
  Col,
  message,
  Table,
  Typography,
  Select,
  Popover
} from "antd"
import {
  GroupOutlined,
  PlusCircleOutlined,
 
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserSwitchOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons"
const { Content } = Layout


const ManageGroups = () => {
  const [groupArray, setGroupArray] = useState([])

  localStorage.setItem("page", "managegroups")
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: "16px 0",
        minHeight: 280
      }}
    >
      <Row>
        <Col span={8}>
          <CreateGroupComponent setGroupArray={setGroupArray} />
        </Col>
        <Col span={14} offset={2}>
          <ViewAllGroupsComponent
            groupArray={groupArray}
            setGroupArray={setGroupArray}
          />
        </Col>
      </Row>
     
      <Row>
        <EditUserGroupComponent groupArray={groupArray} />
      </Row>
    </Content>
  )
}

export default ManageGroups

const CreateGroupComponent = ({ setGroupArray }) => {
  let groupname

  const onFinish = values => {
    console.log(values)
    groupname = values.groupname
    console.log(groupname)
    handleCreateNewGroup()
  }
  const [newGroupForm] = Form.useForm()

  async function handleCreateNewGroup() {
    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/group/create",
        { groupname },
        { withCredentials: true }
      )
      console.log(res)
      let successMessage = res.data.message
      message.success(successMessage)
      //clear form when successful
      newGroupForm.resetFields()
      //add new group to grouparray for display
      setGroupArray(pre => {
        return [...pre, groupname]
      })
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
        <PlusCircleOutlined /> Create New Group
      </Divider>
      <Popover
        content="Only letters, numbers, underscores | no whitespace | max 20 characters | not case sensitive"
        title="Requirements"
        trigger="hover"
      >
        <QuestionCircleOutlined />
      </Popover>
      <Form form={newGroupForm} onFinish={onFinish}>
        <Form.Item
          label="New Group"
          name="groupname"
          rules={[
            {
              required: true,
              message: "Please input Groupname!",
              validateTrigger: onFinish
            }
          ]}
        >
          <Input placeholder="groupname" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Group
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

const ViewAllGroupsComponent = ({ groupArray, setGroupArray }) => {
  useEffect(() => {
    async function getAllGroups() {
      try {
        let res = await Axios.get("http://127.0.0.1:8080/api/group/", {
          withCredentials: true
        })
        console.log(res)
        console.log(res.data.groups)
        let dbGroups = res.data.groups
        let initialGroups = []
        dbGroups.map(group => initialGroups.push(group.groupname))

        setGroupArray(initialGroups)
      } catch (error) {
        console.log(error)
      }
    }
    getAllGroups()
  }, [])

  console.log(groupArray)

  let colours = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple"
  ] //11 colors. index 0 to 10
  const colorlength = colours.length

  return (
    <>
      <Divider orientation="center">
        <GroupOutlined /> All Groups
      </Divider>

      {groupArray.map(function (groupname, i) {
        return (
          <Tag key={groupname} color={colours[i % colorlength]}>
            {groupname}
          </Tag>
        )
      })}
    </>
  )
}

const EditUserGroupComponent = ({ groupArray }) => {
  const [usergroups, setUsergroups] = useState(0)

  //set data from database
  useEffect(() => {
    async function getAllUsersAndGroups() {
      try {
        let res = await Axios.get(
          "http://127.0.0.1:8080/api/userGroup/getAllUsersAndGroups",
          {
            withCredentials: true
          }
        )
        // console.log(res)
        // console.log(res.data.usergroupJSON.usergroups)
        let dbUsergroups = res.data.usergroupJSON.usergroups
        setUsergroups(dbUsergroups)
      } catch (error) {
        console.log(error)
      }
    }
    getAllUsersAndGroups()
  }, [])

  // editable table stuff

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
    const inputNode =
      inputType === "select" ? (
        <Select
          mode="multiple"
          placeholder="User has no groups"
          value={selectedItems}
          onChange={setSelectedItems}
          style={{
            width: "100%"
          }}
        >
          {filteredOptions.map(item => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      ) : (
        <Input />
      )
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0
            }}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  const [usergroupForm] = Form.useForm()
  const [editingRow, setEditingRow] = useState("")
  const isEditing = record => record.username === editingRow

  // select groups stuff
  let allGroupOptions = groupArray
  const [selectedItems, setSelectedItems] = useState([])
  const filteredOptions = allGroupOptions.filter(
    o => !selectedItems.includes(o)
  )

  //Edit
  const edit = record => {
    usergroupForm.setFieldsValue({
      username: "",
      groupnames: "",
      ...record
    })
    setEditingRow(record.username)
    setSelectedItems(record.groupnames)
  }

  //Cancel
  const cancel = () => {
    setEditingRow("")
  }

  //Save
  const save = async key => {
    try {
      const row = await usergroupForm.validateFields()
      const newData = [...usergroups]
      const index = newData.findIndex(item => key === item.username)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        setUsergroups(newData)
        setEditingRow("")
      } else {
        newData.push(row)
        setUsergroups(newData)
        setEditingRow("")
      }
      handleEditUserGroupFormSubmit(key)
      // ===============================================================================================
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo)
    }
  }

  async function handleEditUserGroupFormSubmit(key) {
    const username = key
    const groupnames = selectedItems

    try {
      let res = await Axios.post(
        "http://127.0.0.1:8080/api/userGroup/edit",
        {
          username,
          groupnames
        },
        { withCredentials: true }
      )
      console.log(res)
      let successMessage = res.data.message
      message.success(successMessage)
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

  //Columns (Original)
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      width: "25%",
      editable: false
    },
    {
      title: "Groups",
      dataIndex: "groupnames",
      render: (_, { groupnames }) => (
        <>
          {groupnames.map(group => {
            let color
            let firstLetter = group.charAt(0)
            if (firstLetter.match(/[A-Ea-e]/)) {
              color = "magenta"
            } else if (firstLetter.match(/[F-Jf-j]/)) {
              color = "orange"
            } else if (firstLetter.match(/[K-Ok-o]/)) {
              color = "green"
            } else if (firstLetter.match(/[P-Tp-t]/)) {
              color = "cyan"
            } else if (firstLetter.match(/[U-Zu-z]/)) {
              color = "geekblue"
            } else {
              color = "purple"
            }
            return (
              <Tag color={color} key={group}>
                {group}
              </Tag>
            )
          })}
        </>
      ),
      width: "50%",
      editable: true
    },
    {
      title: "Actions",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.username)}
              style={{
                marginRight: 8
              }}
            >
              {" "}
              <SaveOutlined />{" "}
            </Typography.Link>
            <Typography.Link onClick={() => cancel()}>
              {" "}
              <CloseOutlined />{" "}
            </Typography.Link>
          </span>
        ) : (
          <Typography.Link
            disabled={editingRow !== ""}
            onClick={() => edit(record)}
          >
            <EditOutlined />
          </Typography.Link>
        )
      }
    }
  ]

  //Merged Columns
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === "groupnames" ? "select" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  return (
    <>
      <Divider orientation="center">
        <UserSwitchOutlined /> Edit User Groups
      </Divider>
      <Form form={usergroupForm} component={false}>
        <Table
          tableLayout="fixed"
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={usergroups}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel
          }}
        />
      </Form>
    </>
  )
}
