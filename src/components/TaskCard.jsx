import clsx from "clsx";
import  { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import {  PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {

  return (
    <>
      <div className="w-full h-fit bg-white shadow-md p-4 rounded dark:bg-black dark:shadow-slate-500">
        {/* أولوية المهمة */}
        <div className="w-full flex justify-between">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority] || "text-gray-500 dark:text-white"
            )}
          >
            <span className="text-lg dark:text-white">{ICONS[task?.priority] || <MdKeyboardArrowDown />}</span>
            <span className="uppercase dark:text-white">{task?.priority || "Normal"} Priority</span>
          </div>

          <TaskDialog task={task} />
        </div>

        {/* معلومات المهمة */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task?.status] || "bg-gray-300 dark:text-white")} />
            <h4 className="line-clamp-1 text-black dark:text-white">{task?.title || "Untitled Task"}</h4>
          </div>

          {task?.description && (
            <p className="text-sm text-gray-700 line-clamp-2 dark:text-white">{task.description}</p>
          )}

          <span className="text-sm text-gray-600 dark:text-white" >
            {task?.created_at ? formatDate(new Date(task.created_at)) : "No date"}
          </span>
        </div>

        {/* المهام الفرعية */}

      </div>

    </>
  );
};

export default TaskCard;
