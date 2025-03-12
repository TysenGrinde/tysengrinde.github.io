import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Resume from "./components/Resume";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to My Portfolio</h1>} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
    </Router>
  );
}

export default App;
