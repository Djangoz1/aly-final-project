import React, { useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useMissionState } from "context/hub/mission";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
const localizer = momentLocalizer(moment);

export const MyCalendar = ({ events }) => {
  let { state } = useToolsState();
  const ref = useRef(null);

  return (
    <div ref={ref} className="text-xs  ">
      <Calendar
        className="w-full mx-3"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, width: 800 }}
      />
    </div>
  );
};
