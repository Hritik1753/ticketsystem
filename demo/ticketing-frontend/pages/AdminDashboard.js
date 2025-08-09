import { useState, useEffect } from "react";
import axios from "axios";
import EditUserModal from "./components/EditUserModal";
import Navbar from "./Navbar";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [users, setUsers] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedAgentFilter, setAssignedAgentFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // NEW SEARCH BAR

  const fetchData = async () => {
    try {
      const ticketsRes = await axios.get("http://localhost:8080/api/tickets");
      const usersRes = await axios.get("http://localhost:8080/api/users");
      setUsers(usersRes.data);
      setTickets(ticketsRes.data);
      setFilteredTickets(ticketsRes.data);
      setAgents(usersRes.data.filter((u) => u.role === "SUPPORT_AGENT"));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Dropdown filters
    if (priorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    if (assignedAgentFilter) {
      filtered = filtered.filter(ticket => String(ticket.assignedToId) === assignedAgentFilter);
    }

    // Search bar filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.priority.toLowerCase().includes(query) ||
        ticket.status.toLowerCase().includes(query) ||
        String(ticket.assignedToId || "").toLowerCase().includes(query) ||
        agents.find(agent => agent.id === ticket.assignedToId)?.name?.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query)
      );
    }

    setFilteredTickets(filtered);
  };

  useEffect(() => {
    filterTickets();
  }, [priorityFilter, statusFilter, assignedAgentFilter, searchQuery, tickets]);

  const fetchComments = async (ticketId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/comments/ticket/${ticketId}`
      );
      setComments((prev) => ({ ...prev, [ticketId]: res.data }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async (ticketId) => {
    try {
      await axios.post("http://localhost:8080/api/comments", {
        ticketId,
        author: 1,
        message: newComment[ticketId] || "",
      });
      setNewComment((prev) => ({ ...prev, [ticketId]: "" }));
      fetchComments(ticketId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const assignTicket = async (ticketId, agentId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/tickets/${ticketId}/assign/${agentId}`
      );
      fetchData();
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const updateStatus = async (ticketId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/tickets/${ticketId}/status`,
        {},
        { params: { status } }
      );
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tickets/${ticketId}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6 bg-white p-4 rounded shadow flex-wrap">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Status</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          {/* Assigned Agent Filter */}
          <select
            value={assignedAgentFilter}
            onChange={(e) => setAssignedAgentFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Agents</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by priority, status, or agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded flex-1"
          />
        </div>

        {/* Tickets Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <h2 className="text-xl font-semibold p-4 border-b">Tickets</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Assigned To</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Creator</th>
                  <th className="p-3 text-left">Assign</th>
                  <th className="p-3 text-left">Change Status</th>
                  <th className="p-3 text-left">Comments</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{ticket.title}</td>
                    <td className="p-3">{ticket.priority}</td>
                    <td className="p-3">
                      {agents.find(a => a.id === ticket.assignedToId)?.name || "Unassigned"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-white text-sm ${
                          ticket.status === "OPEN"
                            ? "bg-green-500"
                            : ticket.status === "IN_PROGRESS"
                            ? "bg-yellow-500"
                            : ticket.status === "RESOLVED"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3">{ticket.userId}</td>
                    <td className="p-3">
                      <select
                        onChange={(e) => assignTicket(ticket.id, e.target.value)}
                        defaultValue=""
                        className="border rounded px-2 py-1"
                      >
                        <option value="">Select Agent</option>
                        {agents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => fetchComments(ticket.id)}
                        className="text-blue-500 hover:underline mb-2"
                      >
                        View
                      </button>
                      <div className="space-y-1">
                        {comments[ticket.id]?.map((c) => (
                          <p key={c.id} className="text-sm">
                            <strong>{c.author}</strong>: {c.message}
                          </p>
                        ))}
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            placeholder="Add comment"
                            value={newComment[ticket.id] || ""}
                            onChange={(e) =>
                              setNewComment((prev) => ({
                                ...prev,
                                [ticket.id]: e.target.value,
                              }))
                            }
                            className="border rounded px-2 py-1 flex-1"
                          />
                          <button
                            onClick={() => addComment(ticket.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteTicket(ticket.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
