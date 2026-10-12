import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState("");
  const [subjects, setSubjects] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);

      setSkills(
        localStorage.getItem("userSkills") ||
          "Java, Python, React"
      );

      setSubjects(
        localStorage.getItem("userSubjects") ||
          "Java, DBMS, AI"
      );
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("userSkills", skills);
    localStorage.setItem("userSubjects", subjects);
    setIsEditing(false);

    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-heading">
            <h1>My Profile</h1>
            <p>Please log in to view your student profile.</p>
          </div>

          <div className="profile-card">
            <div className="profile-content" style={{ paddingTop: "30px" }}>
              <button
                className="profile-save-button"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initial = user.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "S";

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-heading">
          <h1>My Profile</h1>
          <p>Manage your student information and learning interests.</p>
        </div>

        <div className="profile-card">
          <div className="profile-banner"></div>

          <div className="profile-content">
            <div className="profile-avatar">{initial}</div>

            <h2 className="profile-name">
              {user.name || "Student"}
            </h2>

            <p className="profile-email">{user.email}</p>

            <h3 className="profile-section-title">
              Student Information
            </h3>

            <div className="profile-form">
              <div className="profile-field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={user.name || ""}
                  readOnly
                />
              </div>

              <div className="profile-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={user.email || ""}
                  readOnly
                />
              </div>

              <div className="profile-field profile-full-width">
                <label>Skills</label>
                <input
                  type="text"
                  value={skills}
                  readOnly={!isEditing}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Enter your skills"
                />
              </div>

              <div className="profile-field profile-full-width">
                <label>Favorite Subjects</label>
                <input
                  type="text"
                  value={subjects}
                  readOnly={!isEditing}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="Enter your favorite subjects"
                />
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button
                  type="button"
                  className="profile-save-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="profile-save-button"
                    onClick={handleSaveProfile}
                  >
                    Save Profile
                  </button>

                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={() => {
                      setSkills(
                        localStorage.getItem("userSkills") ||
                          "Java, Python, React"
                      );
                      setSubjects(
                        localStorage.getItem("userSubjects") ||
                          "Java, DBMS, AI"
                      );
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}

              <button
                type="button"
                className="profile-cancel-button"
                onClick={handleLogout}
                style={{
                  backgroundColor: "#fff0f0",
                  color: "#c53030"
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;