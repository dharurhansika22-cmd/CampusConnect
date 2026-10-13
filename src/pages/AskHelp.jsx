
import { useState } from "react";
import axios from "axios";
import "./HelpPages.css";

function AskHelp() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [skills, setSkills] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
      alert("Please login first.");
      return;
    }

    const user = JSON.parse(savedUser);

    try {
      const response = await axios.post(
        "https://campusconnect-backend-iujm.onrender.com/help-requests",
        {
          userId: user.id,
          title,
          description,
          subject,
          skills
        }
      );

      console.log("SUCCESS:", response.data);
      alert("Help request submitted successfully!");

      setTitle("");
      setDescription("");
      setSubject("");
      setSkills("");
    } catch (error) {
      console.error("ERROR:", error);

      if (error.response) {
        alert(
          "Error " +
            error.response.status +
            ": " +
            JSON.stringify(error.response.data)
        );
      } else {
        alert("Cannot connect to backend!");
      }
    }
  };

  return (
    <div className="help-page">
      <div className="help-container">
        <div className="help-heading">
          <span className="help-badge">STUDENT COMMUNITY</span>
          <h1>Ask for Help</h1>
          <p>
            Stuck on a topic? Share your question and learn
            together with fellow students.
          </p>
        </div>

        <div className="help-form-card">
          <div className="form-card-heading">
            <h2>Create a Help Request</h2>
            <p>
              Provide a few details so other students can help you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="help-form">
            <label htmlFor="title">Question Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. How does inheritance work in Java?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              placeholder="Explain your question in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
            />

            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              placeholder="e.g. Java, DBMS, AI"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <label htmlFor="skills">Skills Needed</label>
            <input
              id="skills"
              type="text"
              placeholder="e.g. Java, React, Python"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <button type="submit" className="help-submit-button">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AskHelp;
