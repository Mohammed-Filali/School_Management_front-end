import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import ParentRecordsList from "./ParentRecordssliste";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import { UseUserContext } from "../../../context/StudentContext";


const StudentRecordsDropdown = () => {
    const {user} = UseUserContext()
  const [selectedStudent, setSelectedStudent] = useState(
    user?.students?.[0] || null
  );

  return (
    <div className="w-full">
      {/* Dropdown menu implementation */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full p-2 rounded-md text-left">
          {selectedStudent?.name || "Select a Student"}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full text-gray-900 bg-white shadow-md rounded-md p-2">
          {user?.students?.length > 0 ? (
            user.students.map((student) => (
              <DropdownMenuItem
                key={student.id}
                onSelect={() => setSelectedStudent(student)}
                className="cursor-pointer text-gray-900 hover:bg-gray-200 rounded-md p-2"
              >
                {student.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled className="p-2 ">
              No Students Available
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Content area displaying the selected student's details */}
      <div className="mt-4">
        {selectedStudent ? (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {selectedStudent.name}'s Records
            </h2>
            <ParentRecordsList
              classe_id={selectedStudent.classe_id}
              student_name={selectedStudent.name}
            />
            <Separator className="my-4" />
            <div className="relative">
              <ScrollArea>
                <div className="flex space-x-4 pb-4"></div>
                <Scrollbar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        ) : (
          <p className="text-center ">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentRecordsDropdown;
