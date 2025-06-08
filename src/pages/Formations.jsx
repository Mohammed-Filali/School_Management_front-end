import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { AxiosClient } from "../api/axios";

Modal.setAppElement('#root');

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardHover = {
  hover: { 
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  }
};

export default function Formations() {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);

  const handleDetailsClick = (type) => {
    setSelectedType(type);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [typesRes] = await Promise.all([
          AxiosClient.get('/api/classeTypes'),
        ]);
        setTypes(typesRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const CoursFiltre = (cour, id) => {
    const filteredCourse = cour.filter((course) => course.id === id);
    
    if (filteredCourse.length === 0) {
      return (
        <div className="mt-2 p-2 bg-red-50 rounded-md">
          <p className="text-red-500">Course details not available</p>
        </div>
      );
    }

    const course = filteredCourse[0];
    return (
      <div className="mt-2 p-4 bg-gray-50 rounded-md">
        <p className="font-semibold text-gray-700">{course.name}</p>
        <p className="text-gray-600 mt-1">{course.desc || "No description provided"}</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Formations</h1>
        <p className="text-lg text-gray-600">
          Explore our comprehensive training programs designed to help you achieve your goals
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {types.map((type) => (
          <motion.div
            key={type.id}
            variants={fadeIn}
            whileHover="hover"
            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700 text-white"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={type.image ? `${import.meta.env.VITE_BACKEND_URL}/storage/${type.image}` : '/placeholder-education.jpg'}
                alt={type.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {type.code}
              </span>
            </div>
            
            <div className="p-6 dark:bg-gray-800 text-white rounded-b-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">{type.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2 dark:text-white">
                {type.description || "No description available"}
              </p>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleDetailsClick(type)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <Modal
  isOpen={!!selectedType}
  onRequestClose={() => setSelectedType(null)}
  contentLabel="Formation Details"
  className="modal-content bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto my-12 outline-none max-h-[90vh] "
  overlayClassName="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  closeTimeoutMS={300}
>
  {selectedType && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-8 dark:bg-gray-800 text-white rounded-xl"
    >
      <div className="flex justify-between items-start mb-6 dark:bg-gray-800 text-white rounded-xl">
        <div >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedType.name}</h2>
          <p className="text-blue-600 font-medium">{selectedType.code}</p>
        </div>
        <button
          onClick={() => setSelectedType(null)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-8 dark:bg-gray-800 text-white rounded-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Description</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {selectedType.description || "No detailed description available for this formation."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto pr-2 dark:bg-gray-800 text-white rounded-xl">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Classes</h3>
          {selectedType.classe?.length > 0 ? (
            <ul className="space-y-4 dark:bg-gray-800 text-white rounded-xl">
              {selectedType.classe.map((classe, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg dark:bg-gray-300 text-white rounded-xl shadow shadow-gray-200">
                  <h4 className="font-medium text-gray-800">{classe.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Code: {classe.code}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No classes available for this formation type.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Cours</h3>
          {selectedType.class_type_courses?.length > 0 ? (
            <ul className="space-y-4">
              {selectedType.class_type_courses.map((item, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg dark:bg-gray-300 text-white rounded-xl shadow shadow-gray-200">
                  <h4 className="font-medium text-gray-800">
                    {item.course?.name || "Cours sans nom"}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Coefficient : {item.coef} — Masse horaire : {item.masseH}h
                  </p>
                  <p className="text-sm text-gray-500">
                    Description : {item.course?.desc || "Pas de description"}
                  </p>
                  <p className="text-sm text-gray-500">ID Enseignant : {item.teacher_id}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun cours associé à cette formation.</p>
          )}
        </div>
      </div>
    </motion.div>
  )}
</Modal>

    </div>
  );
}