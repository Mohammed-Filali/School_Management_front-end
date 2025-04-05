import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "react-modal"; // Assuming you have a modal component
import { AxiosClient } from "../api/axios";

Modal.setAppElement('#root');  // This is necessary for accessibility when using React Modal

export default function Formations() {
  const [types, setTypes] = useState([]);
  const [cours, setCours] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);

  const handleDetailsClick = (type) => {
    setSelectedType(type);  // Open the modal and show the selected type
  };

  useEffect(() => {
    AxiosClient.get('/api/classeTypes')
      .then((res) => {
        setTypes(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
      AxiosClient.get('/api/cours')
      .then((res) => {
        setCours(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const CoursFiltre = (cour, id) => {
    // Filter the courses based on the provided id
    const filteredCourse = cour.filter((course) => course.id === id);

    // If no course is found, return an error message or handle it gracefully
    if (filteredCourse.length === 0) {
      return <p className="mt-2 text-red-500">Course not found.</p>;
    }

    const course = filteredCourse[0]; // Get the first course from the filtered array

    return (
      <>
        <p className="mt-2 text-l font-bold  text-gray-500">{course.name}</p>
        <p className="mt-2 text-gray-500">Description: {course.desc}</p>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Types of Formations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={type.image ? `${import.meta.env.VITE_BACKEND_URL}/storage/${type.image}` : '/path/to/default-image.jpg'}
              alt={type.name}
              loading="lazy"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{type.name}</h3>
              <p className="text-gray-600 mt-2">{type.description || "No description"}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">{type.code}</span>
                <button
                  onClick={() => handleDetailsClick(type)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors duration-300"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying details */}
      {selectedType && (
        <Modal
          isOpen={true}
          onRequestClose={() => setSelectedType(null)}
          contentLabel="Classe Details"
          className="bg-white p-6 rounded-lg max-w-2xl mx-auto shadow-lg"
        >
          <h3 className="text-2xl font-bold">{selectedType.name}</h3>
          <p className="mt-4">{selectedType.description || "No description available."}</p>
          <p className="mt-2 text-gray-500">Code: {selectedType.code}</p>
          <h5 className="text-xl font-bold">Classes:</h5>

          {
            selectedType.classe?.map((classe)=>{
                return <>

                        <h5 className="mt-2 text-l font-bold  text-gray-500">{classe.name}</h5>

                              <p className="mt-2 text-gray-500">Class Code: {classe.code}</p>

                </>
            })

          }
                                            <h5 className="text-xl font-bold">Cours:</h5>

{
                        selectedType.classe_type_course?.map((cour)=>{
                            return <>

                                    <h5 className="text-l font-bold">{cour.name}</h5>
                                    {CoursFiltre(cours,cour.course_id)}

                                          <p className="mt-2 text-gray-500"> Coef: {cour.coef}</p>

                            </>
                        })

          }

          <div className="mt-4">
            <button
              onClick={() => setSelectedType(null)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
