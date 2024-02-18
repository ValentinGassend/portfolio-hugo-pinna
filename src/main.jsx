import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import {createBrowserRouter, Link, RouterProvider} from "react-router-dom";
import Home from "./UI/views/homePage/Home.jsx";
import SingleProjectView from "./UI/views/singleProject/SingleProjectView.jsx";

const router = createBrowserRouter([{
    path: "/", element: (<Home/>),
}, {
    path: "/about", element: <div>About</div>,
}, {
    path: "/project/:id", element: <SingleProjectView/>,
},]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router}/>,)
