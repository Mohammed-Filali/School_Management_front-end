import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Separator } from "@radix-ui/react-dropdown-menu";
import StudentRecordsList from "./StudentRecordssliste.jsx";
import { UseUserContext } from "../../../context/StudentContext.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import "./StudentRecordsPage.css"; // Create this CSS file for custom styles

export default function StudentManageRecords() {
  const { user } = UseUserContext();

  return (
    <div className="student-records-container">
      <Card className="records-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">My Academic Records</h2>
              <p className="text-sm text-muted-foreground">
                {user?.classe?.name ? `${user.classe.name} Class Records` : "Your academic history"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Date Filter
                </span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="records" className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2 mb-4">
              <TabsTrigger value="records">
                Records
                
              </TabsTrigger>
              <TabsTrigger value="grades">
                Grades
                
              </TabsTrigger>
             
            </TabsList>

            <div className="relative mb-4">
              <div className="flex items-center">
                <Input
                  placeholder="Search records..."
                  className="w-full sm:w-64"
                />
                <Button variant="outline" className="ml-2">
                  Search
                </Button>
              </div>
            </div>

            <TabsContent value="records" className="border-none p-0 outline-none">
              <div className="space-y-4">
                <StudentRecordsList />
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Showing 1 to 10 of 12 records
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="grades" className="border-none p-0 outline-none">
              <div className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">Grades data coming soon</p>
              </div>
            </TabsContent>

            
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}