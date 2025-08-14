"use client";

import React from 'react';
import BaseChart from './BaseChart';

interface BarChartProps {
  xData: string[];
  yData: number[];
  title?: string;
  xAxisName?: string;
  yAxisName?: string;
  color?: string;
  height?: string | number;
}

export default function BarChart({ 
  xData, 
  yData, 
  title = "Bar Chart",
  xAxisName = "",
  yAxisName = "",
  color = "#10b981",
  height = 400
}: BarChartProps) {
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
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
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
      type: 'category',
      data: xData,
      name: xAxisName,
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        rotate: xData.some(x => x.length > 8) ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameLocation: 'middle',
      nameGap: 50
    },
    series: [
      {
        name: yAxisName || 'Value',
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color },
              { offset: 1, color: color + '80' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: color
          }
        },
        data: yData
      }
    ]
  };

  return <BaseChart option={option} height={height} />;
}