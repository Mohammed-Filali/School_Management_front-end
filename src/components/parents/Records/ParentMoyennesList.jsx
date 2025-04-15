import { useEffect, useState } from "react";
import { UseUserContext } from "../../../context/StudentContext";
import { BookOpen, ChevronDown, FileText, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DataTableColumnHeader } from "../../Admin/data-table/DataTableColumnHeader";
import { DataTable } from "../../Admin/data-table/DataTable";




export default function ParentMoyennesList() {
const { user } = UseUserContext();
  const [selectedStudent, setSelectedStudent] = useState(
    user?.students?.[0] || null
  );
const[data, setData] = useState([]);
 
  useEffect(() => {
    setData(selectedStudent?.moyennes || []);
   
    
  },[selectedStudent]);
  const dataFilter =(e)=> {
  
    const filter = e.target.value;
    if (filter === "") {
      setData(selectedStudent?.moyennes);
    } else {
      const filteredData = selectedStudent?.moyennes.filter((item) =>
        item.course.name.toLowerCase().includes(filter.toLowerCase())
      );
      setData(filteredData);      
    }
  }

    const RecordColumns = [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-gray-600">#{row.original.id}</span>
        ),
      },
      {
        accessorKey: "Course",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Course" />
        ),
        cell: ({ row }) => {
          const { course } = row.original || {};
          return (
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>{course?.name || "N/A"}</span>
            </div>
          );
        },
      },
      
      {
        accessorKey: "total",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Moyenne" />
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.original.total}</div>
        ),
      },
    
    ];
  

  return<>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="font-medium">
                    {selectedStudent?.name || "Select a Student"}
                  </span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white rounded-lg shadow-lg border border-gray-200 mt-2 overflow-hidden z-50">
                {user?.students?.length > 0 ? (
                  user.students.map((student) => (
                    <DropdownMenuItem
                      key={student.id}
                      onSelect={() => setSelectedStudent(student)}
                      className="cursor-pointer px-4 py-3 text-gray-700 hover:bg-indigo-50 focus:bg-indigo-50 outline-none transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Class {student.classe_id}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem
                    disabled
                    className="px-4 py-3 text-gray-500 text-sm flex flex-col items-center justify-center"
                  >
                    <User className="h-5 w-5 mb-2 text-gray-400" />
                    No Students Available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        </div>

    {
        selectedStudent ? (
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Your Exam Results</h3>
              <div className="text-sm text-gray-500">
                Showing {data.length} {data.length === 1 ? "record" : "records"}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search by course..."
                  className="border rounded-lg p-2"
                  onChange={dataFilter}
                />
                </div>
            </div>
           { data.length==0 ?
            <div className="w-full p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-4">
              <FileText className="w-10 h-10 text-gray-400" />
              <p className="text-gray-500">No exam records found for your class.</p>
            </div> :  <DataTable 
              columns={RecordColumns} 
              data={data} 
              className="border rounded-lg overflow-hidden"
            />}
          </div>
        ):(
            <div className="w-full p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-500">No student slected</p>
            </div>
        )
    }

  </>
}