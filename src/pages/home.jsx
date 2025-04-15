import { FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaBook, FaSchool } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardHover = {
  hover: { 
    y: -10,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  }
};

export default function Home() {
  const features = [
    {
      icon: <FaChalkboardTeacher className="text-4xl" />,
      title: "Manage Teachers",
      description: "Comprehensive tools for tracking schedules, subjects, and professional development.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaUserGraduate className="text-4xl" />,
      title: "Student Records",
      description: "Complete student profiles with academic history, behavior tracking, and parent communication.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaCalendarAlt className="text-4xl" />,
      title: "Class Schedules",
      description: "Intuitive scheduling with conflict detection and automatic timetable generation.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <FaBook className="text-4xl" />,
      title: "Course Management",
      description: "Curriculum planning, resource allocation, and learning outcome tracking.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all">
      {/* Hero Section */}
      <motion.header
        className="relative w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 py-20 px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block p-3 mb-6 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-sm">
              <FaSchool className="text-4xl text-blue-500" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-500 drop-shadow-lg">
              School Manager Pro
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-blue-500  max-w-3xl mx-auto">
              Transform your educational institution with our comprehensive management platform
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <motion.button
                  className="px-8 py-3 bg-white text-blue-600 dark:text-blue-800 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  className="px-8 py-3 bg-transparent border-2 border-white text-blue-500  font-semibold rounded-full hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  About Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Features Section */}
      <motion.main
        className="py-16 px-6 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div 
          className="text-center mb-16"
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to efficiently manage your school operations in one integrated platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover="hover"
              variants={cardHover}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative p-8">
                <div className={`w-16 h-16 mb-6 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>

      {/* Testimonial/CTA Section */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <FaSchool className="text-5xl mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join hundreds of schools transforming their administration
          </h2>
          <p className="text-xl mb-8 opacity-90">
            "School Manager Pro has reduced our administrative workload by 60% while improving communication across our entire institution."
          </p>
          <Link to="/login">
            <motion.button
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Free Trial
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}