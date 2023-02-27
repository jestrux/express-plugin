import Highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import * as ChartModuleMore from "highcharts/highcharts-more.js";
import SolidGauge from "highcharts/modules/solid-gauge";
import Cylinder from "highcharts/modules/cylinder";
import HeatMap from "highcharts/modules/heatmap";
import TileMap from "highcharts/modules/tilemap";
import Venn from "highcharts/modules/venn";

import AppleRings from "./AppleRings";
import BarGraph from "./BarGraph";
import BasicPierChart from "./BasicPierChart";
import CylinderGraph from "./CylinderGraph";
import HoneyComb from "./HoneyComb";
import Speedometer from "./Speedometer";
import VennDiagram from "./VennDiagram";

highcharts3d(Highcharts);
ChartModuleMore(Highcharts);
SolidGauge(Highcharts);
Cylinder(Highcharts);
HeatMap(Highcharts);
TileMap(Highcharts);
Venn(Highcharts);

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
	return (
		<div>
			<VennDiagram options={options} />

			{/* <AppleRings chart={Highcharts} options={options} /> */}
			{/* <BarGraph chart={Highcharts} options={options} /> */}
			{/* <BasicPierChart chart={Highcharts} options={options} /> */}
			{/* <CylinderGraph chart={Highcharts} options={options} /> */}
			{/* <HoneyComb chart={Highcharts} options={options} /> */}
			{/* <Speedometer chart={Highcharts} options={options} /> */}
		</div>
	);
};

Graph.thumb = function () {
	return ` 
		<img class="" src="logos/graph.png" />
    `;
};

export default Graph;
