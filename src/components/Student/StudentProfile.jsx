import * as Avatar from "@radix-ui/react-avatar";
import { UseUserContext } from "../../context/StudentContext";
import UpdatePasswordForm from "../UpdatePasswordForm";
import { StudentApi } from "../../service/api/student/studentApi";

export default function StudentProfile() {
  const { user } = UseUserContext();

  return (
    <>
      {user ? (
        <div className="max-w-75 mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:bg-gray-800">
          {/* Header Section */}
          <div className="bg-gray-200 py-8 text-center">
            {/* Radix Avatar */}
            <Avatar.Root className="inline-flex items-center justify-center w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 shadow-md">
              <Avatar.Image
                className="w-full h-full object-cover"
                src={user.profileImage || "https://via.placeholder.com/150"} // Default image URL if no user image
              />
              <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-lg font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}{" "}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-4 text-gray-700 dark:text-gray-400">
            <div className="flex justify-between">
              <span className="font-medium">Date of Birth:</span>
              <span>{user.date_of_birth}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Address:</span>
              <span>{user.adress}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Sex:</span>
              <span>{user.gender === "m" ? "Male" : "Female"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Blood Type:</span>
              <span>{user.blood_Type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Last Updated:</span>
              <span>{new Date(user.updated_at).toLocaleString()}</span>
            </div>
          </div>
          <UpdatePasswordForm onSubmitHandler= {(values) => StudentApi.update_Password(values)} />
        </div>

      ) : (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-6">
          <p>No user data available.</p>
        </div>
      )}
    </>
  );
}
