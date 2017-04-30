const randomColor = require("randomcolor");

const colors = [];
for (let i=0; i<100; i++) {
	colors.push(randomColor({
		luminosity: 'bright',
		format: 'hex',
	}));
}

function drawPageRank(ctx, pr, step=0, size) {
	const web = pr.web;
	const center = {x: size.x / 2, y: size.y / 2};
	const graphRadius = size.x / 3;
	ctx.clearRect(0, 0, size.x, size.y);

	const position = (index) => {
		const x = center.x + Math.cos(index * 2 * Math.PI / web.size) * graphRadius;
		const y = center.y + Math.sin(index * 2 * Math.PI / web.size) * graphRadius;
		return {x, y};
	}

	const angle = (i, j) => {
		const pi = position(i);
		const pj = position(j);
		return Math.atan2(pj.y - pi.y, pj.x - pi.x);
	}

	const nodeSize = (i) => Math.max(
		3, Math.sqrt(pr.history[step][i]) * 5
	);

	const drawNodes = () => {
		for (let i=0; i<web.size; i++) {
			let {x, y} = position(i);
			ctx.fillStyle = colors[i];
			ctx.beginPath();
			ctx.arc(x, y, nodeSize(i), 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font = "12pt monospace";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(String.fromCharCode(65 + i), x, y);
		}
	}

	const drawEdges = () => {
		ctx.strokeStyle = "black";
		for (let i=0; i<web.size; i++) {
			for (let j=0; j<web.size; j++) {
				if (web.hasEdge(i, j)) {
					const pi = position(i);
					const pj = position(j);
					const theta = angle(j, i);
					const offset = 5;
					const start = {
						x: pi.x - Math.cos(theta) * (offset + nodeSize(i)),
						y: pi.y - Math.sin(theta) * (offset + nodeSize(i)),
					};
					const end = {
						x: pj.x + Math.cos(theta) * (offset + nodeSize(j)),
						y: pj.y + Math.sin(theta) * (offset + nodeSize(j)),
					};
					ctx.beginPath();
					ctx.moveTo(start.x, start.y);
					ctx.lineTo(end.x, end.y);
					ctx.stroke();
					drawArrowhead(end, theta);
				}
			}
		}
	};

	const drawArrowhead = (point, theta, length=10, angle=Math.PI/4) => {
		const arrowPoint1 = {
			x: point.x + Math.cos(angle + theta) * length,
			y: point.y + Math.sin(angle + theta) * length,
		};
		const arrowPoint2 = {
			x: point.x + Math.cos(theta - angle) * length,
			y: point.y + Math.sin(theta - angle) * length,
		};
		ctx.beginPath();
		ctx.moveTo(point.x, point.y);
		ctx.lineTo(arrowPoint1.x, arrowPoint1.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(point.x, point.y);
		ctx.lineTo(arrowPoint2.x, arrowPoint2.y);
		ctx.stroke();
		
	}

	drawEdges();
	drawNodes();
}

module.exports = {drawPageRank}