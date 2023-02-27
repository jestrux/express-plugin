function Graph(values) {
	this.values = values;
	// this.render = () => Graph.doRender(this.values, this.images);
}

Graph.meta = {
	// aspectRatio: "portrait",
};

Graph.label = "Graph";

Graph.props = {
	background: {
		type: "image",
		defaultValue:
			"https://images.unsplash.com/photo-1593697821094-53ed19153f21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjE2NXwwfDF8c2VhcmNofDMyfHxwb2RjYXN0fGVufDB8fHx8MTY3NzEzNjcyNQ&ixlib=rb-4.0.3&q=80&w=600",
	},
};

Graph.render = ({ id, options }) => {
	return <div></div>;
};

Graph.thumb = function () {
	return ` 
		<img class="" src="logos/graph.png" />
    `;
};

export default Graph;
