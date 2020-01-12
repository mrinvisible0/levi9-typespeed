import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import {load } from "./GameScripts/script"
import "./style.css";
class App  extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount() {
        load();
    }

    render() {
        return (
            <div id={"GameRoot"} className={"row p-4"}/>
        );
    }
}

export default App;
