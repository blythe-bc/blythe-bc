import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataColumn, Dataset } from '@/types';

export class DataParser {
  static async parseCSV(file: File): Promise<Dataset> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const dataset = DataParser.processTabularData(
              results.data as any[],
              file.name
            );
            resolve(dataset);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(new Error(`CSV 파싱 오류: ${error.message}`));
        }
      });
    });
  }

  static async parseJSON(file: File): Promise<Dataset> {
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      
      // JSON이 배열인지 확인
      if (!Array.isArray(data)) {
        throw new Error('JSON 파일은 객체 배열 형태여야 합니다');
      }

      return DataParser.processTabularData(data, file.name);
    } catch (error) {
      throw new Error(`JSON 파싱 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  static async parseExcel(file: File): Promise<Dataset> {
    const buffer = await file.arrayBuffer();
    try {
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // 첫 번째 행을 헤더로, 나머지를 데이터로 처리
      const headers = data[0] as string[];
      const rows = data.slice(1) as any[][];

      const processedData = rows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      return DataParser.processTabularData(processedData, file.name);
    } catch (error) {
      throw new Error(`Excel 파싱 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  static async parseFile(file: File): Promise<Dataset> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'csv':
        return DataParser.parseCSV(file);
      case 'json':
        return DataParser.parseJSON(file);
      case 'xlsx':
      case 'xls':
        return DataParser.parseExcel(file);
      case 'txt':
      case 'tsv':
        // TSV는 CSV와 동일하게 처리하되 구분자만 탭으로 변경
        return new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            delimiter: '\t',
            skipEmptyLines: true,
            complete: (results) => {
              try {
                const dataset = DataParser.processTabularData(
                  results.data as any[],
                  file.name
                );
                resolve(dataset);
              } catch (error) {
                reject(error);
              }
            },
            error: (error) => {
              reject(new Error(`TSV 파싱 오류: ${error.message}`));
            }
          });
        });
      default:
        throw new Error(`지원하지 않는 파일 형식: ${extension}`);
    }
  }

  private static processTabularData(data: any[], fileName: string): Dataset {
    if (!data || data.length === 0) {
      throw new Error('빈 데이터 파일입니다');
    }

    // 첫 번째 행에서 컬럼 이름 추출
    const firstRow = data[0];
    const columnNames = Object.keys(firstRow);

    if (columnNames.length === 0) {
      throw new Error('컬럼을 찾을 수 없습니다');
    }

    // 각 컬럼의 데이터 타입과 값들 분석
    const columns: DataColumn[] = columnNames.map(columnName => {
      const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined && val !== '');
      const dataType = DataParser.inferDataType(values);

      return {
        name: columnName,
        type: dataType,
        values: values
      };
    });

    return {
      name: fileName.replace(/\.[^/.]+$/, ''), // 확장자 제거
      columns,
      rowCount: data.length,
      filePath: fileName
    };
  }

  private static inferDataType(values: any[]): 'number' | 'string' | 'date' | 'boolean' {
    if (values.length === 0) return 'string';

    // 숫자 타입 체크
    const numericValues = values.filter(val => {
      const num = Number(val);
      return !isNaN(num) && isFinite(num);
    });

    if (numericValues.length / values.length > 0.8) {
      return 'number';
    }

    // 불린 타입 체크
    const booleanValues = values.filter(val => {
      const str = String(val).toLowerCase();
      return str === 'true' || str === 'false' || str === '1' || str === '0' || str === 'yes' || str === 'no';
    });

    if (booleanValues.length / values.length > 0.8) {
      return 'boolean';
    }

    // 날짜 타입 체크
    const dateValues = values.filter(val => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    });

    if (dateValues.length / values.length > 0.8) {
      return 'date';
    }

    return 'string';
  }

  static getStatistics(column: DataColumn) {
    const { values, type } = column;
    
    if (type === 'number') {
      const numValues = values.map(v => Number(v)).filter(v => !isNaN(v));
      
      if (numValues.length === 0) {
        return { count: 0 };
      }

      const sorted = [...numValues].sort((a, b) => a - b);
      const sum = numValues.reduce((a, b) => a + b, 0);
      const mean = sum / numValues.length;
      
      return {
        count: numValues.length,
        min: Math.min(...numValues),
        max: Math.max(...numValues),
        mean: mean,
        median: sorted[Math.floor(sorted.length / 2)],
        std: Math.sqrt(numValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numValues.length)
      };
    }

    // 문자열 컬럼의 경우 빈도 분석
    const frequencyMap = new Map<string, number>();
    values.forEach(val => {
      const str = String(val);
      frequencyMap.set(str, (frequencyMap.get(str) || 0) + 1);
    });

    const sortedEntries = Array.from(frequencyMap.entries()).sort((a, b) => b[1] - a[1]);

    return {
      count: values.length,
      unique: frequencyMap.size,
      most_frequent: sortedEntries[0]?.[0],
      frequency_top_5: sortedEntries.slice(0, 5)
    };
  }
}