import Navbar from "./components/navbar/Navbar";
import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import { Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import { profilePageLoader, singlePageLoader, listPageLoader } from "./lib/loaders";
import Dashboard from "./pages/dashboard/Dashboard";
import About from "./pages/about/About";
import Footer from "./pages/footer/Footer";
import Contact from "./pages/contact/Contact";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // E kemi Layout si një komponent që do të mbështesë të gjitha faqet
      children: [
        {
          path: "/",
          element: <HomePage />, // Kjo është faqe kryesore
        },
         {
      path: "/about",
      element: <About />,
    },
     {
      path: "/contact",
      element: <Contact />,
    },
     {
      path: "/footer",
      element: <Footer />,
    },

        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader, // Për ngarkimin e të dhënave
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/login",
          element: <Login />, // Faqja e logimit
        },
        {
          path: "/register",
          element: <Register />, // Faqja e regjistrimit
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />, // Ky do të jetë një auth middleware që do të kontrollojë sesionin e përdoruesit
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/dashboard",
          element: <Dashboard />, // Dashboard për përdoruesit administrues
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />, // Faqja për shtimin e postimeve
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
