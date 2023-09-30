import { v4 as uuidv4 } from "uuid";
import { MyCard } from "components/myComponents/card/MyCard";
import React from "react";

export const LaunchpadHistory = () => {
  const test = [
    { user: "Django", amount: 2, date: "20/01/2023" },
    { user: "Django", amount: 1, date: "20/01/2023" },
    { user: "Django", amount: 3, date: "20/01/2023" },
    { user: "Django", amount: 0.1, date: "20/01/2023" },
    { user: "Django", amount: 1, date: "20/01/2023" },
    { user: "Django", amount: 2, date: "20/01/2023" },
    { user: "Django", amount: 0.1, date: "20/01/2023" },
    { user: "Django", amount: 2, date: "20/01/2023" },
    { user: "Django", amount: 0.1, date: "20/01/2023" },
    { user: "Django", amount: 3, date: "20/01/2023" },
    { user: "Django", amount: 0.1, date: "20/01/2023" },
  ];
  return (
    <MyCard styles={"mt-3 w-fit"}>
      <h6 className=" font-bold text-white">Historic</h6>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {test?.map((el, i) => (
              <tr key={uuidv4()}>
                <th className="text-[8px]">{i + 1}</th>
                <td className="text-white">{el?.user}</td>
                <td className="text-secondary text-center">{el?.amount}</td>
                <td className="text-[10px]">{el?.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MyCard>
  );
};
