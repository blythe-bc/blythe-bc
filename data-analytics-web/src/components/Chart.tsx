"use client";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

export type ChartProps = {
	title?: string;
	x: (string | number)[];
	series: { name: string; data: (number | null)[] }[];
	height?: number;
};

export default function Chart({ title, x, series, height = 360 }: ChartProps) {
	const option: echarts.EChartsOption = {
		title: { text: title },
		tooltip: { trigger: "axis" },
		legend: { top: 8 },
		grid: { left: 24, right: 24, top: 48, bottom: 24 },
		xAxis: { type: "category", data: x },
		yAxis: { type: "value", scale: true },
		series: series.map((s) => ({ name: s.name, type: "line", data: s.data, smooth: true })),
	};
	return <ReactECharts option={option} style={{ height }} />;
}