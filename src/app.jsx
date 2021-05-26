import React, { Component} from "react";
import "./app.css";
import {TestComp} from "./other";

class App extends Component{
    render(){
        return(
            <div className="app">
                <h1> Hello, World! Test 5</h1>
                <TestComp/>
            </div>
        );
    }
}

export default App;
