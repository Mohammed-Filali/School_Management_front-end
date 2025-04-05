import clsx from "clsx";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import BoardView from "./BoardView";

const TaskTitle = ({ label, className, tasks }) => {
  return (
    <>
      <div className="w-100 h-10 md:h-12 px-2 md:px-4 rounded bg-white block items-center justify-between dark:bg-gray-950 text-white">
        <div className="flex gap-2 items-center">
          <div className={clsx("w-4 h-4 rounded-full", className)} />
          <p className="text-sm md:text-base text-gray-600 dark:text-white">{label}</p>
        </div>
        <div className=" w-full block ">
            <BoardView tasks={tasks} />
        </div>
      </div>


    </>
  );
};

export default TaskTitle;
