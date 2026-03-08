import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Componetns/Home/Home";
import Services from "../Componetns/Services.jsx/Services";
import Portfolio from "../Pages/Portfolio/Portfolio";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children:[
        {
            index:true,
            Component:Home
        },
        {
            path:'/services',
            element:<Services></Services>
        },
        {
            path:'/About',
            element:<About></About>
        },
       
        {
            path:'/portfolio',
            element:<Portfolio></Portfolio>
        },
        {
            path:'/contact',
            element:<Contact></Contact>
        },
    ]
    
  },
]);