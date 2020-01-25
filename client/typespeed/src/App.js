import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import {initializeGame } from "./GameScripts/script"
import "./style.css";
import ReactDOM from 'react-dom';
import axios from 'axios';

function Scoreboard({scores}){
    let res = scores.map((res)=>{
    return(
        <tr key={res._id}>
            <td>{res.name}</td>
            <td className={"text-center"}>{res.score}</td>
        </tr>
    );
    });
    return (
        <table>
            <thead>
            <tr>
                <th>Igrac</th>
                <th className={"text-center"}>Broj poena</th>
            </tr>
            </thead>
            <tbody>
            {res}
            </tbody>
        </table>
    );
}

class App  extends React.Component{
    constructor(props){
        super(props);
        this.state={
            res: [],
            dataReady: false,
            gameLoaded: false,
        };
        this.basePath = "http://localhost:1025/";
        this.getData = this.getData.bind(this);
    }
    componentDidMount() {
        document.title = "typespeed";
        //getData is async network operation so we will start it before we start initializing game
        this.getData();
        initializeGame();
        this.setState({
            gameLoaded: true,
        })
    }

    getData(){
        console.log("cao");
        axios.get(this.basePath + "results").then((resp)=>{
            console.log(resp);
            this.setState({
                res:resp.data,
                dataReady: true,
            });
        });
    }
    render() {
        if(this.state.dataReady && this.state.gameLoaded){
            const scoreboardRoot = document.querySelector("#scoreboard");
            ReactDOM.render(<Scoreboard scores={this.state.res}/>, scoreboardRoot);
        }
        return (
            <React.Fragment>
                <div id={"GameRoot"} className={"row p-4"}/>
            </React.Fragment>
        );
    }
}

export default App;
