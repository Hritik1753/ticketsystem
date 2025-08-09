import { useState, useEffect } from "react";
import CreateTicketModal from "./components/CreateTicketModal";
import axios from "axios";
import Navbar from "./Navbar";

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 New state for search

  const fetchTickets = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No userId in localStorage");
        return;
      }
      const res = await axios.get(`http://localhost:8080/api/tickets/user/${userId}`);
      setTickets(res.data);
      res.data.forEach((ticket) => fetchComments(ticket.id));
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchComments = async (ticketId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/comments/ticket/${ticketId}`);
      setComments((prev) => ({ ...prev, [ticketId]: res.data }));
    } catch (error) {
      console.error(`Error fetching comments for ticket ${ticketId}:`, error);
    }
  };

  const addComment = async (TicketId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || !commentText[TicketId]?.trim()) return;

      await axios.post(`http://localhost:8080/api/comments`, {
        ticketId: TicketId,
        author: userId,
        message: commentText[TicketId],
      });

      setCommentText((prev) => ({ ...prev, [TicketId]: "" }));
      fetchComments(TicketId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tickets/${ticketId}`);
      fetchTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  // 🔍 Filter tickets by status or title
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">🎟 My Tickets</h1>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
        >
          ➕ Create Ticket
        </button>

        {/* 🔍 Search Bar */}
        <input
          type="text"
          placeholder="Search by status or title..."
          className="border p-2 rounded w-64 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTickets.length === 0 ? (
        <p className="text-gray-600">No tickets match your search.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Comments</th>
                <th className="p-3 border">Add Comment</th>
                <th className="p-3 border">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-100 transition">
                  <td className="p-3 border">{ticket.id}</td>
                  <td className="p-3 border">{ticket.title}</td>
                  <td className="p-3 border">{ticket.status}</td>
                  <td className="p-3 border">
                    {comments[ticket.id]?.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {comments[ticket.id].map((c) => (
                          <li key={c.id}>
                            <strong>{c.author}</strong>: {c.message}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <em className="text-gray-500">No comments yet</em>
                    )}
                  </td>
                  <td className="p-3 border">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="border p-2 rounded w-full text-sm"
                      value={commentText[ticket.id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [ticket.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => addComment(ticket.id)}
                      className="mt-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition"
                    >
                      Add
                    </button>
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => deleteTicket(ticket.id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal with blurred background */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <CreateTicketModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onTicketCreated={fetchTickets}
          />
        </div>
      )}
    </div>
  );
}
