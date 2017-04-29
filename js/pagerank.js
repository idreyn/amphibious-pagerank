const {Graph} = require("./graph.js");

class PageRank {
	constructor(web, initial=24) {
		this.web = web;
		this.initial = initial;
		this.initialRanks = Array(web.size).fill().map(() => initial);
		this.iterations = 0;
		this.history = [this.initialRanks];
	}

	next() {
		const ranks = this.history[this.history.length - 1];
		const nextRanks = Array(this.web.size);
		for (let i=0; i<ranks.length; i++) {
			let rank = this.web.edgesFrom(i) ? ranks[i] % this.web.edgesFrom(i) : ranks[i];
			for (let j=0; j<ranks.length; j++) {
				if (i !== j && this.web.hasEdge(j, i)) {
					rank += Math.floor(ranks[j] / this.web.edgesFrom(j));
				}
			}
			nextRanks[i] = rank;
		}
		++this.iterations;
		this.history.push(nextRanks);
		return nextRanks;
	}

	atEquilibrium() {
		if (this.history.length < 2) {
			return false;
		}
		const first = this.history[this.history.length - 1];
		const second = this.history[this.history.length - 2];
		for (let i=0; i<first.length; i++) {
			if(first[i] !== second[i]) {
				return false;
			}
		}
		return true;
	}

	preservedPageRank() {
		return this.initialRanks.reduce(
			(a, b) => a + b
		) === this.history[this.history.length - 1].reduce(
			(a, b) => a + b
		);
	}
}

PageRank.findExample = (size, connectivity, minIterations=3, maxIterations=10) => {
	while (true) {
		const gr = Graph.getRandom(size, connectivity);
		const pr = new PageRank(gr);
		while (true) {
			pr.next();
			const atEquib = pr.atEquilibrium();
			if (pr.atEquilibrium() || pr.iterations == maxIterations) {
				break;
			}
		}
		if (pr.atEquilibrium() && 
			pr.preservedPageRank() &&
			pr.iterations >= minIterations &&
			pr.iterations <= maxIterations) {
			return pr;
		}
	}
}

module.exports = {PageRank};