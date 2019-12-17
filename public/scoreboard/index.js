var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React, {useEffect} from 'react';
// const ReactDOM = require( 'react-dom' );
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
function loadReact() {
    'use strict';

    // const e = React.createElement();

    var App = function (_React$Component) {
        _inherits(App, _React$Component);

        function App(props) {
            _classCallCheck(this, App);

            var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

            _this.state = {
                res: []
            };
            _this.basePath = "http://localhost:1025/";
            _this.getData = _this.getData.bind(_this);
            return _this;
        }

        _createClass(App, [{
            key: "getData",
            value: function getData() {
                var _this2 = this;

                console.log("cao");
                $.get(this.basePath + "results", function (resp) {
                    console.log(resp);
                    _this2.setState({
                        res: resp
                    });
                });
            }
        }, {
            key: "componentDidMount",
            value: function componentDidMount() {
                this.getData();
            }
        }, {
            key: "render",
            value: function render() {
                var res = this.state.res.map(function (res) {
                    return React.createElement(
                        "tr",
                        { key: res._id },
                        React.createElement(
                            "td",
                            null,
                            res.name
                        ),
                        React.createElement(
                            "td",
                            { className: "text-center" },
                            res.score
                        )
                    );
                });
                console.log(res);
                return React.createElement(
                    "table",
                    null,
                    React.createElement(
                        "thead",
                        null,
                        React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "th",
                                null,
                                "Igrac"
                            ),
                            React.createElement(
                                "th",
                                { className: "text-center" },
                                "Broj poena"
                            )
                        )
                    ),
                    React.createElement(
                        "tbody",
                        null,
                        res
                    )
                );
            }
        }]);

        return App;
    }(React.Component);

    var domContainer = document.querySelector('#reactRoot');
    ReactDOM.render(React.createElement(App, null), domContainer);
}

// ReactDOM.render(<App />, document.getElementById('scoreboardRoot'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();