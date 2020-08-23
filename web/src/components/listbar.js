import React from "react";

export default class ListItem extends React.Component {
    render() {
        return (
            <div className="list-bar">
                <div className="item">
                    {
                        (this.props.currentPage > 1) && (
                            <button
                                className="tag"
                                onClick={() => {
                                    window.scrollTo({top: 0, behavior: "smooth"})
                                    this.props.searchByKeyword(this.props.keyword, this.props.currentPage - 1)
                                }}
                            >Prev</button>
                        )
                    }
                </div>
                <div className="item">
                    {this.props.currentPage}/{this.props.totalPage}
                </div>
                <div className="item">
                    {
                        (this.props.currentPage < this.props.totalPage) && (
                            <button
                                className="tag"
                                onClick={() => {
                                    console.log(this.props.keyword)
                                    window.scrollTo({top: 0, behavior: "smooth"})
                                    this.props.searchByKeyword(this.props.keyword, this.props.currentPage + 1)
                                }}
                            >Next</button>
                        )
                    }
                </div>
            </div>
        );
    }
}