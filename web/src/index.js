import React from 'react';
import ReactDOM from 'react-dom';
import './style.css'
import Footer from "./components/Footer";
import Search from "./components/Search";
import Result from "./components/Result";
import {
    BrowserRouter,
    Switch,
    Route,
} from 'react-router-dom';


class Index extends React.Component {
    render() {
        return(
            <BrowserRouter>
                <Switch>
                    <Route path='/result/:queryText' component={Result}></Route>
                    <Route path='/'>
                        <Search />
                        <Footer />
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(
    <Index />,
    document.getElementById('root')
);
