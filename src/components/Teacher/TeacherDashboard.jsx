import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdClass,
  MdAssignment,
  MdPerson,
  MdBarChart,
  MdToday
} from "react-icons/md";
import { ClipboardEdit, Loader2, BookOpen, CalendarCheck } from "lucide-react";
import { FaNewspaper, FaChalkboardTeacher } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import { PRIOTITYSTYELS, TASK_TYPE } from "../../utils/index";
import { Chart } from "../Chart";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setGraphData, setLast10Task } from '../../redux/TasksSlice';
import { useEffect, useState } from "react";
import { TasksApi } from "../../service/api/student/tasksApi";
import { UseUserContext } from "../../context/StudentContext";
import { setExams } from "../../redux/Teacher/ExamsSlice";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-200 dark:bg-gray-900 dark:text-white'>
      <tr className='text-black text-left dark:text-white'>
        <th className='py-3 px-2'>Task Title</th>
        <th className='py-3 px-2'>Priority</th>
        <th className='py-3 px-2 hidden md:table-cell'>Status</th>
        <th className='py-3 px-2 hidden md:table-cell'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors dark:bg-gray-900 dark:text-white'>
      <td className='py-3 px-2'>
        <div className='flex items-center gap-2'>
          <div className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.status])} />
          <p className='text-base text-black font-medium dark:text-white'>{task.title}</p>
        </div>
      </td>

      <td className='py-3 px-2'>
        <div className='flex gap-1 items-center'>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className='capitalize'>{task.priority}</span>
        </div>
      </td>

      <td className='py-3 px-2 hidden md:table-cell'>
        <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", 
          task.status === "completed" ? "bg-green-100 text-green-800" :
          task.status === "in progress" ? "bg-blue-100 text-blue-800" :
          "bg-yellow-100 text-yellow-800"
        )}>
          {task.status}
        </span>
      </td>

      <td className='py-3 px-2 hidden md:table-cell'>
        <span className='text-sm text-gray-600 dark:text-white'>
          {moment(task.created_at).format("MMM D, YYYY")}
        </span>
      </td>
    </tr>
  );

  return (
    <div className='w-full bg-white rounded-lg border border-gray-200 overflow-hidden dark:bg-gray-900 dark:text-white'>
      <div className='p-4 border-b border-gray-200'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>Recent Tasks</h3>
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
      </div>
    </div>
  );
};

const ExamSummary = ({ exams }) => {
  // Calculate average grades per exam
  const [allRecords,setAllRecords]= useState()
  const examStats = exams.map(exam => {
    const total = exam.records.reduce((sum, record) => sum + record.note, 0);    
    const average = exam.records.length > 0 ? (total / exam.records.length).toFixed(2) : 0;
    return {
      name: exam.name,
      average,
      count: exam.records.length,
      highest: Math.max(...exam.records.map(r => r.note)),
      lowest: Math.min(...exam.records.map(r => r.note))
    };
  });

  return (
    <div className='w-full bg-white rounded-lg border border-gray-200 overflow-hidden dark:bg-gray-900 dark:text-white'>
      <div className='p-4 border-b border-gray-200'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>Exam Performance</h3>
      </div>
      <div className="p-4">
        {examStats.length > 0 ? (
          <div className="space-y-4">
            {examStats.map((exam, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-white">{exam.name}</h4>
                  <span className="text-sm text-gray-500 dark:text-white">{exam.count} records</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(exam.average / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{exam.average}</span>
                    <span className="text-xs text-gray-500 ml-1 dark:text-white">/20</span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-white">
                  <span>Lowest: {exam.lowest}</span>
                  <span>Highest: {exam.highest}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No exam data available</p>
        )}
      </div>
    </div>
  );
};

const ClassSummary = ({ classes }) => {
  const totalHours = classes.reduce((sum, cls) => sum + cls.masseH, 0);
  const totalClasses = classes.reduce((sum, cls) => {
    if (cls.class_type && Array.isArray(cls.class_type.classe)) {
      return sum + cls.class_type.classe.length;
    }
    return sum;
  }, 0);
  return (
    <div className='w-full bg-white rounded-lg border border-gray-200 overflow-hidden dark:bg-gray-900 dark:text-white'>
      <div className='p-4 border-b border-gray-200'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>Classes Summary</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg dark:bg-gray-500 dark:text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-white">Total Classes</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalClasses}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <MdClass size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg dark:bg-gray-500 dark:text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-white">Total Hours</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalHours}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CalendarCheck  size={20} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2 dark:text-white">Your Classes</h4>
          <ul className="space-y-2">
            {classes.map((cls, index) => (
              <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{cls.class_type?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-white">
                    {cls.class_type?.classe?.length} groups • {cls.masseH} hours
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-white">{cls.class_type?.code}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const { user } = UseUserContext();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const exams = useSelector((state) => state.TeacherExams.exams);
  const totalExams = useSelector((state) => state.TeacherExams.totalExams); // Get exams from Redux

  useEffect(() => {
    dispatch(setGraphData([]));
    dispatch(setLast10Task([]));
    TasksApi.tasks().then(({ data }) => {
      dispatch(setTasks(data));
      setLoading(false);
    }).catch(() => setLoading(false));
    if(exams.length === 0) {
    dispatch(setExams(user.exams));
    }
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
  }, [allTasks, user]);

  const graphData = useSelector((state) => state.userTasks.graphData);
  
  const last10Task = useSelector((state) => state.userTasks.last10Task);

  // Update graph data and last 10 tasks
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

  // Calculate statistics
  const totalClasses = user.classes.reduce((sum, cls) => {
    if (cls.class_type && Array.isArray(cls.class_type.classe)) {
      return sum + cls.class_type.classe.length;
    }
    return sum;
  }, 0);
  
  const totalHours = user.classes.reduce((sum, cls) => sum + cls.masseH, 0) * totalClasses;
  const totalStudents = user.classes.reduce((sum, cls) => {
    if (!cls.class_type || !Array.isArray(cls.class_type.classe)) return sum;
  
    const uniqueStudents = new Set(
      cls.class_type.classe.flatMap(record =>
        (record.students || []).map(student => student.id)
      )
    );
    return sum + uniqueStudents.size;
  }, 0);
  

  const stats = [
    {
      _id: "1",
      label: "TOTAL CLASSES",
      total: totalClasses,
      icon: <MdClass className="text-xl" />,
      bg: "bg-blue-100",
      text: "text-blue-600"
    },
    {
      _id: "2",
      label: "TOTAL HOURS",
      total: totalHours,
      icon: <CalendarCheck className="text-xl" />,
      bg: "bg-green-100",
      text: "text-green-600"
    },
    {
      _id: "3",
      label: "TOTAL EXAMS",
      total: totalExams,
      icon: <MdAssignment className="text-xl" />,
      bg: "bg-amber-100",
      text: "text-amber-600"
    },
    {
      _id: "4",
      label: "TOTAL STUDENTS",
      total: totalStudents,
      icon: <MdPerson className="text-xl" />,
      bg: "bg-purple-100",
      text: "text-purple-600"
    },
  ];

  const Card = ({ label, count, bg, text, icon }) => (
    <div className={`p-4 rounded-xl ${bg} flex items-center justify-between shadow-sm`}>
      <div>
        <p className="text-sm font-medium text-gray-600 ">{label}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800">{count}</h3>
      </div>
      <div className={`p-3 rounded-lg ${text} bg-white bg-opacity-50`}>
        {icon}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-900 dark:text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome, {user.firsName} {user.lastName}</h1>
            <p className="text-gray-600 mt-1 dark:text-white">Here's what's happening with your classes today</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg dark:bg-lime-100 ">
            <BookOpen className="text-blue-500" size={18} />
            <span className="font-medium text-blue-600">{user.course.name}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon, bg, text, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} text={text} label={label} count={total} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 " >
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Priority Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:text-white">
            <div className="flex items-center justify-between mb-4 dark:bg-gray-900 dark:text-white">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Task Priority Distribution</h3>
              <MdBarChart className="text-gray-500 dark:text-white" size={20} />
            </div>
            <Chart data={graphData} />
          </div>
          
          {/* Recent Tasks */}
          <TaskTable  tasks={last10Task} />
        </div>

        {/* Right Column */}
        <div className="space-y-6 dark:bg-gray-900 dark:text-white">
          {/* Exam Summary */}
          <ExamSummary exams={user.exams} />

          {/* Class Summary */}
          <ClassSummary classes={user.classes} />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;