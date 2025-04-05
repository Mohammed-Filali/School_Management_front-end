import React from 'react';
import { Dialog } from '@headlessui/react';  // Using Headless UI for modal
import { useState } from 'react';

const ClasseDetailsModal = ({ isOpen, onClose, classe }) => {
  if (!classe) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-lg w-full">
          <Dialog.Title className="text-xl font-bold">Class Details</Dialog.Title>

          {/* Displaying the classe details */}
          <div className="mt-4">
            <div>
              <strong>Name:</strong> <span>{classe.name}</span>
            </div>
            <div>
              <strong>Code:</strong> <span>{classe.code}</span>
            </div>
            <div>
              <strong>Class Type ID:</strong> <span>{classe.class_type_id}</span>
            </div>
            <div>
              <strong>Description:</strong> <span>{classe.description || 'No description'}</span>
            </div>
            <div>
              <strong>Image:</strong> <span>{classe.image || 'No image available'}</span>
            </div>
            <div>
              <strong>Created At:</strong> <span>{classe.created_at || 'Not available'}</span>
            </div>
            <div>
              <strong>Updated At:</strong> <span>{classe.updated_at || 'Not available'}</span>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ClasseDetailsModal;
