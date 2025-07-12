/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Search,
  Star,
  Users,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const availabilityOptions = ["All", "Available", "Busy", "Offline"];

function SwapRequestBadge() {
  const [pendingCount, setPendingCount] = useState(0);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (currentUserId) {
      fetchPendingCount();
    }
  }, [currentUserId]);

  const fetchPendingCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/swap-requests/received/${currentUserId}`
      );
      if (response.ok) {
        const requests = await response.json();
        const pending = requests.filter((r) => r.status === "pending").length;
        setPendingCount(pending);
      }
    } catch (err) {
      console.error("Error fetching pending count:", err);
    }
  };

  if (pendingCount === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {pendingCount}
    </span>
  );
}

// Chat Badge Component
function ChatBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (currentUserId) {
      fetchUnreadCount();
    }
  }, [currentUserId]);

  const fetchUnreadCount = async () => {
    try {
      // Get all active chats and sum up unread messages
      const response = await fetch(
        `http://localhost:4000/api/chat/user/${currentUserId}`
      );
      if (response.ok) {
        const chats = await response.json();
        const totalUnread = chats.reduce(
          (sum, chat) => sum + (chat.unread_count || 0),
          0
        );
        setUnreadCount(totalUnread);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  );
}

export default function SkillSwapUI() {
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (showDropdown && !event.target.closest(".availability-dropdown")) {
      setShowDropdown(false);
    }
    if (showProfileDropdown && !event.target.closest(".profile-dropdown")) {
      setShowProfileDropdown(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching users from API...");
      const response = await fetch("http://localhost:4000/api/dashboard/users");
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add event listener for clicking outside
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown, showProfileDropdown]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const currentUserId = localStorage.getItem("userId");
  console.log("Current user ID:", currentUserId);
  console.log("All users before filtering:", users);

  // Filter out the logged-in user from the users list
  const filteredUsers = users.filter((user) => {
    // First, exclude the current user
    if (user.id?.toString() === currentUserId) {
      console.log(
        "Filtering out current user:",
        user.name,
        "with ID:",
        user.id
      );
      return false;
    }

    // Then apply search filter
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      user.skillsWanted.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  console.log("Filtered users after removing current user:", filteredUsers);

  return (
    <div className="min-h-screen bg-white text-black transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                NEXUS
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-4">
              <button
                className="text-gray-600 hover:text-black transition-colors duration-200"
                onClick={() => navigate("/landing")}
              >
                Home
              </button>

              {/* Swap Requests Button - Show when logged in */}
              {localStorage.getItem("token") && (
                <button
                  className="text-gray-600 hover:text-black transition-colors duration-200 flex items-center gap-2 relative"
                  onClick={() => navigate("/swap-requests")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Swap Requests
                  <SwapRequestBadge />
                </button>
              )}

              {/* Chat Button - Show when logged in */}
              {localStorage.getItem("token") && (
                <button
                  className="text-gray-600 hover:text-black transition-colors duration-200 flex items-center gap-2 relative"
                  onClick={() => navigate("/chat-list")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Chats
                  <ChatBadge />
                </button>
              )}

              {/* Profile Icon - Show when logged in */}
              {localStorage.getItem("token") ? (
                <div className="relative profile-dropdown">
                  <button
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    title="My Profile"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 animate-in slide-in-from-top-2 duration-200">
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 first:rounded-t-xl"
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                      >
                        My Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 last:rounded-b-xl text-red-600"
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("userId");
                          setShowProfileDropdown(false);
                          console.log("Logged out!");
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`sm:hidden transition-all duration-300 overflow-hidden ${
              isMenuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 space-y-3 border-t border-gray-100">
              <button
                className="block w-full text-left text-gray-600 hover:text-black transition-colors duration-200"
                onClick={() => navigate("/landing")}
              >
                About Us
              </button>

              {/* Profile Icon - Show when logged in */}
              {localStorage.getItem("token") ? (
                <button
                  className="w-full bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => navigate("/profile")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Profile
                </button>
              ) : (
                <button
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all duration-200 w-full"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Exchange Skills,{" "}
            <span className="text-gray-600">Build Connections</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with talented individuals and trade your expertise for new
            skills
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Availability Filter */}
          <div className="relative availability-dropdown">
            <button
              className="w-full sm:w-auto border border-gray-200 px-6 py-3 rounded-full flex items-center justify-between gap-3 hover:border-gray-300 transition-all duration-200 bg-white"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="font-medium">{availabilityFilter}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 animate-in slide-in-from-top-2 duration-200">
                {availabilityOptions.map((option) => (
                  <button
                    key={option}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                    onClick={() => {
                      setAvailabilityFilter(option);
                      setShowDropdown(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search skills, names, or usernames..."
              className="w-full border border-gray-200 px-6 py-3 rounded-full pr-12 focus:outline-none focus:border-black transition-all duration-200 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            {loading ? (
              <p className="text-gray-600">Loading users...</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : (
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-black">
                  {filteredUsers.length}
                </span>{" "}
                skilled individuals
              </p>
            )}
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="text-gray-600 hover:text-black transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* User Cards */}
        <div className="space-y-6 mb-12">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load users</p>
              <button
                onClick={fetchUsers}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user, idx) => (
              <div
                key={idx}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => {
                  const token = localStorage.getItem("token");
                  const isLoggedIn = !!token;

                  if (!isLoggedIn) {
                    navigate("/login");
                  } else {
                    navigate("/profilerequest", {
                      state: {
                        selectedUser: user,
                      },
                    });
                  }
                }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold">
                      {user.avatar}
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{user.name}</h3>
                      <p className="text-gray-500">@{user.username}</p>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-green-700">
                          Offers:
                        </span>
                        {user.skillsOffered.map((skill, skillIdx) => (
                          <span
                            key={skillIdx}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-blue-700">
                          Wants:
                        </span>
                        {user.skillsWanted.map((skill, skillIdx) => (
                          <span
                            key={skillIdx}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(user.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {user.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      console.log("Button clicked!");
                      const token = localStorage.getItem("token");
                      console.log("Token:", token);
                      const isLoggedIn = !!token;
                      console.log("Is logged in:", isLoggedIn);

                      if (!isLoggedIn) {
                        console.log("Redirecting to login...");
                        navigate("/login");
                      } else {
                        console.log(
                          "User is logged in, proceeding with swap request"
                        );
                        // Navigate to profile requester page with user data
                        navigate("/profilerequest", {
                          state: {
                            selectedUser: user,
                          },
                        });
                      }
                    }}
                  >
                    Request Swap
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Nexus Platform. Connect. Learn. Grow.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
