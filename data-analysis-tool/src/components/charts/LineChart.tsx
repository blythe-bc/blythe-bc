"use client";

import React from 'react';
import BaseChart from './BaseChart';
import { DataColumn } from '@/types';

interface LineChartProps {
  xData: string[] | number[];
  yData: number[];
  title?: string;
  xAxisName?: string;
  yAxisName?: string;
  color?: string;
  height?: string | number;
}

export default function LineChart({ 
  xData, 
  yData, 
  title = "Line Chart",
  xAxisName = "",
  yAxisName = "",
  color = "#3b82f6",
  height = 400
}: LineChartProps) {
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
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      top: '8%',
      left: 'center'
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
      boundaryGap: false,
      data: xData,
      name: xAxisName,
      nameLocation: 'middle',
      nameGap: 30
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
        type: 'line',
        smooth: true,
        lineStyle: {
          color: color,
          width: 2
        },
        itemStyle: {
          color: color
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color + '40' },
              { offset: 1, color: color + '10' }
            ]
          }
        },
        data: yData
      }
    ]
  };

  return <BaseChart option={option} height={height} />;
}