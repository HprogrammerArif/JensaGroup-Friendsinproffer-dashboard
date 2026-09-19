import React from 'react';
import { FiX, FiMapPin, FiInfo, FiAlertCircle, FiCamera, FiHome, FiUser } from 'react-icons/fi';

const IssueDetailsModal = ({ isOpen, onClose, issue }) => {
  if (!isOpen || !issue) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'processing': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending': return 'text-orange-600 bg-orange-100 border-orange-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  // Helper to construct image URL
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}${path}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-lg font-bold text-slate-800">Issue Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 custom-scrollbar">
          <div className="space-y-6">
            
            {/* Basic Info */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                   <h3 className="text-base font-semibold text-slate-800">
                    {issue.issue_type === 'rule_breaking' 
                      ? issue.violate_type?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Rule Violation'
                      : issue.description && issue.description !== 'no' ? issue.description : (issue.title || 'Maintenance Request')
                    }
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <FiHome className="h-4 w-4" />
                    {issue.apartment?.flat_number ? `Flat ${issue.apartment.flat_number}, ` : ''}
                    {issue.building?.name || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(issue.status)}`}>
                    {issue.status ? issue.status.charAt(0).toUpperCase() + issue.status.slice(1) : 'Unknown'}
                  </span>
                  {issue.priority && (
                     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                      {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
               <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <FiUser className="h-3.5 w-3.5" />
                    Issued By
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {issue.issued_by_data?.username || 'Unknown'}
                  </p>
               </div>
               <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <FiAlertCircle className="h-3.5 w-3.5" />
                    Issue Type
                  </p>
                  <p className="text-sm font-medium text-slate-800 capitalize">
                    {issue.issue_type ? issue.issue_type.replace('_', ' ') : 'N/A'}
                  </p>
               </div>
               <div className="col-span-2">
                 <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <FiMapPin className="h-3.5 w-3.5" />
                    Location Address
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {issue.building?.full_address || issue.building?.city || 'N/A'}
                  </p>
               </div>
               <div className="col-span-2">
                 <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <FiInfo className="h-3.5 w-3.5" />
                    Reported At
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(issue.created_at)}
                  </p>
               </div>
            </div>
            
            {/* Description */}
            {issue.description && issue.description !== 'no' && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-800">Description</h4>
                <p className="text-sm text-slate-600 rounded-lg bg-slate-50 p-3 border border-slate-100">
                  {issue.description}
                </p>
              </div>
            )}

            {/* Media */}
            {issue.photo_or_video && (
               <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <FiCamera className="h-4 w-4 text-slate-500" />
                  Attached Media
                </h4>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  {/* Using an img tag. If it's a video, a better approach might be needed, but this is a start */}
                  {issue.photo_or_video.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                     <img 
                       src={getImageUrl(issue.photo_or_video)} 
                       alt="Issue Attachment" 
                       className="w-full object-contain max-h-60" 
                       onError={(e) => { e.target.style.display = 'none'; }} 
                     />
                  ) : (
                     <div className="p-4 flex flex-col items-center justify-center">
                        <img 
                          src={getImageUrl(issue.photo_or_video)} 
                          alt="Issue Attachment" 
                          className="w-full object-contain max-h-60 mb-2" 
                          onError={(e) => { 
                            e.target.style.display = 'none'; 
                            // fallback logic if it's not an image that can be rendered normally
                          }} 
                        />
                        <a 
                           href={getImageUrl(issue.photo_or_video)} 
                           target="_blank" 
                           rel="noreferrer"
                           className="text-sm text-blue-600 hover:underline"
                        >
                           View Attachment
                        </a>
                     </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end">
           <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsModal;
