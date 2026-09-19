import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <FiAlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-800">{title || 'Confirm Deletion'}</h3>
          <p className="text-sm text-slate-500">
            {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
          </p>
        </div>
        <div className="flex gap-3 bg-slate-50 p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition"
          >
            Sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
