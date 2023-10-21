import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MyTableEl } from "./MyTableEl";
import { _table_features } from "utils/states/tables/feature";
export const MyTable = ({ head, list, btns, editBtns }) => {
  let [isCountView, setIsViewCount] = useState(5);
  return (
    <>
      <div className="overflow-x-auto  overflow-y-visible w-full min-h-[20vh] font2">
        <table className="table">
          {/* head */}
          <thead className="bg-black/10 text-[10px]">
            <tr>
              <th></th>
              <th>
                <label>
                  <input type="checkbox" className="checkbox checkbox-xs" />
                </label>
              </th>
              {head?.map((el) => (
                <th key={uuidv4()}>{el}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          {list?.length > 0 && (
            <tbody className="w-full ">
              {list?.map(
                (el, index) =>
                  index < isCountView && (
                    <MyTableEl
                      index={index}
                      editBtns={editBtns}
                      key={uuidv4()}
                      id={el?.id}
                      arr={el?.arr}
                      btns={btns}
                    />
                  )
              )}
            </tbody>
          )}
          {/* foot */}
        </table>
        {list?.length === 0 && (
          <div className="w-full text-xs bg-black/30 text-white mx-auto h-[10vh] flex items-center justify-center  text-center">
            No elements found
          </div>
        )}
      </div>
      {list?.length > 5 && (
        <div className="flex justify-end mt-4">
          <button
            disabled={list?.length <= isCountView}
            onClick={() => setIsViewCount(isCountView + 5)}
            className="btn btn-outline btn-xs  rounded-full"
          >
            View more
          </button>
        </div>
      )}
    </>
  );
};
export const MyTable1 = ({ head, list, editBtns }) => {
  let [isCountView, setIsViewCount] = useState(5);
  return (
    <>
      <div className="overflow-x-auto overflow-y-visible w-full min-h-[20vh] font2">
        <table className="table">
          {/* head */}
          <thead className="bg-black/10 text-[10px]">
            <tr>
              <th></th>
              <th>
                <label>
                  <input type="checkbox" className="checkbox checkbox-xs" />
                </label>
              </th>
              {head?.map((el) => (
                <th key={uuidv4()}>{el}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          {list?.length > 0 && (
            <tbody className="w-full ">
              {list?.map(
                (el, index) =>
                  index < isCountView && (
                    <MyTableEl
                      index={index}
                      editBtns={editBtns}
                      key={uuidv4()}
                      id={el?.id}
                      arr={el?.arr}
                      btns={el?.btns}
                    />
                  )
              )}
            </tbody>
          )}
          {/* foot */}
        </table>
        {list?.length === 0 && (
          <div className="w-full text-xs bg-black/30 text-white mx-auto h-[10vh] flex items-center justify-center  text-center">
            No elements found
          </div>
        )}
      </div>
      {list?.length > 5 && (
        <div className="flex justify-end mt-4">
          <button
            disabled={list?.length <= isCountView}
            onClick={() => setIsViewCount(isCountView + 5)}
            className="btn btn-outline btn-xs  rounded-full"
          >
            View more
          </button>
        </div>
      )}
    </>
  );
};
