import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/authentication/Login";
import ResetPassword from "./pages/authentication/ResetPassword";
import VerifyEmail from "./pages/authentication/VerifyEmail";

const router = createBrowserRouter([
  {
    path: "",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
]);

export default router;
