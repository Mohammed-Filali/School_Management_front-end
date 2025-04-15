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
import { Loader2, Info, BookOpen, User, FileText, Award, CalendarDays } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ParentRecordsList({  student_name, student_records, student_moyennes }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate average score for the student
  const calculateAverage = () => {
    if (!student_records || student_records.length === 0) return null;
    const total = student_records.reduce((sum, record) => sum + parseFloat(record.note), 0);
    return (total / student_records.length).toFixed(2);
  };

  // Count records by type
 
  const RecordColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">#{row.original.id}</span>
      ),
      size: 80,
    },
    {
      accessorKey: "course",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Course" />
      ),
      cell: ({ row }) => {
        const course = row.original.exams?.course;
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            {course?.name || <span className="text-muted-foreground">N/A</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "exam",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Exam" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.exams?.name}</span>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const type = row.original.exams?.type?.toLowerCase();
        const variant = type === 'cc' ? 'secondary' : 
                       type === 'efm' ? 'default' : 
                       type === 'eff' ? 'destructive' : 'outline';
        return (
          <Badge variant={variant} className="capitalize">
            {row.original.exams?.type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = row.original.created_at;
        return date ? (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      },
    },
    {
      accessorKey: "score",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Score" />
      ),
      cell: ({ row }) => {
        const score = parseFloat(row.original.note);
        const scoreColor = score >= 16 ? 'text-green-600' : 
                          score >= 12 ? 'text-yellow-600' : 
                          'text-red-600';
        
        return (
          <span className={`font-bold ${scoreColor}`}>
            {row.original.note}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex gap-1">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">Details</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Exam Details
                  </SheetTitle>
                  <SheetDescription>
                    <div className="space-y-4 mt-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Student Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Student:</span>
                              <span className="font-medium">{student_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Exam:</span>
                              <span className="font-medium">{row.original.exams?.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="font-medium">{row.original.exams?.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Score:</span>
                              <span className="font-bold">{row.original.note}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Teacher Feedback</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {row.original.comment ? (
                            <p className="text-sm">{row.original.comment}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No additional comments provided.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-muted-foreground">Loading student records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 rounded-lg border border-red-200 text-red-600">
        {error}
        <Button 
          variant="ghost" 
          className="ml-4 text-red-600 hover:bg-red-100"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!student_records || student_records.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No records found</h3>
          <p className="text-muted-foreground">
            There are no exam records available for {student_name}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto space-y-6">
      

      {/* Records Table */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Exam Records for {student_name}</h2>
        <p className="text-sm text-muted-foreground">
          Detailed view of all exam scores and feedback
        </p>
      </div>
      
      <DataTable 
        columns={RecordColumns} 
        data={student_records} 
        className="border rounded-lg"
      />
    </div>
  );
}