import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function SupportAgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});
   const [filteredTickets, setFilteredTickets] = useState([]);
  // Search state
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // const [searchAssignedTo, setSearchAssignedTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fetchTickets = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No userId in localStorage");
        return;
      }
      const res = await axios.get(`http://localhost:8080/api/tickets/assigned/${userId}`);
      setTickets(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchComments = async (ticketId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/comments/ticket/${ticketId}`);
      setComments((prev) => ({ ...prev, [ticketId]: res.data }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async (ticketId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!newComment[ticketId] || newComment[ticketId].trim() === "") {
        alert("Comment cannot be empty");
        return;
      }
      await axios.post("http://localhost:8080/api/comments", {
        ticketId: ticketId,
        author: userId,
        message: newComment[ticketId]
      });
      setNewComment((prev) => ({ ...prev, [ticketId]: "" }));
      fetchComments(ticketId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const updateStatus = async (ticketId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/tickets/${ticketId}/status`,
        {},
        { params: { status } }
      );
      fetchTickets();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const toggleComments = (ticketId) => {
    setShowComments((prev) => {
      const newState = { ...prev, [ticketId]: !prev[ticketId] };
      if (!prev[ticketId]) {
        fetchComments(ticketId);
      }
      return newState;
    });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter tickets
  const filterTickets = () => {
    let filtered = [...tickets];

    // Dropdown filters
    if (priorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    // if (assignedAgentFilter) {
    //   filtered = filtered.filter(ticket => String(ticket.assignedToId) === assignedAgentFilter);
    // }

    // Search bar filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.priority.toLowerCase().includes(query) ||
        ticket.status.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query)
      );
    }

    setFilteredTickets(filtered);
  };

  useEffect(() => {
    filterTickets();
  }, [priorityFilter, statusFilter, searchQuery, tickets]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Support Agent Dashboard
        </h1>

        {/* Search Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          {/* <input
            type="text"
            placeholder="Search by AssignedTo ID"
            value={searchAssignedTo}
            onChange={(e) => setSearchAssignedTo(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          /> */}

         {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by priority, status, or agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded flex-1"
          />
        </div>

        {filteredTickets && filteredTickets.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Priority</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Assigned To</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Change Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{ticket.id}</td>
                    <td className="px-4 py-2">{ticket.title}</td>
                    <td className="px-4 py-2">{ticket.priority}</td>
                    <td className="px-4 py-2">{ticket.assignedTo}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-blue-300"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleComments(ticket.id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {showComments[ticket.id] ? "Hide" : "View"} Comments
                      </button>

                      {showComments[ticket.id] && (
                        <div className="mt-2 p-3 bg-gray-50 border rounded">
                          {comments[ticket.id] && comments[ticket.id].length > 0 ? (
                            <ul className="space-y-1">
                              {comments[ticket.id].map((c) => (
                                <li key={c.id} className="text-sm">
                                  <b className="text-gray-800">{c.author}</b>:{" "}
                                  <span className="text-gray-600">{c.message}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No comments yet.</p>
                          )}

                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              value={newComment[ticket.id] || ""}
                              onChange={(e) =>
                                setNewComment((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                              }
                              placeholder="Add a comment..."
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-blue-300"
                            />
                            <button
                              onClick={() => addComment(ticket.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No tickets match your search</p>
        )}
      </div>
    </div>
  );
}
