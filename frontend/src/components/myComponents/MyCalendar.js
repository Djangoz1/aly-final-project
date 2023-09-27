import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useMissionState } from "context/hub/mission";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);

export const MyCalendar = () => {
  let { features } = useMissionState();
  let [isEvents, setIsEvents] = useState(null);

  let start = new Date(parseInt(features[0]?.datas?.startedAt) * 1000);
  const end = new Date(start);
  end.setDate(start.getDate() + features[0]?.datas?.estimatedDays);

  useEffect(() => {
    let events = [];
    if (features) {
      for (let index = 0; index < features.length; index++) {
        const feature = features[index];
        let startedAt = parseInt(feature?.datas?.startedAt);
        console.log(startedAt);
        if (startedAt > 0) {
          let start = new Date(startedAt * 1000);
          let end = new Date(start);
          end.setDate(start.getDate() + feature.datas?.estimatedDays);
          events.push({
            start,
            end,
            title: feature?.metadatas?.title,
          });
        }
      }
    }
    setIsEvents(events);
  }, [features]);

  console.log("events", isEvents);
  return (
    <div className="text-xs ">
      {isEvents && (
        <Calendar
          localizer={localizer}
          events={isEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
        />
      )}
    </div>
  );
};
