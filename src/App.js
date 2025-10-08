// src/App.js
import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/signup";
import ProfilePage from "./components/profile/ProfilePage";
import Layout from "./components/sidebar/layout";
import ForgotPassword from "./components/auth/ForgotPassword";
import ConfirmReset from "./components/auth/ConfirmReset";
import ResetPassword from "./components/auth/ResetPassword";



// Reviewer pages
import ReviewerPage from "./components/reviewer/ReviewerPage";
import DataScalability from "./components/reviewer/DataScalability";
import QuantitativeMethods from "./components/reviewer/QuantitativeMethods";
import AdvancedDatabase from "./components/reviewer/AdvancedDatabase";
import Networking2 from "./components/reviewer/Networking2";
import AdvancedProgramming from "./components/reviewer/AdvancedProgramming";
import IAS from "./components/reviewer/IAS";


function App() {
  return (
    <Routes>
      {/* Auth pages */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/confirm-reset" element={<ConfirmReset />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Pages with Layout */}
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/reviewer" element={<Layout><ReviewerPage /></Layout>} />
      <Route path="/datascalability" element={<Layout><DataScalability /></Layout>} />
      <Route path="/quantitative-methods" element={<Layout><QuantitativeMethods /></Layout>} />
      <Route path="/advanced-database" element={<Layout><AdvancedDatabase /></Layout>} />
      <Route path="/networking-2" element={<Layout><Networking2 /></Layout>} />
      <Route path="/advanced-programming" element={<Layout><AdvancedProgramming /></Layout>} />
      <Route path="/ias" element={<Layout><IAS /></Layout>} />
    </Routes>
  );
}

export default App;
