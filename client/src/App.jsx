import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import PrivateRoute from "./components/auth/PrivateRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ChatWidget from "./components/chatbot/ChatWidget.jsx";
import { lazy, Suspense, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "./components/common/Preloader.jsx";

// Route-level splitting keeps the first visit fast; each page loads only when
// the visitor navigates to it.
const Home = lazy(() => import("./pages/Home.jsx"));
const ContactPage = lazy(() => import("./pages/Contact.jsx"));
const AuthPage = lazy(() => import("./pages/Authentication.jsx"));
const PageNotFound = lazy(() => import("./pages/404.jsx"));
const AdminDashboard = lazy(() => import("./admin/Dashboard.jsx"));
const Logout = lazy(() => import("./components/auth/Logout.jsx"));
const BookingPage = lazy(() => import("./pages/BookingPage.jsx"));
const CorporateServices = lazy(() => import("./pages/CorporateServices.jsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.jsx"));
const AboutUsPage = lazy(() => import("./pages/AboutUs.jsx"));
const ResourcesPage = lazy(() => import("./pages/Resources.jsx"));
const ArticlePage = lazy(() => import("./pages/ArticlePage.jsx"));
const VerifyEmail = lazy(() => import("./components/auth/VerifyEmail.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const EventsPage = lazy(() => import("./pages/Events.jsx"));

// A small component to wrap public pages with the Navbar

function ChatWidgetGate({ user }) {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return <ChatWidget user={user} />;
}

function App() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onLoaded={() => setLoading(false)} />}
      </AnimatePresence>
      
      {!loading && (
        <BrowserRouter>
          <ScrollToTop />
          <ChatWidgetGate user={user} />
          <Suspense fallback={null}>
          <Routes>
        {/* GROUP 1: Public Pages (With Navbar) */}
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/corporate" element={<CorporateServices />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/:id" element={<ArticlePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/verify-email" element={<VerifyEmail setUser={setUser} />}/>
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* GROUP 2: Admin Pages (No Public Navbar) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roleRequired="admin" loginPath="/auth">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
          </Routes>
          </Suspense>
    </BrowserRouter>
      )}
    </>
  );
}

export default App;
