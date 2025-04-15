import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { ClipboardEdit, Loader2, BookOpen, Calendar, FileText } from "lucide-react";
import { FaChalkboardTeacher, FaNewspaper, FaTasks, FaUserFriends, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import { PRIOTITYSTYELS, TASK_TYPE } from "../../utils/index";
import { BarChartComponent, PieChartComponent } from "../Chart";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setGraphData, setLast10Task } from '../../redux/TasksSlice';
import { useEffect, useState } from "react";
import { TasksApi } from "../../service/api/student/tasksApi";
import { UseUserContext } from "../../context/StudentContext";
import { motion } from "framer-motion";
import { AdminApi } from "../../service/api/student/admins/adminApi";
import { toast } from "sonner";
import { TeacherApi } from "../../service/api/student/teacherApi";
import { Link } from "react-router-dom";
import { ADMIN_MANAGE_STUDENTS_ROUTE, ADMIN_MANAGE_TASKS_ROUTE, ADMIN_MANAGE_TEACHERS_ROUTE } from "../../router";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-200 dark:border-gray-700'>
      <tr className='text-left'>
        <th className='py-3 px-2 font-medium text-gray-600 dark:text-gray-300'>Task Title</th>
        <th className='py-3 px-2 font-medium text-gray-600 dark:text-gray-300'>Priority</th>
        <th className='py-3 px-2 font-medium text-gray-600 dark:text-gray-300 hidden md:table-cell'>Status</th>
        <th className='py-3 px-2 font-medium text-gray-600 dark:text-gray-300 hidden lg:table-cell'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <motion.tr 
      className='border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <td className='py-3 px-2'>
        <div className='flex items-center gap-2'>
          <div className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.status])} />
          <p className='text-sm md:text-base font-medium text-gray-800 dark:text-gray-200'>{task.title}</p>
        </div>
      </td>

      <td className='py-3 px-2'>
        <div className='flex gap-1 items-center'>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className='capitalize text-sm'>{task.priority}</span>
        </div>
      </td>

      <td className='py-3 px-2 hidden md:table-cell'>
        <span className={clsx(
          "px-2 py-1 rounded-full text-xs font-medium",
          task.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
          task.status === "in progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
        )}>
          {task.status}
        </span>
      </td>

      <td className='py-3 px-2 hidden lg:table-cell'>
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {moment(task.created_at).format("MMM D, YYYY")}
        </span>
      </td>
    </motion.tr>
  );

  return (
    <motion.div 
      className='w-full bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>Recent Tasks</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">Last 10 tasks</span>
      </div>
      <div className="overflow-x-auto">
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks?.map((task) => (
              <TableRow key={task.id} task={task} />
            ))}
          </tbody>
        </table>
        {tasks?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tasks found
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StatsCard = ({ label, count, bg, icon, change }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div 
      className="w-full h-full bg-white dark:bg-gray-800 p-5 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <div className="flex items-end mt-2">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">{count}</span>
            {change !== undefined && (
              <span className={clsx(
                "ml-2 text-xs font-medium px-2 py-0.5 rounded-full",
                isPositive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              )}>
                {isPositive ? '+' : ''}{change}%
              </span>
            )}
          </div>
        </div>
        <div className={clsx(
          "w-12 h-12 rounded-lg flex items-center justify-center text-white",
          bg
        )}>
          {icon}
        </div>
      </div>
      <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}% from last month
          </span>
        </p>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { user } = UseUserContext();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [filteredTasks, setFilteredTasks] = useState([]); 
  const [activeTab, setActiveTab] = useState('overview');
const [mockTeachers, setMockTeachers] = useState([]);
  const [mockStudents, setMockStudents] = useState([]);


  const stats = [
    {
      _id: "1",
      label: "TOTAL Students",
      total: user?.students_count || 142,
      icon: <FaUsers className="text-lg" />,
      bg: "bg-blue-500",
      change: 5.6
    },
    {
      _id: "2",
      label: "Active Teachers",
      total: user?.teachers_count || 24,
      icon: <FaChalkboardTeacher className="text-lg" />,
      bg: "bg-amber-500",
      change: 2.3
    },
    {
      _id: "3",
      label: "Classes",
      total: user?.classes_count||3,
      icon: <BookOpen className="text-lg" />,
      bg: "bg-indigo-500",
      change: 1.8
    },
    {
      _id: "4",
      label: "Avg. Attendance",
      total: user?.attendances_count || 5,
      icon: <FaUserFriends className="text-lg" />,
      bg: "bg-green-500",
      change: 1.2
    },
  ];

  // Fetch all tasks from API
  useEffect(() => {
    dispatch(setGraphData([]));
    dispatch(setLast10Task([]));

    setLoading(true);
    TasksApi.tasks().then(({ data }) => {
      setLoading(false);
      dispatch(setTasks(data));
    }).catch(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const allTasks = useSelector((state) => state.userTasks.tasks);

  // Filter tasks for authenticated user
  useEffect(() => {
    if (allTasks?.length > 0) {
      const userTasks = allTasks.filter(
        (task) => task.taskable_type === user.role && task.taskable_id === user.id
      );
      setFilteredTasks(userTasks);
    }

    const fetchMockData = async () => {

      try {
        const Students  = await AdminApi.allsStudents();
        setMockStudents(Students.data);
        const  {data}  = await TeacherApi.all();
        setMockTeachers(data.data);

      } catch (error) {
        toast.error("Failed to fetch mock data");
      }
    }
 
  fetchMockData();
  }, [allTasks, user]);

  // Update graphData based on filtered tasks
  useEffect(() => {
    if (filteredTasks?.length > 0) {
      const newGraphData = [
        { priority: "normal", count: filteredTasks.filter((task) => task.priority === "normal")?.length },
        { priority: "medium", count: filteredTasks.filter((task) => task.priority === "medium")?.length },
        { priority: "high", count: filteredTasks.filter((task) => task.priority === "high")?.length },
        { priority: "low", count: filteredTasks.filter((task) => task.priority === "low")?.length },
      ];
      dispatch(setGraphData(newGraphData));

      const newLast10Tasks = filteredTasks.slice(0, 10);
      dispatch(setLast10Task(newLast10Tasks));
    }
  }, [filteredTasks, dispatch]);

  const last10Task = useSelector((state) => state.userTasks.last10Task);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-full py-4 px-4 sm:px-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">School Administration Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-md",
              activeTab === 'overview' 
                ? "bg-blue-500 text-white" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-md",
              activeTab === 'teachers' 
                ? "bg-blue-500 text-white" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            Teachers
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-md",
              activeTab === 'students' 
                ? "bg-blue-500 text-white" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            Students
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats?.map((stat, index) => (
          <StatsCard 
            key={stat._id} 
            icon={stat.icon} 
            bg={stat.bg} 
            label={stat.label} 
            count={stat.total} 
            change={stat.change}
          />
        ))}
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <>
      
          <div className="mb-8">
            <TaskTable tasks={last10Task} />
          </div>
        </>
      )}

      {activeTab === 'teachers' && (
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
           <div className="w-full flex justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Teacher Directory</h3>
          <Link className="text-xl text-blue-500" to={ADMIN_MANAGE_TEACHERS_ROUTE}>see more</Link>

          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr className="text-left">
                  <th className="py-3 px-2 font-medium text-gray-600 dark:text-gray-300">First Name</th>
                  <th className="py-3 px-2 font-medium text-gray-600 dark:text-gray-300">Last Name</th>
                  <th className="py-3 px-2 font-medium text-gray-600 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTeachers.length>0 && mockTeachers?.slice(0,5).map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-2">{teacher.firsName}</td>
                    <td className="py-3 px-2">{teacher.lastName}</td>
                    <td className="py-3 px-2">
                      <span className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        teacher.status === 1? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      )}>
                        {teacher.status === 1? 'active':'inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="w-full flex justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Student Directory</h3>
          <Link className="text-xl text-blue-500" to={ADMIN_MANAGE_STUDENTS_ROUTE}>see more</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr className="text-left">
                  <th className="py-3 px-2 font-medium text-gray-600 dark:text-gray-300">Name</th>
                  <th className="py-3 px-2 font-medium text-gray-600 dark:text-gray-300">classe</th>
                  <th className="py-3 px-2 font-medium text-gray-600 dark:text-gray-300">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {mockStudents?.slice(0,5).map((student) => (
                  <tr key={student.id} className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-2">{student.name}</td>
                    <td className="py-3 px-2">{student.classe?.name}</td>
                    <td className="py-3 px-2">{student.attendance?.length}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <Link to={ADMIN_MANAGE_TEACHERS_ROUTE}>

          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300 mb-2">
            <FaChalkboardTeacher className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Teacher</span>
          </Link>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
       <Link to={ADMIN_MANAGE_STUDENTS_ROUTE}>
       <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 dark:text-green-300 mb-2">
            <FaUsers className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Register Student</span>
          </Link>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <Link to={ADMIN_MANAGE_TASKS_ROUTE}>
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-500 dark:text-purple-300 mb-2">
            <ClipboardEdit className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Create Task</span>
          </Link>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-500 dark:text-amber-300 mb-2">
            <MdAdminPanelSettings className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin Panel</span>
        </motion.button>
      </div>
    </div>
  );
};

export default AdminDashboard;