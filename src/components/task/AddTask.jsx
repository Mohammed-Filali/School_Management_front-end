import { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import SelectList from "../SelectList";
import Button from "../Button";
import { UseUserContext } from "../../context/StudentContext";
import { TasksApi } from "../../service/api/student/tasksApi";
import { toast } from "sonner";
import { BiLoader } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../../redux/TasksSlice";

const LISTS = ["todo", "in progress", "completed"];
const PRIORIRY = ['high','medium','normal','low'];
const AddTask = ({ open, setOpen ,task}) => {
    const dispatch = useDispatch()
    const [status, setStage] = useState(task? task.status :LISTS[0]); // Default to 'TODO'

  const { user } = UseUserContext(); // Get the user from context
  // Default to 'NORMAL'
  const [assets, setAssets] = useState([]); // For handling file uploads
  const [uploading, setUploading] = useState(false);
  const [loadind ,setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [priority, setPriority] = useState(task? task.priority :PRIORIRY[2]);

  const submitHandler = (data) => {


    setLoading(true);

    // Prepare the task data
    const taskData = {
      ...data, // Form data (title, description, etc.)
      taskable_type: user?.role, // User role as taskable_type
      taskable_id: user?.id, // User ID as taskable_id
      status, // Current task stage
      priority, // Any uploaded assets
    };
    console.log('taskable_id'+task);


    // If we are updating an existing task
    if (task) {
      TasksApi.update(taskData, task?.id)
        .then(() => {
          toast.success('Task updated successfully');

          // Dispatch the updateTask action with the updated task data
          dispatch(updateTask({ ...taskData, id: task.id }));

          setOpen(false);
          setLoading(false);
        })
        .catch(() => {
          toast.error('Something went wrong');
          setLoading(false);
        });
    } else {
      // If we are adding a new task
      TasksApi.AddTask(taskData)
        .then(() => {
          toast.success('Task added successfully');
          dispatch(addTask(taskData))
          setLoading(false);
          setOpen(false);
        })
        .catch(() => {
          toast.error('Something went wrong');
          setLoading(false);
        });
    }
  };

    // Submit task data


  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          Add Task
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Task Title"
            type="text"
            value ={task? task.title :""}
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          />

          <Textbox
            placeholder="Task Description"
            type="text"
            name="description"
            value ={task? task.description :""}
            label="Task Description"
            className="w-full rounded"
            register={register("description", { required: "Description is required" })}
            error={errors.description ? errors.description.message : ""}
          />

          <div className="flex gap-4">
            <SelectList
              name="status"
              defaultValue ={task? task.status :""}
              label="Task Stage"
              lists={LISTS}
              selected={status}
              setSelected={setStage}
            />
          </div>

          <div className="flex gap-4">
            <SelectList
              label="Priority Level"
              lists={PRIORIRY}
              selected={priority}
              setSelected={setPriority}
            />
          </div>

          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            {uploading ? (
              <span className="text-sm py-2 text-red-500">Uploading assets</span>
            ) : (
              <Button
                label={loadind ? <BiLoader className="animate-spin " /> : "Submit" }
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              />
            )}

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
