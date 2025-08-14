export interface FileInfo {
  name: string;
  path: string;
  extension: string;
  size: number;
  lastModified: Date;
}

export interface DataColumn {
  name: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  values: any[];
}

export interface Dataset {
  name: string;
  columns: DataColumn[];
  rowCount: number;
  filePath: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'pie' | 'area' | 'histogram';
  title: string;
  xAxis?: string;
  yAxis?: string[];
  groupBy?: string;
  aggregation?: 'sum' | 'mean' | 'count' | 'max' | 'min';
}

export interface NetworkFolder {
  path: string;
  name: string;
  isConnected: boolean;
  supportedExtensions: string[];
}

export interface MLModel {
  type: 'regression' | 'classification' | 'clustering';
  name: string;
  features: string[];
  target?: string;
  parameters: Record<string, any>;
}

export interface AnalysisResult {
  type: string;
  summary: string;
  insights: string[];
  recommendations: string[];
  confidence: number;
}