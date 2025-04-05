import  { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import Table from "../components/task/Table";
import { Loader2 } from "lucide-react";
import { TasksApi } from "../service/api/student/tasksApi";
import { UseUserContext } from "../context/StudentContext";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/TasksSlice";
import AddTask from "../components/task/AddTask";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
    const dispatch= useDispatch()
    useEffect(()=>{
        TasksApi.tasks().then(({data})=>{
            dispatch(setTasks(data))
        })
    },[])

    const {user} =UseUserContext()
    const params = useParams();
    const [todo , setTodo]=useState([]);
    const [progress , setProgress]=useState([]);
    const [complet , setComplet]=useState([]);

    const [userTasks , setUserTasks]=useState([]);
    const [loading, setLoading] = useState(false);


  const tasks = useSelector((state) => state.userTasks.tasks); // Get tasks from Redux

  useEffect(() => {

    const filteredTasks = tasks.filter(
      (t) => t.taskable_type === user.role && t.taskable_id === user.id
    );

    setUserTasks(filteredTasks);
    console.log(userTasks);

    setTodo(filteredTasks.filter((t) => t.status === "todo"));
    setProgress(filteredTasks.filter((t) => t.status === "in progress"));
    setComplet(filteredTasks.filter((t) => t.status === "completed"));
  }, [tasks]);


  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";

  return loading ? (
    <div className="w-full  flex items-center justify-center">
    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
  </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-gray-950 text-white rounded-md py-2 2xl:py-2.5 dark:bg-slate-50 dark:text-gray-950'
          />
        )}
      </div>

      <Tabs tabs={TABS}  setSelected={setSelected}>
      {selected !== 1 ? (<div>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
          <TaskTitle tasks={todo} label="To Do" className={TASK_TYPE.todo} />
          <TaskTitle
            tasks={progress}
            label="In Progress"
            className={TASK_TYPE["in progress"]}
          />
          <TaskTitle
            tasks={complet}
            label="Completed"
            className={TASK_TYPE.completed}
          />
        </div>

        )}

    </div>
        ) : (
          <div className='w-full'>
            <Table tasks={userTasks} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
