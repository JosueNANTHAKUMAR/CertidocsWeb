import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VerifyPage from "./pages/VerifyPage";
import GeneratePage from "./pages/GeneratePage";

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/verify" element={<VerifyPage />} id="verify" />
          <Route path="/generate" element={<GeneratePage />} id="generate" />
        </Routes>
      </div>
    </Router>
  );
}

export default App;