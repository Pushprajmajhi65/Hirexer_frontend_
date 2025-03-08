import React, { useState, useEffect } from "react";
import { db, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "../firebase"; // Adjust the import path as necessary
import Fuse from "fuse.js";



const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]); // All users fetched from the API
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users based on search

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Simulating data fetching delay
    }, 2000);
  }, []);

  // Fetch all users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Retrieve the access token from local storage
        const token = localStorage.getItem("access_token");
  
        // Check if the token is available
        if (!token) {
          console.error("No access token found");
          return;
        }
  
        const response = await fetch("http://127.0.0.1:8000/users/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,  // Include the token in the header
            "Content-Type": "application/json",  // Ensure content type is JSON
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
  
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Initialize filteredUsers with all users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);

  // Fuzzy search implementation
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users); // Reset to all users if search query is empty
      return;
    }

    const fuse = new Fuse(users, {
      keys: ["username"], // Search by username
      threshold: 0.3, // Adjust threshold for more/less strict matching
    });

    const results = fuse.search(searchQuery).map((result) => result.item);
    setFilteredUsers(results.slice(0, 5)); // Limit to top 5 matches
  }, [searchQuery, users]);

  // Fetch messages from Firestore
  useEffect(() => {
    if (selectedUser) {
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, orderBy("timestamp"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesList = [];
        snapshot.forEach((doc) => {
          messagesList.push({ id: doc.id, ...doc.data() });
        });
        setMessages(messagesList);
      });

      return () => unsubscribe();
    }
  }, [selectedUser]);

  // Send message to Firestore
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      sender_id: "your_user_id", // Replace with the actual sender ID
      receiver_id: selectedUser.id,
      timestamp: serverTimestamp(),
      seen: false,
    });

    setNewMessage("");
  };

  const renderSkeleton = () => (
    <div className="flex h-screen bg-white">
      <div className="fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto w-3/4 lg:w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-semibold mb-4 animate-pulse bg-gray-300 h-6 w-3/4 rounded"></h2>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded-lg bg-gray-300 animate-pulse"
          aria-label="Search users"
        />
        <ul>
          <li className="p-2 cursor-pointer rounded-lg mb-2 bg-gray-300 animate-pulse h-8"></li>
          <li className="p-2 cursor-pointer rounded-lg mb-2 bg-gray-300 animate-pulse h-8"></li>
          <li className="p-2 cursor-pointer rounded-lg mb-2 bg-gray-300 animate-pulse h-8"></li>
        </ul>
      </div>

      <div className="w-full lg:w-3/4 flex flex-col">
        <div className="p-4 bg-gray-300 animate-pulse text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <button className="lg:hidden mr-2 p-2 rounded-full bg-gray-200 animate-pulse" aria-label="Toggle sidebar">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <span className="animate-pulse bg-gray-300 h-6 w-1/2 rounded"></span>
          </div>
          <div className="lg:hidden flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          <div className="flex justify-start">
            <div className="p-3 max-w-[70%] rounded-lg bg-gray-300 animate-pulse h-10"></div>
          </div>
          <div className="flex justify-end">
            <div className="p-3 max-w-[70%] rounded-lg bg-gray-300 animate-pulse h-10"></div>
          </div>
        </div>

        <div className="p-4 border-t bg-white flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg bg-gray-300 animate-pulse"
            aria-label="Type a message"
          />
          <button className="bg-gray-300 text-white px-4 py-2 rounded-lg animate-pulse"></button>
        </div>
      </div>
    </div>
  );

  return isLoading ? (
    renderSkeleton()
  ) : (
    <div className="flex h-screen">
      {/* Sidebar with Users (Floating Overlay on Mobile) */}
      <div
        className={`fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto w-3/4 lg:w-1/4 bg-gray-100 p-4 border-r transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <ul>
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                setIsSidebarOpen(false); // Close sidebar on mobile after selecting a user
              }}
              className={`p-2 cursor-pointer rounded-lg mb-2 ${
                selectedUser?.id === user.id
                  ? "bg-[#57ACB2] text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="w-full lg:w-3/4 flex flex-col">
        {/* Chat Header (with Toggle Button for Mobile) */}
        <div className="p-4 bg-[#57ACB2] text-white text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center">
            {/* Toggle Button for Mobile */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden mr-2 p-2 rounded-full bg-white text-[#57ACB2]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <span>Chat with {selectedUser?.username}</span>
          </div>
          {/* Circular Avatar for Mobile */}
          <div className="lg:hidden flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {selectedUser?.username.charAt(0)}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_id === "your_user_id" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 max-w-[70%] rounded-lg ${
                    msg.sender_id === "your_user_id" ? "bg-[#57ACB2] text-white" : "bg-gray-200"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Field */}
        <div className="p-4 border-t bg-white flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
          />
          <button onClick={sendMessage} className="bg-[#57ACB2] text-white px-4 py-2 rounded-lg">
            Send
          </button>
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ChatApp;