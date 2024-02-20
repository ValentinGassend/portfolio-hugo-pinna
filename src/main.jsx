import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import {createBrowserRouter, Link, RouterProvider} from "react-router-dom";
import Home from "./UI/views/homePage/Home.jsx";
import SingleProjectView from "./UI/views/singleProject/SingleProjectView.jsx";
import GalleryPageView from "./UI/views/galleryPage/galleryPageView.jsx";

const router = createBrowserRouter([{
    path: "/", element: (<Home/>),
}, {
    path: "/gallery", element: <GalleryPageView/>,
}, {
    path: "/project/:id", element: <SingleProjectView/>,
},]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router}/>,)
