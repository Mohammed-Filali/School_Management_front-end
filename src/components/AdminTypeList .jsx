import React, { useState } from 'react';
import ClasseDetailsModal from './ClasseDetailsModal';  // Adjust the path as needed

const AdminTypeList = ({ classe }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* Button to open the modal */}
      <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded">
        View Details
      </button>

      {/* Modal for displaying details */}
      <ClasseDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        classe={classe}
      />
    </div>
  );
};

export default AdminTypeList;
