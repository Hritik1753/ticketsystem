import { useState } from "react";
import axios from "axios";

export default function CreateTicketModal({ isOpen, onClose, onTicketCreated }) {
  const [ticketData, setTicketData] = useState({
    title: "",
    description: "",
    priority: "LOW",
  });

  if (!isOpen) return null; // Don't render if modal is closed

  const handleChange = (e) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user_Id = localStorage.getItem("userId");

      const ticketPayload = {
        ...ticketData,
        status: "OPEN",
        userId:parseInt(user_Id),// backend will map userId to createdBy
      };

      await axios.post("http://localhost:8080/api/tickets", ticketPayload);
      onTicketCreated(); // Refresh tickets list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Create Ticket</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Ticket Title"
            value={ticketData.title}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={ticketData.description}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
          <select name="priority" value={ticketData.priority} onChange={handleChange} style={styles.input}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
            <button type="submit" style={styles.createButton}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { backgroundColor: "#fff", padding: "20px", borderRadius: "8px", width: "400px" },
  input: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  textarea: { width: "100%", padding: "10px", height: "80px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  actions: { display: "flex", justifyContent: "space-between" },
  cancelButton: { backgroundColor: "#ccc", padding: "8px 16px", border: "none", borderRadius: "5px" },
  createButton: { backgroundColor: "#0070f3", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "5px" }
};
