import React from "react";
import ReactDOM from "react-dom";

import './base.scss'

document.addEventListener('DOMContentLoaded', () => {
    const mountElem = document.getElementById("root");
    ReactDOM.render(<h1>Hi this is the app!</h1>, mountElem);
});
