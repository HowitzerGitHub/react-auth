import { Outlet, RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return (
    <RouterProvider router={router}>
      <Outlet></Outlet>
    </RouterProvider>
  );
}

export default App;
