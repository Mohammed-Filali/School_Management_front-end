import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks }) => {
    console.log(tasks);

  return (
    <div className='w-full overflow-y-auto p-4 '>
      {tasks?.map((task, index) => (
        <TaskCard task={task} key={index} />
      ))}
    </div>
  );
};

export default BoardView;
