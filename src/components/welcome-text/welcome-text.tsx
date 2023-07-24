import React from "react";

import "./welcome-text.scss";
import {Link} from "react-router-dom";

export function WelcomeText() {
    return <div className="welcome-text">
        <h1>Hello to the react template</h1>
        <p>This is a rather simple react template, with TypeScript, SCSS, react-router, redux and redux-toolkit already
            installed.</p>
        <p>It comes with a predefined manifest to make it a PWA, enable it by removing the comment in the index.tsx and
            the index.html</p>

        <p>There are some example routes like <Link to="/sub">/sub</Link>.</p>
    </div>
}
