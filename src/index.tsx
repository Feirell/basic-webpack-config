import React from "react";
import ReactDOMClient from 'react-dom/client';

import './global.scss';
import {App} from "./app";

function mount() {
    const rootContainer = document.getElementById('root')!;
    const root = ReactDOMClient.createRoot(rootContainer);

    root.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );
}

document.addEventListener('DOMContentLoaded', mount);
