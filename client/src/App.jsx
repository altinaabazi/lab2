import Navbar from "./components/navbar/Navbar";
import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider,Route,Link } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import Layout from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
function App() {

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/list",
        element: <ListPage />,
        //loader: listPageLoader,
      },
       {
         path: "/:id",
         element: <SinglePage />,
        // loader: singlePageLoader,
       },
       {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/register",
        element: <Register />,
      },

       
    ]
  },
 

]);




  return (

    <RouterProvider router={router}/>
  );
}

export default App;