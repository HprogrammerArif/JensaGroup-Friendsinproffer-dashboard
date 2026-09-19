import React, { useState } from "react";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import {
  useShowAreaListQuery,
  useFilterByAreaDataQuery,
  useCreateTeamMessageMutation,
  useShowMessageHistoryQuery,
} from "../../Redux/feature/baseApi";

function Team_messaging() {
  const [selectedCleaners, setSelectedCleaners] = useState([]);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState("");
  const [messageText, setMessageText] = useState("");

  const { data: areaListData, isLoading: isAreaLoading } = useShowAreaListQuery();
  const { data: usersData, isLoading: isUsersLoading } = useFilterByAreaDataQuery(
    { id: selectedAreaFilter },
    { skip: !selectedAreaFilter }
  );
  const { data: historyData, isLoading: isHistoryLoading } = useShowMessageHistoryQuery();
  const [createTeamMessage, { isLoading: isSending }] = useCreateTeamMessageMutation();

  const areaList = areaListData?.results || [];
  const filteredUsers = usersData?.results || [];
  const messageHistory = historyData?.results || [];

  const handleSelectCleaner = (cleaner) => {
    if (!selectedCleaners.find((c) => c.id === cleaner.id)) {
      setSelectedCleaners([...selectedCleaners, cleaner]);
    } else {
      setSelectedCleaners(selectedCleaners.filter((c) => c.id !== cleaner.id));
    }
  };

  const handleRemoveCleaner = (cleanerId) => {
    setSelectedCleaners(selectedCleaners.filter((c) => c.id !== cleanerId));
  };

  const handleUnselectAll = () => {
    setSelectedCleaners([]);
  };

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedCleaners.length > 0) {
      try {
        const payload = {
          content: messageText,
          receivers: selectedCleaners.map((c) => c.id),
        };
        await createTeamMessage(payload).unwrap();
        toast.success("Message sent successfully!");
        setMessageText("");
        setSelectedCleaners([]);
      } catch (error) {
        toast.error(error?.data?.message || "Failed to send message!");
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-5 bg-white border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 m-0">Team Messaging</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Send messages to cleaners - appears on their dashboards</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-10">
        {/* Main Content Section */}
        <div className="flex-1 min-w-0">
          {/* Compose Message */}
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 border border-gray-100 shadow-xs">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 m-0">Compose Message</h2>
            </div>

            {/* Select Cleaners */}
            <div className="mb-6">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <label className="text-sm font-medium text-gray-700">Select Cleaners *</label>
                {selectedCleaners.length > 0 && (
                  <button
                    type="button"
                    onClick={handleUnselectAll}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Unselect All ({selectedCleaners.length})
                  </button>
                )}
              </div>

              {/* Selected Cleaners Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                {selectedCleaners.length > 0 ? (
                  selectedCleaners.map((cleaner) => {
                    const cleanerName = cleaner.user_profile?.full_name || cleaner.phone_or_email;
                    const areaName = cleaner.assined_area_data?.[0]?.name || cleaner.role;
                    return (
                      <div
                        key={cleaner.id}
                        className="flex items-center gap-2 bg-white p-2.5 sm:p-3 rounded-lg border border-gray-100 shadow-xs min-w-0"
                      >
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => handleRemoveCleaner(cleaner.id)}
                          className="w-4 h-4 cursor-pointer flex-shrink-0"
                        />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex-shrink-0 flex items-center justify-center text-xs font-bold uppercase">
                          {cleanerName?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{cleanerName}</p>
                          <p className="text-[11px] sm:text-xs text-gray-600 truncate">{areaName}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="col-span-1 sm:col-span-2 md:col-span-3 text-xs sm:text-sm text-gray-600 text-center py-6">
                    No cleaners selected
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-600 text-sm resize-none"
                rows="5"
              />
            </div>

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!messageText.trim() || selectedCleaners.length === 0 || isSending}
              className="w-full sm:w-auto px-6 sm:px-10 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              {isSending ? "Sending..." : "📨 Send Message"}
            </button>
          </div>

          {/* Message History */}
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-100 shadow-xs">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Message History</h2>
            <div className="space-y-4">
              {isHistoryLoading ? (
                <p className="text-xs sm:text-sm text-gray-600">Loading history...</p>
              ) : messageHistory.length > 0 ? (
                messageHistory.map((msg) => {
                  const receiversText = msg.receiver_details?.map(r => r.user?.split(" ")[0]).join(", ") || "No receivers";
                  const createdAt = new Date(msg.created_at);
                  const dateStr = createdAt.toLocaleDateString("en-GB");
                  const timeStr = createdAt.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div key={msg.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Avatars */}
                        <div className="flex -space-x-2 flex-shrink-0 mt-0.5">
                          {msg.receiver_details?.slice(0, 3).map((receiver, idx) => {
                            const initial = receiver.user?.[0]?.toUpperCase() || 'U';
                            return (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white uppercase"
                              >
                                {initial}
                              </div>
                            );
                          })}
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">{receiversText}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{msg.content}</p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right whitespace-nowrap flex sm:flex-col justify-between sm:justify-start items-center sm:items-end text-xs text-gray-500 pl-11 sm:pl-0 flex-shrink-0">
                        <span>{dateStr}</span>
                        <span className="sm:mt-0.5">{timeStr}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs sm:text-sm text-gray-600">No message history</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - All Cleaners Sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-100 shadow-xs">
            {/* Area Dropdown */}
            <div className="mb-4 sm:mb-6">
              <select
                value={selectedAreaFilter}
                onChange={(e) => setSelectedAreaFilter(e.target.value)}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-600 text-sm text-gray-700 bg-white cursor-pointer"
              >
                <option value="">Select Area</option>
                {areaList.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            {/* All Cleaners Section */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-5 h-5 flex items-center justify-center text-base">👥</div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base m-0">Users in Area</h3>
            </div>

            <div className="space-y-2.5 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto pr-1">
              {!selectedAreaFilter ? (
                <p className="text-xs sm:text-sm text-gray-600 text-center py-6">Please select an area to see users</p>
              ) : isUsersLoading ? (
                <p className="text-xs sm:text-sm text-gray-600 text-center py-6">Loading users...</p>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((cleaner) => {
                  const cleanerName = cleaner.user_profile?.full_name || cleaner.phone_or_email;
                  const areaName = cleaner.assined_area_data?.[0]?.name || cleaner.role;
                  return (
                    <div
                      key={cleaner.id}
                      className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition border border-gray-100"
                      onClick={() => handleSelectCleaner(cleaner)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCleaners.some((c) => c.id === cleaner.id)}
                        onChange={() => {}} 
                        className="w-4 h-4 cursor-pointer flex-shrink-0"
                      />
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 uppercase">
                        {cleanerName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{cleanerName}</p>
                        <p className="text-[11px] sm:text-xs text-gray-600 truncate">{areaName}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs sm:text-sm text-gray-600 text-center py-6">No users in this area</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team_messaging;
