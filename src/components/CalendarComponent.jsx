import React, { useEffect, useRef, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import staticImages from "../staticImages";
import ImagePicker from "./ImagePicker";
import ComponentFields from "./tokens/ComponentFields";
import {
	backgroundSpec,
	solidGradientBg,
	loadImageFromUrl,
	showPreview,
	resizeToAspectRatio,
} from "./utils";

const weekDaysFromSunday = ["S", "M", "T", "W", "T", "F", "S"];
const weekDaysFromMonday = ["M", "T", "W", "T", "F", "S", "S"];
const shortMonths = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

function getCalendarDays(date = new Date(), { fromMonday = false } = {}) {
	date = new Date(date);

	const weekDays = fromMonday ? weekDaysFromMonday : weekDaysFromSunday;
	let dayArray = [];

	let curMonth = date.getMonth();
	let curYear = date.getFullYear();

	function populateCalendar(month, year, onInit) {
		curMonth = month;
		curYear = year;

		let ldate = new Date(year, month);
		let dt = new Date(ldate);
		let weekDay = fromMonday
			? dt.getDay() > 0
				? dt.getDay() - 1
				: 6
			: dt.getDay();

		if (ldate.getDate() === 1) {
			dayArray = lastDaysOfPrevMonth(weekDay);
		}

		while (ldate.getMonth() === month) {
			dt = new Date(ldate);

			dayArray.push(
				dateTpl(false, ldate.getDate(), areSameDate(ldate, date))
			);

			ldate.setDate(ldate.getDate() + 1);

			const bufferDays = 42 - dayArray.length;
			if (ldate.getMonth() != month) {
				Array(bufferDays)
					.fill(1)
					.forEach((_, index) =>
						dayArray.push(dateTpl(true, index + 1))
					);
			}
		}
	}

	function lastDaysOfPrevMonth(day) {
		if (curMonth > 0) {
			var monthIdx = curMonth - 1;
			var yearIdx = curYear;
		} else {
			if (curMonth < 11) {
				var monthIdx = 0;
				var yearIdx = curYear + 1;
			} else {
				var monthIdx = 11;
				var yearIdx = curYear - 1;
			}
		}

		return getMonthDays(monthIdx, yearIdx)
			.reverse()
			.slice(0, day)
			.reverse()
			.map((day) => dateTpl(true, day));
	}

	function dateTpl(blurred, date, selected) {
		return {
			blurred,
			date,
			selected,
		};
	}

	function areSameDate(d1, d2) {
		return (
			d1.getFullYear() == d2.getFullYear() &&
			d1.getMonth() == d2.getMonth() &&
			d1.getDate() == d2.getDate()
		);
	}

	function getMonthDays(month, year) {
		var date = new Date(year, month, 1);
		var days = [];
		while (date.getMonth() === month) {
			days.push(date.getDate());
			date.setDate(date.getDate() + 1);
		}
		return days;
	}

	populateCalendar(curMonth, curYear, true);

	return [weekDays, dayArray];
}

class CalendarDrawer {
	columnSize = 50;
	constructor() {
		const canvas = document.createElement("canvas");
		canvas.width = 800;
		canvas.height = 300;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	async draw(props = {}) {
		Object.assign(this, props);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.img = await loadImageFromUrl(props.src);

		return this.drawImage();
	}

	getCalendar() {
		const strokeWidth = 1;
		const columnSize = this.columnSize;
		const canvas = document.createElement("canvas");
		canvas.width = columnSize * 7;
		canvas.height = columnSize * 6;
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		const [columns, entries] = getCalendarDays(this.date, {
			fromMonday: this.fromMonday,
		});

		ctx.beginPath();
		ctx.globalAlpha = 0.2;
		for (var i = 1; i < 7; i++) {
			if (i < 6) {
				ctx.moveTo(0, i * columnSize);
				ctx.lineTo(columnSize * 7, i * columnSize);
			}

			ctx.moveTo(i * columnSize, 0);
			ctx.lineTo(i * columnSize, columnSize * 7);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.globalAlpha = 1;

		[...columns, ...entries].forEach((entry, i) => {
			const row = Math.floor(i / 7);
			const col = i % 7;

			ctx.save();
			if (entry.blurred) ctx.globalAlpha = 0.4;
			if (entry.selected) {
				ctx.globalAlpha = 0.1;
				ctx.fillRect(
					columnSize * col,
					columnSize * row,
					columnSize,
					columnSize
				);

				ctx.globalAlpha = 1;
			}

			const fontSize = 20;
			ctx.font = `500 ${fontSize}px Helvetica`;
			const text = entry.date || entry;
			const metrics = ctx.measureText(text);

			ctx.fillText(
				text,
				columnSize * col + (columnSize - metrics.width) / 2,
				columnSize * (row + 1) -
					(columnSize - fontSize) / 2 -
					strokeWidth * 2
			);
			ctx.restore();
		});

		return canvas;
	}

	async drawImage() {
		let fontSize = 30;
		const calendar = this.getCalendar();

		if (this.bare) return calendar.toDataURL();

		this.canvas.height = calendar.height;
		this.canvas.width = calendar.width + fontSize + 20;

		const height = this.canvas.height;
		const width = this.canvas.width;
		const ctx = this.ctx;

		const date = new Date(this.date);
		const text =
			date
				.toLocaleString("en-US", {
					month: "short",
				})
				.toUpperCase() +
			"·" +
			date.getFullYear();

		ctx.font = `bold ${fontSize}px Helvetica`;
		let metric = ctx.measureText(text);

		// while (metric.width > height - fontSize) {
		// 	fontSize -= 10;
		// 	ctx.font = `bold ${fontSize}px Helvetica`;
		// 	metric = ctx.measureText(text);
		// }

		ctx.fillStyle = solidGradientBg(this.canvas, this.background);
		ctx.roundRect(0, 0, width, height, 10);
		ctx.fill();
		ctx.clip();

		ctx.globalAlpha = this.imageOpacity;
		ctx.drawImage(
			resizeToAspectRatio(this.img, width / height),
			fontSize + 25,
			0
		);
		ctx.globalAlpha = 1;
		ctx.drawImage(calendar, width - calendar.width, 0);

		// ctx.fillStyle = solidGradientBg(this.canvas, this.background);
		// ctx.fillRect(0, 0, fontSize + 25, height);
		// ctx.globalAlpha = 1;

		ctx.fillStyle = this.color;
		ctx.font = `bold ${fontSize - 10}px Helvetica`;
		ctx.textAlign = "center";
		text.split("").forEach((letter, i) => {
			ctx.fillText(letter, 28, fontSize + 3 + (fontSize + 3) * i);
		});

		showPreview(this.canvas.toDataURL());

		return this.canvas.toDataURL();
	}
}

export default function CalendarComponent() {
	const previewRef = useRef(null);
	const calendarDrawerRef = useRef((data) => {
		if (!window.calendarDrawer)
			window.calendarDrawer = new CalendarDrawer();

		window.calendarDrawer.draw(data).then(setUrl);
	});
	const [url, setUrl] = useState();
	const [data, updateField] = useDataSchema(
		{
			src: staticImages.presets.calendar,
			date: new Intl.DateTimeFormat("en-US")
				.format(new Date())
				.split("/")
				.reverse()
				.map((entry) => entry.padStart(2, "0"))
				.join("-"),
			fromMonday: false,
			bare: false,
			imageOpacity: 0.7,
			color: "white",
			background: {
				type: "color",
				color: "#ffc414",
				gradient: ["#737DFE", "#FFCAC9"],
			},
		},
		calendarDrawerRef.current
	);

	useEffect(() => {
		calendarDrawerRef.current(data);

		window.AddOnSdk?.app.enableDragToDocument(previewRef.current, {
			previewCallback: (element) => {
				return new URL(element.src);
			},
			completionCallback: exportImage,
		});
	}, []);

	const exportImage = async (e) => {
		const fromDrag = e?.target?.nodeName != "IMG";
		const blob = await fetch(previewRef.current.src).then((response) =>
			response.blob()
		);

		if (fromDrag) return [{ blob }];
		else window.AddOnSdk?.app.document.addImage(blob);
	};

	return (
		<>
			<div
				className="relative relative border-b flex center-center p-3"
				style={{ display: !url ? "none" : "" }}
			>
				<div className="image-item relative" draggable="true">
					<img
						onClick={exportImage}
						ref={previewRef}
						className="drag-target max-w-full"
						src={url}
						style={{ maxHeight: "20vh" }}
					/>
				</div>
			</div>

			<div className="px-12px mt-2">
				<div className="my-4">
					<ImagePicker onChange={(src) => updateField("src", src)} />
				</div>

				<ComponentFields
					schema={{
						date: "date",
						bare: "boolean",
						fromMonday: "boolean",
						imageOpacity: {
							type: "range",
							min: 0,
							max: 1,
							meta: { min: 0, step: 0.1, max: 1 },
							show: (state) => !state.bare,
						},
						// border: {
						// 	type: "color",
						// 	meta: { showTransparent: true },
						// },
						color: "color",
						background: backgroundSpec({
							showTransparent: false,
							show: (state) => !state.bare,
						}),
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}
