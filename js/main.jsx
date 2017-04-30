const React = require("react");
const {render} = require("react-dom");
const _ = require("underscore");

require("browserify-css");
require("../css/style.css");

const {Graph} = require("./graph.js");
const {PageRank} = require("./pagerank.js");
const {drawPageRank} = require("./draw.js");

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            canvasSize: 600,
            pageRank: PageRank.findExample(8, 0.5),
            pageRankStep: 0,
            networkSize: 8, connectivity: 0.5,
        };
    }

    draw() {
        const {canvasSize, networkSize, connectivity, pageRank, pageRankStep} = this.state;
        drawPageRank(
            this.canvas.getContext("2d"),
            pageRank,
            pageRankStep,
            {x: canvasSize, y: canvasSize}
        );
    }

    componentDidMount() {
        this.draw();
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.networkSize !== nextState.networkSize ||
            this.state.connectivity !== nextState.connectivity) {
            this.setState({
                pageRank: PageRank.findExample(
                    nextState.networkSize,
                    nextState.connectivity
                ),
                pageRankStep: 0,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.draw();
    }

    renderTable() {
        const {pageRank, pageRankStep} = this.state;
        return <table id="steps">
            <tbody>
                <tr>
                    <th><b>Step:</b></th>
                    {pageRank.initialRanks.map((x, i) => <th key={i}>
                        {"Site " + String.fromCharCode(65 + i)}
                    </th>)}
                </tr>
                {pageRank.history.slice(0, pageRankStep + 1)
                    .map((h, i) => <tr key={i}>
                    <td>{i === 0 ? "Start" : "Turn " + i.toString()}</td>
                    {h.map((n, j) => <td key={j}>{n}</td>)}
                </tr>)}
            </tbody>
        </table>;
    }

    render() {
        const {
            canvasSize,
            networkSize,
            pageRankStep,
            pageRank,
            connectivity
        } = this.state;
        const lastStep = pageRank.history.length - 1;
        return <div id="main">
            <h1>AmphibzRank visualizer</h1>
            <div id="controls">
                <label>
                    <div>Network size: <b>{networkSize}</b></div>
                    <input
                        type="range"
                        min="3"
                        max="10"
                        value={networkSize}
                        onChange={(e) => this.setState({
                            networkSize: parseInt(e.target.value)
                        })}
                    />
                </label>
                <label>
                    <div>Connectivity: <b>{connectivity}</b></div>
                    <input 
                        type="range"
                        min="0.1" 
                        max="0.5" 
                        step="0.01"
                        value={connectivity}
                        onChange={(e) => this.setState({
                            connectivity: parseFloat(e.target.value)
                        })}
                    />
                </label>
                <label>
                    <div>Step: <b>
                        {pageRankStep}{"/"}{lastStep}
                    </b></div>
                    <input 
                        type="range"
                        min={0}
                        max={lastStep}
                        value={pageRankStep}
                        onChange={(e) => this.setState({
                            pageRankStep: parseFloat(e.target.value)
                        })}
                    />
                </label>
                <div>
                    <button
                        disabled={pageRankStep === 0}
                        onClick={() => this.setState({
                            pageRankStep: 0,
                        })}
                    >
                        &lt;&lt;
                    </button>
                    <button
                        disabled={pageRankStep === 0}
                        onClick={() => this.setState({
                            pageRankStep: pageRankStep - 1,
                        })}
                    >
                        &lt;
                    </button>
                    <button
                        disabled={pageRankStep === lastStep}
                        onClick={() => this.setState({
                            pageRankStep: pageRankStep + 1,
                        })}
                    >
                        &gt;
                    </button>
                    <button
                        disabled={pageRankStep === lastStep}
                        onClick={() => this.setState({
                            pageRankStep: lastStep,
                        })}
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
            <canvas 
                id="canvas"
                width={canvasSize}
                height={canvasSize}
                ref={(x) => {this.canvas = x; }}
            />
            {this.renderTable()}
        </div>;
    }
}

var appRoot;
document.addEventListener("DOMContentLoaded", function() {
    appRoot = document.getElementById("root");
    doRender();
});

function doRender() {
    render(<App/>, appRoot);
}

window.Graph = Graph;
window.PageRank = PageRank;
