import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import ParentRecordsList from "./ParentRecordssliste";
import { UseUserContext } from "../../../context/StudentContext";
import { ChevronDown, User, BookOpen, Clock, Calendar, Award, ClipboardList } from "lucide-react";

const StudentRecordsDropdown = () => {
  const { user } = UseUserContext();
  const [selectedStudent, setSelectedStudent] = useState(
    user?.students?.[0] || null
  );

  // Calculate overall average for a student
  const calculateOverallAverage = (student) => {
    if (!student.moyennes || student.moyennes.length === 0) return null;
    const total = student.moyennes.reduce((sum, moyenne) => sum + parseFloat(moyenne.total), 0);
    return (total / student.moyennes.length).toFixed(2);
  };

  // Count records by type
  const countRecordsByType = (student) => {
    if (!student.records || student.records.length === 0) return null;
    return student.records.reduce((acc, record) => {
      const type = record.exams?.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Portal</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View academic records for your children
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Student Selection Section */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Child
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
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <BookOpen className="h-3 w-3" />
                            <span>Class {student.classe_id}</span>
                            {student.moyennes?.length > 0 && (
                              <>
                                <span>•</span>
                                <Award className="h-3 w-3" />
                                <span>Avg: {calculateOverallAverage(student)}</span>
                              </>
                            )}
                          </div>
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

        {/* Records Display Section */}
        {selectedStudent ? (
          <div className="divide-y divide-gray-200">
            {/* Student Header */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedStudent.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <BookOpen className="h-3 w-3" />
                      Class {selectedStudent.classe_id}
                    </span>
                    
                    {selectedStudent.moyennes?.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Award className="h-3 w-3" />
                        Overall Average: {calculateOverallAverage(selectedStudent)}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </span>

                    {selectedStudent.records?.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <ClipboardList className="h-3 w-3" />
                        {selectedStudent.records.length} Exam Records
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  Last updated: {new Date(selectedStudent.updated_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Records Content */}
            <div className="p-6 sm:p-8">
              <ParentRecordsList
                classe_id={selectedStudent.classe_id}
                student_name={selectedStudent.name}
                student_id={selectedStudent.id}
                student_records={selectedStudent.records}
                student_moyennes={selectedStudent.moyennes}
                student_attendance={selectedStudent.attendance}
              />
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No student selected
            </h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Please select a student from the dropdown above to view their academic records
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Need help? Contact your school administrator</p>
      </div>
    </div>
  );
};

export default StudentRecordsDropdown;