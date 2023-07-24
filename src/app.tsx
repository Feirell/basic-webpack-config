import React from "react";

import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SubPage} from "./pages/sub-page/sub-page";
import {LandingPage} from "./pages/landing/landing";


export function App() {
    return <div className="app">
        <BrowserRouter>
            <Routes>
                <Route path="/sub/*" element={<SubPage/>}/>
                <Route path="*" element={<LandingPage/>}/>
            </Routes>
        </BrowserRouter>
    </div>
}
