import FirebaseView from "./UI/views/other/FirebaseView.jsx";
import Home from "./UI/views/homePage/Home.jsx";
import {BrowserRouter, createBrowserRouter, Route, Router, RouterProvider, Routes, useLocation} from "react-router-dom";
import React from "react";
import GalleryPageView from "./UI/views/galleryPage/galleryPageView.jsx";
import SingleProjectView from "./UI/views/singleProject/SingleProjectView.jsx";
import {AnimatePresence} from "framer-motion";
import Routing from "./UI/components/Routing.jsx";

function App() {

    return (
        <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Routing/>}/>
                    <Route path={"/gallery"} element={<Routing/>}/>
                    <Route path={"/project/:id"} element={<Routing/>}/>
                </Routes>
        </BrowserRouter>
    );
}

export default App;
