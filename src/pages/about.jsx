import { motion } from "framer-motion";
import about from '../assets/about.jpg';
import filali from '../assets/filali.jpg';
import zouhair from '../assets/zouhair.jpg';
import imran from '../assets/imran.jpg';

const teamMembers = [
  {
    name: "Mohammed Filali",
    role: "Admin and Director",
    image: filali,
    description: "With over 15 years of experience in education management, Mohammed leads our team with vision and dedication."
  },
  {
    name: "Zouhair Herry",
    role: "Grade 1 Specialist",
    image: zouhair,
    description: "Early education expert focused on creating engaging learning experiences for young students."
  },
  {
    name: "Imran Karam",
    role: "Grade 2 Specialist",
    image: imran,
    description: "Curriculum developer passionate about innovative teaching methods and student success."
  }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <motion.header 
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white py-20 text-center shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About Our School
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Empowering education through innovation, dedication, and excellence
          </motion.p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Mission Section */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="flex flex-col lg:flex-row gap-12 items-center mb-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Our Mission</h2>
              <p className="text-lg leading-relaxed mb-6">
                At School Manager, we're revolutionizing education management by providing comprehensive solutions that streamline operations, enhance learning experiences, and foster academic excellence.
              </p>
              <p className="text-lg leading-relaxed">
                Our platform is designed to meet the needs of modern educational institutions, offering tools for student progress tracking, administrative efficiency, and seamless communication between all stakeholders.
              </p>
            </div>
            <div className="lg:w-1/2">
              <motion.div
                className="rounded-xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={about}
                  alt="Students learning in classroom"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div variants={fadeIn} className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3">Academic Excellence</h3>
              <p>We maintain the highest standards of education through rigorous curriculum and continuous improvement.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p>Embracing cutting-edge technology and teaching methodologies to prepare students for the future.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p>Building strong relationships between students, parents, teachers, and the wider community.</p>
            </div>
          </motion.div>
        </motion.section>

        {/* Team Section */}
        <motion.section 
          className="py-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Meet Our Team</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Our dedicated team of education professionals brings together decades of experience and passion for student success.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="py-16 my-12 bg-blue-600 dark:bg-blue-800 rounded-xl text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-xl">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-xl">Dedicated Staff</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl">Students Impacted</div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">School Manager</h3>
              <p className="text-gray-400">Transforming education through technology</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} School Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}