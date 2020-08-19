import React from "react";


class SearchButton extends React.Component {
    render() {
        return (
            <div className="searchbutton">
                <input type="submit" value="Go" onClick={this.props.onClick}/>
            </div>
        )
    }
}

export default SearchButton;