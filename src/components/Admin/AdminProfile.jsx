import * as Avatar from "@radix-ui/react-avatar";
import { UseUserContext } from "../../context/StudentContext";
import UpdatePasswordForm from "../UpdatePasswordForm";
import { AdminApi } from "../../service/api/student/admins/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Calendar, Home, Droplet, Clock } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function AdminProfile() {
  const { user } = UseUserContext();

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No user data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar.Root className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
               
                <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-800 text-4xl font-bold">
                  {user.firsName?.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>

              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  {user.firsName} {user.lastName}
                </h2>
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                  <p>{user.email}</p>
                </div>
                <Badge variant="secondary" className="mt-2">
                  Admin
                </Badge>
              </div>
            </div>
          </CardHeader>

          <Separator className="mb-4" />

          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4" />
                <span className="font-medium">Gender</span>
              </div>
              <span>{user.gender === "m" ? "Male" : "Female"}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Date of Birth</span>
              </div>
              <span>{new Date(user.date_of_birth).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-700">
                <Home className="h-4 w-4" />
                <span className="font-medium">Address</span>
              </div>
              <span
                className="text-right max-w-[180px] truncate"
                title={user.adress}
              >
                {user.adress}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-700">
                <Droplet className="h-4 w-4" />
                <span className="font-medium">Blood Type</span>
              </div>
              <Badge variant="destructive">{user.blood_Type || "Unknown"}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Last Updated</span>
              </div>
              <span>{new Date(user.updated_at).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Password Update Card */}
        <Card>
          <CardHeader>
            <CardTitle>Update Password</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm
              onSubmitHandler={(values) => AdminApi.update_Password(values)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
