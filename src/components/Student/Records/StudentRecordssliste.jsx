import { useEffect, useState } from "react";
import { DataTable } from "../../Admin/data-table/DataTable";
import { DataTableColumnHeader } from "../../Admin/data-table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UseUserContext } from "../../../context/StudentContext";
import { Loader2, FileText, User, BookOpen, Award, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StudentRecordsList() {
  const { user } = UseUserContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.records) {
      setLoading(true);
      try {
        // Transform records data to match the expected format
        const formattedData = user.records.map(record => ({
          id: record.id,
          name: record.exams.name,
          type: record.exams.type,
          note: record.note,
          comment: record.comment,
          course: {
            id: record.exams.course_id,
            name: record.exams.course.name // You might need to add course name to your exams data
          },
        
          records: [{
            user_id: user.id,
            note: record.note,
            comment: record.comment
          }]
        }));
        setData(formattedData);
      } catch (err) {
        console.error(err);
        setError("Failed to process records data.");
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Exam" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const type = row.original.type?.toLowerCase();
        let variant = "outline";
        if (type === "quiz") variant = "secondary";
        if (type === "midterm") variant = "default";
        if (type === "final") variant = "destructive";
        
        return (
          <Badge variant={variant} className="capitalize">
            {row.original.type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "Record",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Score" />
      ),
      cell: ({ row }) => {
        const record = row.original.records?.[0];
        
        if (!record) return (
          <span className="text-gray-400">N/A</span>
        );
        
        const score = parseFloat(record.note);
        let textColor = "text-gray-700";
        if (score < 50) textColor = "text-red-500";
        else if (score < 70) textColor = "text-yellow-600";
        else textColor = "text-green-600";
        
        return (
          <div className={`font-bold ${textColor}`}>
            {record.note}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const record = row.original.records?.[0];

        return (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Info className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Details</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  {row.original.name} Results
                </SheetTitle>
                <SheetDescription>
                  {record ? (
                    <div className="space-y-4 mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Your Performance</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Score</p>
                            <p className="font-bold">{record.note}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium">
                              {parseFloat(record.note) >= 10 ? (
                                <span className="text-green-600">Passed</span>
                              ) : (
                                <span className="text-red-500">Failed</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Teacher's Feedback</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          {record.comment ? (
                            <p className="whitespace-pre-wrap">{record.comment}</p>
                          ) : (
                            <p className="text-gray-400">No feedback provided</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p>No record available for this exam.</p>
                    </div>
                  )}
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-500">Loading your exam records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 rounded-lg border border-red-200 flex flex-col items-center justify-center space-y-4">
        <div className="text-red-500 font-medium">{error}</div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (data.length === 0 && !loading) {
    return (
      <div className="w-full p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-4">
        <FileText className="w-10 h-10 text-gray-400" />
        <p className="text-gray-500">No exam records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Exam Results</h3>
        <div className="text-sm text-gray-500">
          Showing {data.length} {data.length === 1 ? "record" : "records"}
        </div>
      </div>
      <DataTable 
        columns={RecordColumns} 
        data={data} 
        className="border rounded-lg overflow-hidden"
      />
    </div>
  );
}