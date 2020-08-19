import React from "react";

import Table from "./Table"

function humanFileSize(bytes, dp=1) {
    const thresh = 1000;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}

class Result extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    searchByKeyword = (keyword) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "query": {
                    "multi_match": {
                        "query" : keyword,
                        "fields" : ["name^2", "files.path"]
                    }
                }
            })
        };

        const handleFiles = (torrent) => {
            if (torrent.files) {
                let files = torrent.files.filter(item => item.path).map(file => ({
                    fileName: file.path,
                    size: humanFileSize(parseInt(file.length, 10))
                }));

                if (files.length > 50) {
                    files = files.slice(0, 50);
                    files.push({
                        fileName: "...",
                        size: "..."
                    })
                }

                return files;
            }

            return [{
                fileName: torrent.name,
                size: humanFileSize(parseInt(torrent.length, 10))
            }]
        };

        fetch('/api/torrent/_search', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({
                data: data.hits.hits.map(item => ({
                    name: item._source.name,
                    infohash: item._source.infohash,
                    files: handleFiles(item._source)
                }))
            }));
    };

    componentDidMount() {
        this.searchByKeyword(this.props.match.params.queryText)
    }

    render() {
        return (
            <div>
                <div className="header">
                    Search results for "{this.props.match.params.queryText}"
                </div>
                <div className="result">
                    <div className="table">
                        <Table datasource={this.state.data} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Result;