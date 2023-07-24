import React, { useState } from "react";
import { InputNumber } from "..";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export const LaunchpadAllowance = ({ datas, setter }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChangeDate = (target, date) => {
    if (target === "saleStart") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setter(target, date.getTime());
  };

  return (
    <div className="flex flex-col">
      <div className="divider text-primary">Allowance</div>

      <div className="flex items-center ">
        <div className="flex flex-col">
          <label className="text-primary">Date sale start</label>
          <DatePicker
            className="border input input-xs bg-black/10 border-primary rounded"
            selected={startDate}
            onChange={(date) => handleChangeDate("saleStart", date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Date de début"
          />
        </div>
        <div className="flex flex-col mx-5">
          <label className="text-primary">Date sale end</label>
          <DatePicker
            className="border input input-xs bg-black/10 border-primary rounded"
            selected={endDate}
            onChange={(date) => handleChangeDate("saleEnd", date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Date de fin"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-primary">Locked time</label>
          {console.log("fffdsfzfszfezfzefezfezf", datas.lockedTime)}
          <InputNumber
            setter={setter}
            target={"lockedTime"}
            value={datas.lockedTime}
            title={"Day(s) locked"}
            style={"xs"}
          />
        </div>
      </div>
      <div className="flex mb-5">
        <div className="flex flex-col">
          <label className="text-primary">Minimum Invest</label>
          <InputNumber
            setter={setter}
            target={"minInvest"}
            value={datas.minInvest}
            title={"Min invest on ETH"}
            style={"xs"}
          />
        </div>
        <div className="flex ml-5 flex-col">
          <label className="text-primary">Maximum Invest</label>
          <InputNumber
            setter={setter}
            target={"maxInvest"}
            style={"xs"}
            value={datas.maxInvest}
            title={"Max invest on ETH"}
          />
        </div>
      </div>
    </div>
  );
};
