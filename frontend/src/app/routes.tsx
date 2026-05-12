import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { UserLayout } from "./components/layouts/UserLayout";
import { TutorLayout } from "./components/layouts/TutorLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";

// User Pages
import { UserDashboard } from "./pages/user/Dashboard";
import { LearningPath } from "./pages/user/LearningPath";
import { Tutors } from "./pages/user/Tutors";
import { Sessions } from "./pages/user/Sessions";
import { Profile } from "./pages/user/Profile";

// Tutor Pages
import { TutorDashboard } from "./pages/tutor/Dashboard";
import { Availability } from "./pages/tutor/Availability";
import { TutorSessions } from "./pages/tutor/Sessions";
import { TutorProfile } from "./pages/tutor/Profile";

// Admin Pages
import { AdminDashboard } from "./pages/admin/Dashboard";
import { UsersManagement } from "./pages/admin/UsersManagement";
import { TutorsManagement } from "./pages/admin/TutorsManagement";
import { SubjectsManagement } from "./pages/admin/SubjectsManagement";
import { SessionsManagement } from "./pages/admin/SessionsManagement";
import { PaymentsManagement } from "./pages/admin/PaymentsManagement";
import { AILogs } from "./pages/admin/AILogs";

// Landing
import { Landing } from "./pages/Landing";
import { Register } from "./pages/Register";
import { Onboarding } from "./pages/Onboarding";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Landing },
      { path: "register", Component: Register },
      { path: "onboarding", Component: Onboarding },
      {
        path: "user",
        Component: UserLayout,
        children: [
          { index: true, Component: UserDashboard },
          { path: "learning-path", Component: LearningPath },
          { path: "tutors", Component: Tutors },
          { path: "sessions", Component: Sessions },
          { path: "profile", Component: Profile },
        ],
      },
      {
        path: "tutor",
        Component: TutorLayout,
        children: [
          { index: true, Component: TutorDashboard },
          { path: "availability", Component: Availability },
          { path: "sessions", Component: TutorSessions },
          { path: "profile", Component: TutorProfile },
        ],
      },
      {
        path: "admin",
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "users", Component: UsersManagement },
          { path: "tutors", Component: TutorsManagement },
          { path: "subjects", Component: SubjectsManagement },
          { path: "sessions", Component: SessionsManagement },
          { path: "payments", Component: PaymentsManagement },
          { path: "ai-logs", Component: AILogs },
        ],
      },
    ],
  },
]);