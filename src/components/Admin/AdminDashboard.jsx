import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { ClipboardEdit, Loader2} from "lucide-react";
import { FaNewspaper,  } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import {  PRIOTITYSTYELS, TASK_TYPE } from "../../utils/index";
import { Chart } from "../Chart";

import { useDispatch, useSelector } from "react-redux";
import { setTasks, setGraphData, setLast10Task } from '../../redux/TasksSlice';
import { useEffect, useState } from "react";
import { TasksApi } from "../../service/api/student/tasksApi";
import { UseUserContext } from "../../context/StudentContext";

const TaskTable = ({ tasks }) => {
    const ICONS = {
      high: <MdKeyboardDoubleArrowUp />,
      medium: <MdKeyboardArrowUp />,
      low: <MdKeyboardArrowDown />,
    };

    const TableHeader = () => (
      <thead className='border-b border-gray-300'>
        <tr className='text-black text-left'>
          <th className='py-2'>Task Title</th>
          <th className='py-2'>Priority</th>
          <th className='py-2 hidden md:block'>Created At</th>
        </tr>
      </thead>
    );

    const TableRow = ({ task }) => (
      <tr className='border-b border-gray-300 text-gray-600 hover:bg-gray-300/10'>
        <td className='py-2'>
          <div className='flex items-center gap-2'>
            <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.status])} />
            <p className='text-base text-black'>{task.title}</p>
          </div>
        </td>

        <td className='py-2'>
          <div className='flex gap-1 items-center'>
            <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
              {ICONS[task.priority]}
            </span>
            <span className='capitalize'>{task.priority}</span>
          </div>
        </td>



        <td className='py-2 hidden md:block'>
          <span className='text-base text-gray-600'>
            {moment(task.created_at).fromNow()}
          </span>
        </td>
      </tr>
    );

    return (
      <div className='w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={task.id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };







  const AdminDashboard = () => {
    const { user } = UseUserContext(); // Get authenticated user
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]); // Filtered tasks for auth user

    // Fetch all tasks from API
    useEffect(() => {
        dispatch(setGraphData([]));
        dispatch(setLast10Task([]));

      setLoading(true);
      TasksApi.tasks().then(({ data }) => {
        setLoading(false);
        dispatch(setTasks(data)); // Store all tasks in Redux
      });
    }, [dispatch]);

    const allTasks = useSelector((state) => state.userTasks.tasks);

    // **Filter tasks for authenticated user**
    useEffect(() => {
      if (allTasks?.length > 0) {
        const userTasks = allTasks.filter(
          (task) => task.taskable_type === user.role && task.taskable_id === user.id
        );
        setFilteredTasks(userTasks);
      }
    }, [allTasks, user]);

    // **Update graphData based on filtered tasks**


    const graphData = useSelector((state) => state.userTasks.graphData);
    const last10Task = useSelector((state) => state.userTasks.last10Task);

    // **Statistics Cards**
    const stats = [
      {
        _id: "1",
        label: "TOTAL TASK",
        total: filteredTasks?.length || 0,
        icon: <FaNewspaper />,
        bg: "bg-[#1d4ed8]",
      },
      {
        _id: "2",
        label: "COMPLETED TASK",
        total: filteredTasks?.filter((task) => task.status === "completed")?.length || 0,
        icon: <MdAdminPanelSettings />,
        bg: "bg-[#0f766e]",
      },
      {
        _id: "3",
        label: "TASK IN PROGRESS",
        total: filteredTasks?.filter((task) => task.status === "in progress")?.length || 0,
        icon: <ClipboardEdit />,
        bg: "bg-[#f59e0b]",
      },
      {
        _id: "4",
        label: "TODOS",
        total: filteredTasks?.filter((task) => task.status === "todo")?.length || 0,
        icon: <FaArrowsToDot />,
        bg: "bg-[#be185d]",
      },
    ];
    useEffect(() => {

        if (filteredTasks?.length > 0) {
            const newGraphData = [
              { priority: "normal", count: filteredTasks.filter((task) => task.priority === "normal")?.length },
              { priority: "medium", count: filteredTasks.filter((task) => task.priority === "medium")?.length },
              { priority: "high", count: filteredTasks.filter((task) => task.priority === "high")?.length },
              { priority: "low", count: filteredTasks.filter((task) => task.priority === "low")?.length },
            ];
            dispatch(setGraphData(newGraphData));

            const newLast10Tasks = filteredTasks.slice(0, 10); // Get last 10 tasks
            dispatch(setLast10Task(newLast10Tasks));
        }
      }, [filteredTasks, dispatch]);

    // **Card Component**
    const Card = ({ label, count, bg, icon }) => (
      <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
        <div className="h-full flex flex-1 flex-col justify-between">
          <p className="text-base text-gray-600">{label}</p>
          <span className="text-2xl font-semibold">{count}</span>
          <span className="text-sm text-gray-400">{"110 last month"}</span>
        </div>
        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>
          {icon}
        </div>
      </div>
    );

    // **Loading State**
    if (loading) {
      return (
        <div className="w-full flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      );
    }

    return (
      <div className="h-full py-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {stats.map(({ icon, bg, label, total }, index) => (
            <Card key={index} icon={icon} bg={bg} label={label} count={total} />
          ))}
        </div>

        {/* Chart */}
        <div className="w-full bg-white my-16 p-4 rounded shadow-sm">
          <h4 className="text-xl text-gray-600 font-semibold">Chart by Priority</h4>
          <Chart data={graphData} />
        </div>

        {/* Last 10 Tasks Table */}
        <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
          <TaskTable tasks={last10Task} />
        </div>
      </div>
    );
  };

  export default AdminDashboard;
