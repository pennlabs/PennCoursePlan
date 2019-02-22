import React, {Component} from 'react';
import './styles/App.css';
import 'bulma/css/bulma.css'
import Sections from "./components/selector/Sections";
import Schedule from './components/schedule/Schedule'
import Provider from "react-redux/es/components/Provider";
import {createStore} from "redux";
import coursePlanApp from "./reducers";
import {SearchResults} from "./components/search/result"
import SearchBar from "./components/search/bar"
import SearchFilter from "./components/search/filter"



const previousState = localStorage.getItem("coursePlanState");
const previousStateJSON = previousState ? JSON.parse(previousState): undefined;

if (previousStateJSON !== undefined) {
    previousStateJSON.sections.showSearchFilter = false;
}
const store = createStore(coursePlanApp, previousStateJSON);

store.subscribe(() =>{
    localStorage.setItem("coursePlanState", JSON.stringify(store.getState()));
});

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store = {store}>
                <nav className="navbar is-link" role="navigation">
                    <div className="navbar-brand">
                        <div className="navbar-item nav-header">
                            Penn Course Search
                        </div>
                    </div>
                    <div className="navbar-menu">
                        <div className="navbar-start">

                        </div>
                        <div className="navbar-end">

                            <a className="navbar-item" href="https://airtable.com/shrf3pVP8e8HO2tO1">
                                Feedback
                            </a>
                            <a className="navbar-item"
                               style={{paddingRight:"0.5em"}}>About</a>
                            <a className="navbar-item"
                               style={{paddingRight:"0.5em"}}>Help</a>
                        </div>
                    </div>
                </nav>
                <SearchBar/>
                <div className="App">
                    <div className="columns" id={"courses_and_sections"}>
                        <div className={"column is-two-fifths"}>
                            <div className={"columns"}>
                                <SearchResults/>
                                <Sections/>
                            </div>
                        </div>
                        <div id="InfoPanel" className="column">
                            <Schedule/>
                        </div>
                    </div>
                </div>
                <SearchFilter allowed={["filter_search_toggler"]}/>
            </Provider>
        );
    }
}

export default App;
