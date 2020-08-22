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

const RESULT_PER_PAGE = 20;

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            keyword: "",
            currentPage: 0,
            totalPage: 0,
        }
    };

    searchByKeyword = (keyword, page=1) => {
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
                },
                "size": RESULT_PER_PAGE,
                "from": (page - 1) * RESULT_PER_PAGE,
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

        fetch('/api/torrent/_search', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({
                data: data.hits.hits.map(item => ({
                    name: item._source.name,
                    link: item._source.infohash,
                    //files: handleFiles(item._source)[1],
                    size: handleFiles(item._source)[0]
                })),
                keyword: keyword,
                totalPage: Math.ceil(data.hits.total.value / RESULT_PER_PAGE),
                currentPage: page,
            }));
    };

    render() {
        // no result page
        if (this.state.keyword === "") {
            return (
                <div></div>
            );
        }

        if (this.state.data.length === 0) {
            return (
                <h2 style={{borderBottom: "0"}}>No result for "{this.state.keyword}"</h2>
            )
        }

        return (
            <div>
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
                <div style={{display: "flex", margin: "1rem"}}>
                    <div className="tags" style={{width: "50%", justifyContent: "center"}}>
                        {
                            (this.state.currentPage > 1) && (
                                <button
                                    className="tag"
                                    onClick={() => this.searchByKeyword(this.state.keyword, this.state.currentPage - 1)}
                                >Prev</button>
                            )
                        }
                    </div>
                    <div className="tags" style={{width: "50%", justifyContent: "center"}}>
                        {
                            (this.state.currentPage < this.state.totalPage) && (
                                <button
                                    className="tag"
                                    onClick={() => this.searchByKeyword(this.state.keyword, this.state.currentPage + 1)}
                                >Next</button>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    };
}