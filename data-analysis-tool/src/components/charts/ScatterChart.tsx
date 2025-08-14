"use client";

import React from 'react';
import BaseChart from './BaseChart';

interface ScatterChartProps {
  data: [number, number][];
  title?: string;
  xAxisName?: string;
  yAxisName?: string;
  color?: string;
  height?: string | number;
}

export default function ScatterChart({ 
  data, 
  title = "Scatter Chart",
  xAxisName = "",
  yAxisName = "",
  color = "#8b5cf6",
  height = 400
}: ScatterChartProps) {
  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: `${xAxisName}: {data[0]}<br/>${yAxisName}: {data[1]}`
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: xAxisName,
      nameLocation: 'middle',
      nameGap: 30,
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameLocation: 'middle',
      nameGap: 50,
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: `${xAxisName} vs ${yAxisName}`,
        type: 'scatter',
        data: data,
        symbolSize: function (data: [number, number]) {
          return Math.sqrt(Math.abs(data[1])) * 2 + 5;
        },
        itemStyle: {
          color: color,
          opacity: 0.7
        },
        emphasis: {
          itemStyle: {
            color: color,
            opacity: 1,
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      }
    ]
  };

  return <BaseChart option={option} height={height} />;
}