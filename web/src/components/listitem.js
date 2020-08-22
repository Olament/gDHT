import React from "react";

export default class ListItem extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="cell">
                    {this.props.name}
                </div>
                <div className="cell" style={{justifyContent: "center"}}>
                    {this.props.size}
                </div>
                <div className="cell" style={{direction: "rtl"}}>
                    <a href={'magnet:?xt=urn:btih:' + this.props.link}>Link</a>
                </div>
            </div>
        )
    }
}