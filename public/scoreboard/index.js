// import React, {useEffect} from 'react';
// const ReactDOM = require( 'react-dom' );
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
function loadReact() {
    'use strict';

// const e = React.createElement();

    class App extends React.Component{
        constructor(props){
            super(props);
            this.state={
                res: []
            };
            this.basePath = "http://localhost:1025/";
            this.getData = this.getData.bind(this);
        }
        getData(){
            console.log("cao");
            $.get(this.basePath + "results",(resp)=>{
                console.log(resp);
                this.setState({
                    res:resp,
                })
            });
        }
        componentDidMount() {
            this.getData();
        }

        render() {
            let res = this.state.res.map((res)=>{
                return(
                <tr key={res._id}>
                    <td>{res.name}</td>
                    <td className={"text-center"}>{res.score}</td>
                </tr>
                );
            });
            console.log(res);
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
    }

    const domContainer = document.querySelector('#reactRoot');
    ReactDOM.render(<App/>, domContainer);
}

// ReactDOM.render(<App />, document.getElementById('scoreboardRoot'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
