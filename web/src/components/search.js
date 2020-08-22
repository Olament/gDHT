import React from "react";

import List from "./list";
import SearchBar from "./searchbar";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryText: ""
        }
        this.listElement = React.createRef()
    }

    updateQueryText = (newText) => {
        this.setState({
            queryText: newText
        })
    }

    handleClick = () => {
        this.listElement.current.searchByKeyword(this.state.queryText)
    }

    render() {
        return(
            <div className="container">
                <div style={{display: "flex", justifyContent: "center"}}>
                    <SearchBar
                        updateQueryText={this.updateQueryText}
                    />
                    <button
                        onClick={this.handleClick}
                    >Go</button>
                </div>
                <section>
                    <List
                        ref={this.listElement}
                    />
                </section>
            </div>
        )
    }
}