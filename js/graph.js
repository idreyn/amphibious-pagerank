class Graph {
	constructor(size) {
		this.matrix = [];
		this.size = size;
		for (let i=0; i<size; i++) {
			const row = [];
			for (let j=0; j<size; j++) {
				row.push(0);
			}
			this.matrix.push(row);
		}
	}

	setup(callback) {
		for (let i=0; i<this.matrix.length; i++) {
			for (let j=0; j<this.matrix.length; j++) {
				this.matrix[i][j] = callback(i, j);
			}
		}
	}

	sumRow(i) {
		return this.matrix[i].reduce((a, b) => a + b);
	}

	sumColumn(i) {
		return this.matrix.map((row) => row[i]).reduce((a, b) => a + b);
	}

	allNodesConnected() {
		for(let i=0; i<this.size; i++) {
			if (this.sumRow(i) == 0 && this.sumColumn(i) == 0) {
				return false;
			}
		}
		return true;
	}

	edgesFrom(i) {
		return this.matrix[i].filter((x) => x > 0).length;
	}

	hasEdge(i, j) {
		return !!this.matrix[i][j];
	}

	toString() {
		return this.matrix.map((row) => row.join(" ")).join("\n");
	}
}

Graph.getRandom = (size, connectivity) => {
	const gr = new Graph(size);
	gr.setup((i, j) => (i != j) && Math.random() < connectivity ? 1 : 0);
	return gr;
}

module.exports = {Graph}