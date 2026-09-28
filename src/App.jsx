import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import Routing from "./UI/components/Routing.jsx";

function App() {

    return (
        <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Routing/>}/>
                    <Route path={"/gallery"} element={<Routing/>}/>
                    <Route path={"/project/:id"} element={<Routing/>}/>
                    <Route path={"/*"} element={<Routing/>}/>
                </Routes>
        </BrowserRouter>
    );
}

export default App;
