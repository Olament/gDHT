import React from 'react'

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggest: []
        }
    };

    render() {
        return (
            <input
                style={{ margin: '0 1rem' }}
                id="search"
                type="search"
                placeholder="Search for anything..."
                onChange={e => {
                    this.setState({value: e.target.value});
                    this.props.updateQueryText(e.target.value)
                }}
            />
        )
    };
}