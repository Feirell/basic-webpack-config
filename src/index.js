import React from "react";
import ReactDOM from "react-dom";
import App from "./app.jsx";

console.log('this is a reload 7');

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App/>, document.getElementById("root"));
});
