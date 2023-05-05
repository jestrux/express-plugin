import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./tokens/ComponentFields";
import { backgroundSpec, showPreview, solidGradientBg } from "./utils";
import staticImages from "../staticImages";
import { loadImageFromUrl } from "./utils";
import { resizeImage } from "./utils";
import { resizeToAspectRatio } from "./utils";
import useImage from "../hooks/useImage";
import DraggableImage from "./tokens/DraggableImage";
import Loader from "./tokens/Loader";
import ComponentFieldEditor from "./tokens/ComponentFieldEditor";

const mapBlobs = [
	{
		width: 1882.145,
		height: 2000,
		path: "M 1707.61 1235.52 C 1500.66 1379.71 1342.05 1516.26 1231.78 1645.19 C 1121.52 1774.11 964.607 1880.98 761.044 1965.8 C 557.48 2050.62 425.163 1977.67 364.094 1746.97 C 303.025 1516.26 213.966 1337.3 96.917 1210.07 C -20.1317 1082.84 -31.158 947.133 63.838 802.942 C 158.834 658.751 242.803 467.063 315.744 227.877 C 388.69 -11.3123 527.793 -62.204 733.053 75.202 C 938.313 212.608 1123.22 315.238 1287.76 383.092 C 1452.31 450.949 1615.16 573.935 1776.32 752.051 C 1937.47 930.167 1914.57 1091.32 1707.61 1235.52 Z",
	},
	{
		width: 1933.237,
		height: 2000,
		path: "M 1925.69 1350.67 C 1897.55 1560.89 1797.4 1739.66 1625.25 1886.97 C 1453.1 2034.29 1273.5 2037.6 1086.46 1896.9 C 899.409 1756.21 713.19 1670.96 527.799 1641.17 C 342.408 1611.38 195.088 1502.96 85.839 1315.91 C -23.4097 1128.87 -28.3763 938.52 70.939 744.857 C 170.254 551.194 298.539 384.015 455.794 243.32 C 613.045 102.625 804.23 22.3457 1029.35 2.483 C 1254.47 -17.3797 1402.62 81.9347 1473.79 300.426 C 1544.97 518.917 1645.11 696.028 1774.23 831.758 C 1903.34 967.488 1953.82 1140.46 1925.69 1350.67 Z",
	},
	{
		width: 2404.874,
		height: 2000,
		path: "M 2266.53 1119.5 C 2110.76 1249.29 1988.74 1361.78 1900.47 1456.96 C 1812.21 1552.14 1719.61 1668.09 1622.7 1804.81 C 1525.77 1941.53 1395.1 2006.42 1230.68 1999.5 C 1066.26 1992.58 946.844 1909.51 872.425 1750.3 C 798.003 1591.08 671.659 1494.17 493.394 1459.56 C 315.129 1424.94 177.533 1327.17 80.608 1166.22 C -16.314 1005.28 -25.833 840.008 52.051 670.411 C 129.935 500.814 219.068 342.465 319.451 195.366 C 419.834 48.2667 562.619 -15.7647 747.807 3.272 C 932.995 22.3087 1087.89 54.3243 1212.51 99.319 C 1337.12 144.314 1498.94 133.066 1697.98 65.573 C 1897.01 -1.91967 2026.82 48.266 2087.4 216.13 C 2147.97 383.997 2231.92 544.077 2339.22 696.37 C 2446.53 848.663 2422.3 989.706 2266.53 1119.5 Z",
	},
	{
		width: 2098.511,
		height: 2000,
		path: "M 2008.67 1080.64 C 1887.23 1172.12 1814.87 1266.92 1791.58 1365.05 C 1768.29 1463.19 1715.89 1540.53 1634.38 1597.08 C 1552.87 1653.63 1486.33 1752.59 1434.76 1893.97 C 1383.19 2035.34 1294.2 2035.34 1167.77 1893.97 C 1041.35 1752.59 940.704 1672.76 865.847 1654.46 C 790.99 1636.16 673.714 1674.42 514.019 1769.22 C 354.324 1864.03 228.73 1868.19 137.238 1781.7 C 45.746 1695.21 0 1587.1 0 1457.36 C 0 1327.63 45.746 1209.54 137.238 1103.09 C 228.73 996.645 262 901.008 237.047 816.183 C 212.095 731.358 209.6 644.869 229.561 556.716 C 249.522 468.563 264.494 352.968 274.475 209.929 C 284.456 66.891 357.65 10.3407 494.057 40.278 C 630.464 70.2153 745.245 86.8467 838.4 90.172 C 931.555 93.4987 1024.71 93.4987 1117.87 90.172 C 1211.02 86.8453 1330.79 63.561 1477.18 20.319 C 1623.57 -22.9257 1738.35 2.85467 1821.52 97.66 C 1904.7 192.465 1924.66 311.388 1881.41 454.427 C 1838.16 597.466 1878.91 714.725 2003.67 806.204 C 2128.44 897.683 2130.1 989.161 2008.67 1080.64 Z",
	},
];

class MapComponentDrawer {
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		this.padding = 50;
		canvas.width = 1521.984 + this.padding * 2;
		canvas.height = 1093.548 + this.padding * 2;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);

		const canvas = this.canvas;
		if (this.shape == "circle") {
			canvas.width = 1500;
			canvas.height = 1500;
		} else if (this.shape == "blob") {
			const { width, height } = mapBlobs[this.blob];
			canvas.width = width + this.padding * 2;
			canvas.height = height + this.padding * 2;
		} else {
			canvas.width = 1500 + this.padding * 2;
			canvas.height = 1000 + this.padding * 2;
		}

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.markerPlacement = "center";

		return this.drawImage();
	}

	getMarker() {
		const width = 1444.616;
		const height = 1775.262;
		const strokeWidth = width * 0.05;
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = width + strokeWidth * 2;
		canvas.height = height + strokeWidth * 2;

		ctx.translate(strokeWidth, strokeWidth);
		ctx.fillStyle = solidGradientBg(canvas, this.markerColor);
		const path = new Path2D(
			"M 682.036 1762.35 L 688.161 1765.85 L 690.609 1767.25 C 710.358 1777.93 734.16 1777.93 753.909 1767.25 L 756.357 1765.94 L 762.574 1762.34 C 796.817 1742.04 830.204 1720.38 862.736 1697.38 C 946.88 1637.97 1025.5 1571.1 1097.64 1497.58 C 1267.84 1323.35 1444.61 1061.57 1444.61 724.757 C 1445.57 466.063 1308.11 226.607 1084.23 96.9828 C 860.352 -32.6418 584.246 -32.6403 360.37 96.9868 C 136.494 226.614 -0.963991 466.071 0 724.765 C 0 1061.51 176.852 1323.36 346.97 1497.58 C 419.077 1571.1 497.661 1637.97 581.77 1697.38 C 614.303 1720.37 647.727 1742.03 682.041 1762.35 Z M 722.311 987.423 C 828.547 987.423 924.323 923.427 964.977 825.277 C 1005.63 727.127 983.158 614.152 908.036 539.033 C 832.914 463.914 719.938 441.444 621.79 482.101 C 523.641 522.759 459.648 618.537 459.652 724.773 C 459.658 869.831 577.253 987.423 722.312 987.423 Z"
		);

		ctx.fill(path, "evenodd");

		ctx.strokeStyle = "#fff";
		ctx.shadowColor = "rgba(0,0,0,0.15)";
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.lineWidth = strokeWidth;
		ctx.stroke(path);

		return canvas;
	}

	getFoldedMap() {
		const width = this.canvas.width;
		const height = this.canvas.height;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;

		const slope = height / 10;
		const segmentWidth = (width - this.padding * 2) / 4;
		const segmentHeight = height - this.padding * 2;

		ctx.save();
		ctx.translate(this.padding, this.padding);
		ctx.beginPath();
		ctx.fillStyle = "rgba(0,0,0,0.2)";
		ctx.filter = "blur(20px)";

		ctx.moveTo(0, segmentHeight);
		ctx.lineTo(segmentWidth, segmentHeight - slope * 3);
		ctx.lineTo(segmentWidth * 2, segmentHeight - 30);

		ctx.lineTo(segmentWidth * 3, segmentHeight - slope * 3);
		ctx.lineTo(segmentWidth * 4, segmentHeight - 30);
		ctx.lineTo(0, segmentHeight - 30);
		ctx.fill();

		ctx.restore();

		ctx.lineWidth = 20;
		ctx.fillStyle = this.background || "transparent";
		ctx.save();
		ctx.translate(this.padding, this.padding);
		ctx.beginPath();
		ctx.moveTo(50, slope);
		ctx.lineTo(segmentWidth, 0);
		ctx.lineTo(segmentWidth * 2, slope);
		ctx.lineTo(segmentWidth * 3, 0);
		ctx.lineTo(segmentWidth * 4 - 50, slope);
		ctx.lineTo(segmentWidth * 4, segmentHeight - 50);
		ctx.lineTo(segmentWidth * 3, segmentHeight - slope);
		ctx.lineTo(segmentWidth * 2, segmentHeight - 50);
		ctx.lineTo(segmentWidth, segmentHeight - slope);
		ctx.lineTo(0, segmentHeight - 50);
		ctx.lineTo(65, slope - 20);
		ctx.strokeStyle = "#fff";
		ctx.shadowColor = "rgba(0,0,0,0.15)";
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.lineWidth = 50;
		ctx.stroke();

		ctx.restore();
		ctx.clip();

		ctx.save();
		ctx.transform(1.08, -0.1, -0.1, 1.08, 0, 0);
		ctx.drawImage(
			resizeImage(resizeToAspectRatio(this.img, width / height), {
				width,
				height,
			}),
			0,
			0
		);
		ctx.restore();

		ctx.save();
		ctx.translate(this.padding, this.padding);

		ctx.beginPath();
		ctx.moveTo(segmentWidth, 0);
		ctx.lineTo(segmentWidth, segmentHeight - slope);

		ctx.moveTo(segmentWidth * 2, slope);
		ctx.lineTo(segmentWidth * 2, segmentHeight);

		ctx.moveTo(segmentWidth * 3, 0);
		ctx.lineTo(segmentWidth * 3, segmentHeight - slope);

		ctx.strokeStyle = "rgba(0,0,0,0.5)";
		ctx.lineWidth = 5;
		ctx.filter = "blur(20px)";
		ctx.closePath();
		ctx.stroke();

		ctx.filter = "none";
		ctx.beginPath();
		ctx.moveTo(segmentWidth, 0);
		ctx.lineTo(segmentWidth, segmentHeight - slope);
		ctx.lineTo(segmentWidth * 2, segmentHeight);
		ctx.lineTo(segmentWidth * 2, slope);

		ctx.moveTo(segmentWidth * 3, 0);
		ctx.lineTo(segmentWidth * 3, segmentHeight - slope);
		ctx.lineTo(segmentWidth * 4, segmentHeight);
		ctx.lineTo(segmentWidth * 4, slope);

		ctx.fillStyle = "rgba(0,0,0,0.08)";
		ctx.fill();
		ctx.restore();

		return canvas;
	}

	getRegularMap() {
		const width = this.canvas.width;
		const height = this.canvas.height;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;

		ctx.save();
		ctx.drawImage(
			resizeImage(resizeToAspectRatio(this.img, width / height), {
				width,
				height,
			}),
			0,
			0
		);
		ctx.restore();

		return canvas;
	}

	drawImage() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		if (this.shape == "blob") {
			ctx.clip(new Path2D(mapBlobs[this.blob].path));
		}
		if (this.shape == "circle") {
			const radius = width / 2;
			ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
			ctx.clip();
		}

		ctx.save();

		const folded = this.shape == "folded";
		if (folded) {
			const rx = width / 2;
			const ry = height / 2;
			ctx.translate(rx, ry);
			ctx.rotate((-10 * Math.PI) / 180);
			ctx.translate(-rx, -ry);

			ctx.transform(0.9, 0, 0, 0.9, 0, 0);
		}

		ctx.drawImage(
			folded ? this.getFoldedMap() : this.getRegularMap(),
			0,
			folded ? 20 : 0
		);
		ctx.restore();

		const size = {
			small: height * 0.068,
			regular: height * 0.085,
			large: height * 0.11,
		}[this.markerSize];
		ctx.save();

		if (folded) ctx.transform(0.9, -0.01, 0, 0.908, 0, 18);

		ctx.shadowColor = "rgba(0,0,0,0.15)";
		ctx.shadowBlur = 15;
		ctx.shadowOffsetX = -10;
		ctx.shadowOffsetY = 20;

		const centerY = (height - size) / 2 - size / 2;
		let markerPlacement = [(width - size) / 2, centerY];

		if (folded) {
			if (this.markerPlacement == "left")
				markerPlacement = [width / 4 - size / 2 + 20, centerY];
			if (this.markerPlacement == "right")
				markerPlacement = [(width * 3) / 4 - size / 2, centerY];
		}

		ctx.drawImage(
			resizeImage(this.getMarker(), { width: size, height: size }),
			...markerPlacement
		);
		ctx.restore();

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

export default function MapComponent() {
	const [data, updateField] = useDataSchema({
		src: staticImages.mapRegular,
		shape: "folded",
		blob: 0,
		markerSize: "large",
		markerColor: {
			type: "gradient",
			color: "#DC3535",
			gradient: ["#d53369", "#daae51"],
		},
	});

	const { loading, image: img } = useImage(data.src);

	return (
		<>
			<div className="px-12px mt-1">
				<ComponentFields
					schema={{
						src: {
							type: "card",
							label: "Map theme",
							choices: ["mapRegular", "mapDark", "mapGreen"].map(
								(label) => {
									return {
										label: label.replace("map", ""),
										value: staticImages[label],
									};
								}
							),
						},
						markerColor: backgroundSpec(),
					}}
					onChange={updateField}
					data={data}
				/>

				<div className="mt-3"></div>

				<ComponentFields
					schema={{
						...(loading || !img
							? {}
							: {
									picker: {
										type: "grid",
										label: "",
										hint: "Click (or drag and drop) image to add it to your canvas",
										choices: [
											"folded",
											// "circle",
											"blob0",
											"blob1",
											"blob2",
										],
										noBorder: true,
										meta: {
											transparent: true,
											columns: 2,
											aspectRatio: "2/2",
											gap: "1.25rem",
											render(shape) {
												const url =
													new MapComponentDrawer().draw(
														{
															...data,
															img,
															shape:
																shape.indexOf(
																	"blob"
																) != -1
																	? "blob"
																	: shape,
															blob: Number(
																shape.replace(
																	"blob",
																	""
																) ?? 0
															),
														}
													);
												return (
													<DraggableImage
														className="h-full max-w-full object-fit"
														src={url}
														style={{
															objectFit:
																"contain",
															filter: "drop-shadow(0.5px 0.5px 0.5px rgba(0, 0, 0, 0.4))",
														}}
													/>
												);
											},
										},
									},
							  }),
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
