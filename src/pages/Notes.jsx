
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/notes";

const ALLOWED_EXTENSIONS = ["pdf", "ppt", "pptx"];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error("Error loading notes:", error);
      alert("Cannot load notes. Check whether the backend is running.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const extension = selectedFile.name
      .split(".")
      .pop()
      .toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      alert("Please select a PDF, PPT, or PPTX file.");
      e.target.value = "";
      setFile(null);
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      alert("File size must not exceed 20 MB.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF or PowerPoint file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("subject", subject.trim());
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/upload`,
        formData
      );

      setNotes((previousNotes) => [
        response.data,
        ...previousNotes
      ]);

      setTitle("");
      setSubject("");
      setFile(null);

      const fileInput = document.getElementById("noteFile");
      if (fileInput) fileInput.value = "";

      alert("Note uploaded successfully!");
    } catch (error) {
      console.error(
        "Upload error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 413) {
        alert("File is too large. Please choose a smaller file.");
      } else {
        alert(
          error.response?.data?.message ||
          "Cannot upload note. Check the backend Console for the error."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStoredFileName = (filePath) => {
    if (!filePath) return "";

    return filePath.split(/[\\/]/).pop();
  };

  const handleView = (note) => {
    const storedFileName = getStoredFileName(note.filePath);

    if (!storedFileName) {
      alert("File path is unavailable.");
      return;
    }

    const fileUrl =
      `${API_URL}/file/${encodeURIComponent(storedFileName)}`;

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      setNotes((previousNotes) =>
        previousNotes.filter((note) => note.id !== id)
      );

      alert("Note deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Cannot delete note.");
    }
  };

  return (
    <div className="notes-page">
      <div className="notes-intro">
        <div className="notes-intro-icon">📚</div>

        <div>
          <h1>Study Notes</h1>
          <p>Share knowledge. Find resources. Learn together.</p>
        </div>
      </div>

      <div className="notes-main">
        <div className="upload-section">
          <div className="section-heading">
            <h2>Upload Notes</h2>
            <p>Share PDFs and PowerPoint presentations with students.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="noteTitle">Note Title</label>
              <input
                id="noteTitle"
                type="text"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="noteSubject">Subject</label>
              <input
                id="noteSubject"
                type="text"
                placeholder="Example: Java, DBMS, AI"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="noteFile">Choose File</label>
              <input
                id="noteFile"
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileChange}
                required
              />

              <small className="file-help">
                Accepted: PDF, PPT, PPTX · Maximum 20 MB
              </small>

              {file && (
                <p className="selected-file">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="upload-button"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Note"}
            </button>
          </form>
        </div>

        <div className="notes-list-section">
          <div className="section-heading">
            <h2>Available Notes</h2>
            <p>Study materials shared by students.</p>
          </div>

          {notes.length === 0 ? (
            <div className="empty-notes">
              <div>📄</div>
              <h3>No notes yet</h3>
              <p>Upload the first study resource for your classmates.</p>
            </div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => {
                const extension = (
                  note.fileName?.split(".").pop() || "FILE"
                ).toUpperCase();

                return (
                  <div className="note-item" key={note.id}>
                    <div className="note-left">
                      <div className="pdf-icon">
                        {extension}
                      </div>

                      <div className="note-info">
                        <h3>{note.title}</h3>
                        <p>{note.subject}</p>
                        <small>{note.fileName}</small>
                      </div>
                    </div>

                    <div className="note-actions">
                      <button
                        type="button"
                        className="view-button"
                        onClick={() => handleView(note)}
                      >
                        View / Open
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(note.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;
