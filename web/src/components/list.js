import React from "react";

import ListItem from "./listitem";


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

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    };

    searchByKeyword = (keyword) => {
        // edge case: no empty search
        if (keyword === "") {
            return
        }

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
                let filteredFiles = torrent.files.filter(item => item.path);
                let files = filteredFiles.map(file => ({
                    fileName: file.path,
                    size: humanFileSize(parseInt(file.length, 10))
                }));
                let totalSize = humanFileSize(filteredFiles.map(item =>
                    parseInt(item['length'], 10)).reduce((acc, curr) => acc + Math.abs(curr)));


                if (files.length > 50) {
                    let original_size = files.length;
                    files = files.slice(0, 50);
                    files.push({
                        fileName: (original_size - 50) + " more files",
                        size: "..."
                    })
                }

                return [totalSize, files];
            }

            return [humanFileSize(Math.abs(parseInt(torrent.length, 10))), [{
                fileName: torrent.name,
                size: humanFileSize(Math.abs(parseInt(torrent.length, 10)))
            }]];
        };

        fetch('/api/torrent/_search?size=20', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({
                data: data.hits.hits.map(item => ({
                    name: item._source.name,
                    link: item._source.infohash,
                    //files: handleFiles(item._source)[1],
                    size: handleFiles(item._source)[0]
                }))
            }));
    };

    render() {
        // no result page
        if (this.state.data.length === 0) {
            return (
                <h2 style={{borderBottom: "0"}}>No result</h2>
            )
        }

        return (
            <div className="grid posts with-tags">
                {this.state.data.map(item =>
                    <ListItem
                        key={item.link}
                        name={item.name}
                        size={item.size}
                        link={item.link}
                    />
                )}
            </div>
        )
    };
}