import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Simulator from "./pages/Simulator";
import Confirmation from "./pages/Confirmation";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequestDetail from "./pages/admin/AdminRequestDetail";

export const routers = [
  {
    path: "/",
    name: "home",
    element: <Index />,
  },
  {
    path: "/simulateur",
    name: "simulator",
    element: <Simulator />,
  },
  {
    path: "/confirmation",
    name: "confirmation",
    element: <Confirmation />,
  },
  {
    path: "/admin",
    name: "admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    name: "admin-dashboard",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        name: "admin-dashboard-index",
        element: <AdminDashboard />,
      },
      {
        path: "requests/:id",
        name: "admin-request-detail",
        element: <AdminRequestDetail />,
      },
    ],
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
