import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import AddTask from "./AddTask";
import { TasksApi } from "../../service/api/student/tasksApi";
import { useDispatch } from "react-redux";
import { deleteTask } from "../../redux/TasksSlice";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};


const Table = ({ tasks }) => {
    const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
    const [t,setT]=useState({})
    const [loading , setLoading] = useState(false)
    const dispatch = useDispatch()
    const updateHundler =(task)=>{
        setT(task)
        setOpenEdit(true)
    }
  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);

  };

  const deleteHandler = () => {
    setLoading(true)

    TasksApi.delete(selected).then(()=>{
        setOpenDialog(false);
        dispatch(deleteTask(selected))
        setLoading(false)

            toast.success('deleted with success')
        }).catch((err)=>{
            setOpenDialog(false);
            setLoading(false)

            toast.error('something is wrong')
        })
  };

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300 dark:border-white dark:bg-black'>
      <tr className='w-full text-black  text-left dark:text-white'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2 line-clamp-1'>Created Att</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10 dark:bg-black border-gray-200 text-white'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className='w-full line-clamp-2 text-base text-black dark:text-white'>
            {task?.title}
          </p>
        </div>
      </td>

      <td className='py-2 dark:bg-black'>
        <div className={"flex gap-1 items-center "}>
          <span className={clsx("text-lg text-gray-800", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className='capitalize line-clamp-1 text-gray-800 dark:text-white'>
            {task?.priority} Priority
          </span>
        </div>
      </td>

      <td className='py-2'>
        <span className='text-sm text-gray-600 dark:text-white'>
          {formatDate(new Date(task?.created_at))}
        </span>
      </td>





      <td className='py-2 flex gap-2 md:gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
          label='Edit'
          type='button'
          onClick={()=>{
            updateHundler(task)
          }}
        />

        <Button
          className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
          label='Delete'
          type='button'
          onClick={() => deleteClicks(task?.id)}
        />
      </td>


    </tr>
  );
  return (
    <>
      <div className='bg-white  px-2 md:px-4 pt-4 pb-9 shadow-md rounded dark:bg-black'>
        <div className='overflow-x-auto'>
          <table className='w-full '>
            <TableHeader />
            <tbody>
              {tasks?.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TODO */}
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
        loading ={loading}
      />

        <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={t}
        key={new Date().getTime()}
      />
    </>
  );
};

export default Table;
