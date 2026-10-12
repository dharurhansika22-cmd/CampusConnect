
import { useEffect, useState } from "react";
import axios from "axios";

function HelpRequests() {
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");

  const [aiQuestions, setAiQuestions] = useState({});
  const [aiAnswers, setAiAnswers] = useState({});
  const [loadingAI, setLoadingAI] = useState({});
  const [replyText, setReplyText] = useState({});
  const [error, setError] = useState("");

  const API = "http://localhost:8080";

  // Load questions and student answers
  const loadData = async () => {
    try {
      const [requestsResult, responsesResult] =
        await Promise.all([
          axios.get(`${API}/help-requests`),
          axios.get(`${API}/help-responses`),
        ]);

      setRequests(requestsResult.data);
      setResponses(responsesResult.data);
      setError("");
    } catch (err) {
      console.error("Loading data failed:", err);
      setError(
        "Unable to load questions or answers. Check that the backend is running."
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Subject options
  const subjects = [
    "All",
    ...new Set(
      requests
        .map((request) => request.subject)
        .filter((subject) => subject?.trim())
    ),
  ];

  // Filter questions
  const filteredRequests = requests.filter(
    (request) =>
      selectedSubject === "All" ||
      request.subject?.toLowerCase() ===
        selectedSubject.toLowerCase()
  );

  // Ask AI
  const handleAIHelp = async (request) => {
    const question = aiQuestions[request.id]?.trim();

    if (!question) {
      setAiAnswers((prev) => ({
        ...prev,
        [request.id]: "Please enter your question first.",
      }));
      return;
    }

    setLoadingAI((prev) => ({
      ...prev,
      [request.id]: true,
    }));

    try {
      const result = await axios.post(
        `${API}/ai/help`,
        question,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      const answer =
        typeof result.data === "string"
          ? result.data
          : result.data.answer ||
            result.data.response ||
            "No answer received.";

      setAiAnswers((prev) => ({
        ...prev,
        [request.id]: answer,
      }));
    } catch (err) {
      console.error("AI help failed:", err);

      setAiAnswers((prev) => ({
        ...prev,
        [request.id]: "Unable to get an AI answer. Please try again.",
      }));
    } finally {
      setLoadingAI((prev) => ({
        ...prev,
        [request.id]: false,
      }));
    }
  };

  // Submit a student's answer
  const handleReply = async (requestId) => {
    const message = replyText[requestId]?.trim();

    if (!message) {
      alert("Please enter your answer.");
      return;
    }

    try {
      const result = await axios.post(
        `${API}/help-responses`,
        {
          helpRequestId: requestId,
          message: message,
        }
      );

      console.log("Saved response:", result.data);

      // Clear the answer box and reload saved answers
      setReplyText((prev) => ({
        ...prev,
        [requestId]: "",
      }));

      await loadData();
      alert("Answer submitted successfully!");
    } catch (err) {
      console.error("Submitting answer failed:", err);
      alert("Failed to submit the answer. Please try again.");
    }
  };

  // Delete a question
  const handleDelete = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this help request?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API}/help-requests/${requestId}`
      );

      await loadData();
      alert("Help request deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete the help request.");
    }
  };

  return (
    <div className="help-requests-page">
      <h1>Student Help Requests</h1>

      <p>
        Explore questions and help other students learn.
      </p>

      {error && (
        <p className="error-message">{error}</p>
      )}

      {/* Subject filter */}
      <div className="subject-filter">
        <label htmlFor="subjectFilter">
          Filter by Subject:
        </label>

        <select
          id="subjectFilter"
          value={selectedSubject}
          onChange={(e) =>
            setSelectedSubject(e.target.value)
          }
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject === "All" ? "All Subjects" : subject}
            </option>
          ))}
        </select>
      </div>

      <p>
        Showing {filteredRequests.length} help request(s)
      </p>

      {filteredRequests.length === 0 ? (
        <p>No help requests found for this subject.</p>
      ) : (
        filteredRequests.map((request) => {
          // Find answers belonging to this question
          const requestResponses = responses.filter(
            (item) =>
              Number(item.helpRequestId) ===
              Number(request.id)
          );

          return (
            <div
              className="help-request-card"
              key={request.id}
            >
              <h2>{request.title}</h2>

              <p>{request.description}</p>

              <p>
                <strong>Subject:</strong>{" "}
                {request.subject || "Not specified"}
              </p>

              {request.skills && (
                <p>
                  <strong>Skills:</strong> {request.skills}
                </p>
              )}

              <hr />

              {/* AI help */}
              <h3>AI Help</h3>

              <textarea
                placeholder="Ask a question about this topic..."
                value={aiQuestions[request.id] || ""}
                onChange={(e) =>
                  setAiQuestions((prev) => ({
                    ...prev,
                    [request.id]: e.target.value,
                  }))
                }
              />

              <button
                onClick={() => handleAIHelp(request)}
                disabled={!!loadingAI[request.id]}
              >
                {loadingAI[request.id]
                  ? "Getting Answer..."
                  : "Ask AI"}
              </button>

              {aiAnswers[request.id] && (
                <div className="ai-answer">
                  <strong>AI Answer:</strong>
                  <p>{aiAnswers[request.id]}</p>
                </div>
              )}

              <hr />

              {/* Answer the question */}
              <h3>Help This Student</h3>

              <textarea
                placeholder="Write your answer here..."
                value={replyText[request.id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({
                    ...prev,
                    [request.id]: e.target.value,
                  }))
                }
              />

              <button
                onClick={() => handleReply(request.id)}
              >
                Submit Response
              </button>

              <hr />

              {/* Display saved student answers */}
              <h3>
                Student Responses ({requestResponses.length})
              </h3>

              {requestResponses.length === 0 ? (
                <p>No responses yet.</p>
              ) : (
                requestResponses.map((item) => {
                  const answer =
                    item.message ?? item.response;

                  return (
                    <div
                      className="student-response"
                      key={item.id}
                    >
                      <p>
                        {typeof answer === "string" &&
                        answer.trim() !== ""
                          ? answer
                          : "This response has no answer text saved."}
                      </p>
                    </div>
                  );
                })
              )}

              <button
                className="delete-button"
                onClick={() => handleDelete(request.id)}
              >
                Delete Request
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default HelpRequests;
