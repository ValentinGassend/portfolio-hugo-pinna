import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import {createBrowserRouter, Link, RouterProvider} from "react-router-dom";
import Landing from "./UI/views/home/Landing.jsx";

const router = createBrowserRouter([{
    path: "/", element: (<Landing/>),
}, {
    path: "about", element: <div>About</div>,
},]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router}/>,)
