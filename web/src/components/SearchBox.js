import React from "react";
import Autosuggest from 'react-autosuggest';
import '../style.css'


class SearchBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            suggestions: []
        };
    }

    getSuggestionValue = suggestion => suggestion;

    renderSuggestion = suggestion => (
        <div>
            {suggestion}
        </div>
    );

    onChange = (event, { newValue }) => {
        this.props.updateQueryText(newValue)
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "suggest": {
                    "search-suggest" : {
                        "prefix" : value,
                        "completion" : {
                            "field" : "name_suggest",
                            "size": 10
                        }
                    }
                }
            })
        };

        fetch('http://107.175.147.28:9200/_search', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({
                suggestions: data.suggest["search-suggest"][0].options.map(item => item.text)
            }));
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    handleKeyPress (event) {
        if (event.key === 'Enter') {
            this.props.onEnterKeyPress();
        }
    }

    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            value,
            onChange: this.onChange,
            autoFocus: true,
            onKeyPress: (event) => this.handleKeyPress(event)
        };

        return (
            <div className="searchbox">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        );
    }
}

export default SearchBox;