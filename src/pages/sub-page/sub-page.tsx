import {Link, Route, Routes} from "react-router-dom";
import React from "react";

export function SubPage() {
    return <div className="sub-page">
        <h2>This is the sub page</h2>

        <p>You can navigate to the sub routes <Link to="red">red</Link> and <Link to="blue">blue</Link></p>

        <p>You can go back via <Link to="/">/</Link></p>

        <Routes>
            <Route path="red" element={<span style={{color: "red"}}>This is the red path</span>}/>
            <Route path="blue" element={<span style={{color: "blue"}}>This is the blue path</span>}/>
        </Routes>
    </div>;
}
