import React from "react"

import { Badge, List } from "antd"

import moment from "moment"

const ViewPlansComponent = ({ applicationPlans }) => {
  return (
    <>
      <List
        size="small"
        dataSource={applicationPlans}
        renderItem={item => (
          <List.Item style={{ color: item.planColour }}>
            <Badge.Ribbon
              color={item.planColour}
              text={
                moment(item.planStartDate).format("DD MMM YYYY") +
                " - " +
                moment(item.planEndDate).format("DD MMM YYYY")
              }
            ></Badge.Ribbon>
            {item.planName}
          </List.Item>
        )}
      ></List>
    </>
  )
}

export default ViewPlansComponent
