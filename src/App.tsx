import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingsPage from "./pages/BookingsPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import SessionsPage from "./pages/SessionsPage";
import TutorDetailPage from "./pages/TutorDetailPage";
import TutorsPage from "./pages/TutorsPage";
import SessionPrepPage from "./pages/SessionPrepPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tutors" element={<TutorsPage />} />
        <Route path="tutors/:tutorId" element={<TutorDetailPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="session-prep" element={<SessionPrepPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
