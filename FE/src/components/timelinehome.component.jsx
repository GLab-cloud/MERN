import React from 'react'
import { Timeline } from 'antd'
const TimelineHome = () => {
  return (
    <Timeline onChange={onChange}>
      <Timeline.Item>System Design</Timeline.Item>
      <Timeline.Item>Create Glab-cloud App 2025-09-01</Timeline.Item>
      <Timeline.Item>Technical testing 2025-12-01 </Timeline.Item>
    </Timeline>
  )
  function onChange() {}
}
export default TimelineHome
