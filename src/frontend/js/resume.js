import React, { useEffect, useState } from "react";

const Resume = () => {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/resume")
      .then((response) => response.json())
      .then((data) => setResume(data))
      .catch((error) => console.error("Error fetching resume data:", error));
  }, []);

  if (!resume) {
    return <p>Loading...</p>;
  }

  return (
    <div className="resume">
      <h1>{resume.name}</h1>
      {/* Rest of your existing render logic */}
    </div>
  );
};

export default Resume;