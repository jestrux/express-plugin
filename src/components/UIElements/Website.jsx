function Website(values) {
	this.values = values;
	// this.render = () => Website.doRender(this.values, this.images);
}

Website.meta = {
	// aspectRatio: "portrait",
};

Website.label = "Website";

Website.props = {
	background: {
		type: "image",
		defaultValue:
			"https://images.unsplash.com/photo-1593697821094-53ed19153f21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjE2NXwwfDF8c2VhcmNofDMyfHxwb2RjYXN0fGVufDB8fHx8MTY3NzEzNjcyNQ&ixlib=rb-4.0.3&q=80&w=600",
	},
};

Website.render = ({ id, options }) => {
	return <div></div>;
};

Website.thumb = function () {
	return ` 
		<img class="" src="logos/website.png" />
    `;
};

export default Website;
