import React from "react";

export default class ListItem extends React.Component {
    render() {
        return (
            <div className="row" style={{maxWidth: "90%"}}>
                <div className="cell" style={{overflowWrap: "break-word"}}>
                    {this.props.name}
                </div>
                <div className="cell" style={{justifyContent: "center"}}>
                    {this.props.size}
                </div>
                <div className="cell" style={{justifyContent: "center"}}>
                    <a href={'magnet:?xt=urn:btih:' + this.props.link}>Link</a>
                </div>
            </div>
        )
    }
}