import React from "react";
import SearchBox from "./SearchBox";
import SearchButton from "./SearchButton";

import { withRouter } from 'react-router-dom'

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            queryText: ""
        }
    }

    onClick = () => {
        this.props.history.push("/result/" + this.state.queryText)
    }

    onEnterKeyPress = () => {
        this.props.history.push("/result/" + this.state.queryText)
    }

    updateQueryText = (newText) => {
        this.setState({
            queryText: newText
        })
    }

    render() {
        return (
            <div className="search">
                <SearchBox updateQueryText={this.updateQueryText} onEnterKeyPress={this.onEnterKeyPress}/>
                <SearchButton onClick={this.onClick}/>
            </div>
        )
    }
}

export default withRouter(Search);