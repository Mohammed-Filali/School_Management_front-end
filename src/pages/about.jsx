import { motion } from "framer-motion";
import about from '../assets/about.jpg' ;
import filali from '../assets/filali.jpg' ;
import zouhair from '../assets/zouhair.jpg' ;
import imran from '../assets/imran.jpg' ;





export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
      <header className="w-full bg-blue-600 dark:bg-blue-800 text-white py-6 text-center shadow-md">
        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Us
        </motion.h1>
      </header>

      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed mb-6">
            School Manager aims to provide a comprehensive solution for managing
            all aspects of a school. From tracking student progress to handling
            administrative tasks, our platform ensures smooth operations for
            schools of any size.
          </p>

          <div
            className="bg-cover bg-center h-60 rounded-lg mb-8"
            style={{
              backgroundImage: `url(${about})`,
            }}
          ></div>

          <h3 className="text-2xl font-semibold mb-4">Meet Our Team</h3>
          <p className="text-lg mb-6">
            We are a group of passionate professionals dedicated to improving
            the school management experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto bg-blue-100">
                <img
                  src={filali}
                  alt="Mohammed Filali"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h4 className="mt-4 text-xl font-semibold">Mohammed Filali</h4>
              <p className="text-sm text-gray-500">Admin and Director</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto bg-blue-100">
                <img
                  src={zouhair}
                  alt="Zouhair Herry"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h4 className="mt-4 text-xl font-semibold">Zouhair Herry</h4>
              <p className="text-sm text-gray-500">Grade 1</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto bg-blue-100">
                <img
                  src={imran}
                  alt="Imran Karam"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h4 className="mt-4 text-xl font-semibold">Imran Karam</h4>
              <p className="text-sm text-gray-500">Grade 2</p>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>© 2025 School Manager | All rights reserved</p>
      </footer>
    </div>
  );
}
