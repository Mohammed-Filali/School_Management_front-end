import { FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaBook } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center px-4 transition-all">
      {/* Header with animation */}
      <motion.header
  className="relative w-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white py-10 text-center shadow-lg rounded-b-3xl"
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* Floating Blur Effect */}
  <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-b-3xl"></div>

  <div className="relative z-10">
    <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-md">
      School Manager
    </h1>
    <p className="text-lg mt-3 font-medium opacity-90">
      Smart, seamless, and efficient school management
    </p>

    {/* Call-to-Action Button */}
    <Link to={'/login'}>
        <motion.button
          className="mt-6 px-6 py-3 bg-white text-blue-600 dark:text-gray-900 font-semibold rounded-full shadow-md hover:bg-blue-100 dark:hover:bg-gray-700 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >


          Get Started
        </motion.button>
    </Link>
  </div>
</motion.header>


      {/* Features with animation */}
      <motion.main
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FeatureCard
          icon={<FaChalkboardTeacher className="text-4xl text-blue-600 dark:text-blue-400" />}
          title="Manage Teachers"
          description="Keep track of your teachers' schedules, subjects, and attendance."
        />
        <FeatureCard
          icon={<FaUserGraduate className="text-4xl text-green-600 dark:text-green-400" />}
          title="Student Records"
          description="Easily manage student data, grades, and performance reports."
        />
        <FeatureCard
          icon={<FaCalendarAlt className="text-4xl text-orange-600 dark:text-orange-400" />}
          title="Class Schedules"
          description="Plan and organize class schedules for a seamless learning experience."
        />
        <FeatureCard
          icon={<FaBook className="text-4xl text-purple-600 dark:text-purple-400" />}
          title="Course Management"
          description="Manage courses, assign materials, and monitor progress effortlessly."
        />
      </motion.main>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4 transition-all"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">{icon}</div>
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </motion.div>
);
