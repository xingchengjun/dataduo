import type { JudgeResult } from '../types';
import { executeSQL, runSetupSQL, resetDatabase } from './useDB';

/**
 * Normalize value for comparison
 */
function normalize(val: any): any {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string') return val.trim().toLowerCase();
  if (typeof val === 'number') return Math.round(val * 10000) / 10000; // precision
  return val;
}

/**
 * Compare two result sets with tolerance
 */
function resultsMatch(
  userCols: string[],
  userVals: any[][],
  expCols: string[],
  expVals: any[][]
): boolean {
  // Compare row count
  if (userVals.length !== expVals.length) {
    return false;
  }

  // Normalize columns (case-insensitive)
  const userColsLower = userCols.map((c) => c.toLowerCase());
  const expColsLower = expCols.map((c) => c.toLowerCase());

  // Check column count
  if (new Set(userColsLower).size !== new Set(expColsLower).size) {
    return false;
  }

  // Sort both result sets for comparison
  const sortKey = (row: any[]) => row.map((v) => JSON.stringify(normalize(v))).join('|');
  const userSorted = [...userVals].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  const expSorted = [...expVals].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  // Compare row by row
  for (let i = 0; i < userSorted.length; i++) {
    const userRow = userSorted[i].map(normalize);
    const expRow = expSorted[i].map(normalize);

    if (userRow.length !== expRow.length) return false;

    for (let j = 0; j < userRow.length; j++) {
      if (JSON.stringify(userRow[j]) !== JSON.stringify(expRow[j])) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Main judge function - runs user SQL against setup DB and compares with expected
 */
export async function judgeSQL(
  setupSQL: string,
  userSQL: string,
  expectedSQL: string
): Promise<JudgeResult> {
  try {
    // Reset and setup
    await resetDatabase();

    // Run setup if provided
    if (setupSQL.trim()) {
      await runSetupSQL(setupSQL);
    }

    // Run user SQL
    const userResult = await executeSQL(userSQL);
    if (userResult.error) {
      return {
        pass: false,
        error: userResult.error,
        detail: `SQL 执行错误：${userResult.error}`,
        userTime: userResult.time,
      };
    }

    // Reset and setup again for expected
    await resetDatabase();
    if (setupSQL.trim()) {
      await runSetupSQL(setupSQL);
    }

    // Run expected SQL
    const expResult = await executeSQL(expectedSQL);

    // Compare
    const match = resultsMatch(
      userResult.columns,
      userResult.values,
      expResult.columns,
      expResult.values
    );

    // Build detail message
    let detail = '';
    if (match) {
      detail = '✅ 完全正确！你的查询返回了预期的结果。';
    } else {
      if (userResult.values.length !== expResult.values.length) {
        detail = `❌ 行数不匹配：你的查询返回了 ${userResult.values.length} 行，预期 ${expResult.values.length} 行。`;
      } else if (userResult.columns.length !== expResult.columns.length) {
        detail = `❌ 列数不匹配：你的查询返回了 ${userResult.columns.length} 列，预期 ${expResult.columns.length} 列。`;
      } else {
        detail = `❌ 结果不匹配：行数和列数相同，但数据内容不一致。请检查你的查询逻辑。`;
      }
    }

    return {
      pass: match,
      userResult: userResult.values.map((row, i) => {
        const obj: Record<string, any> = {};
        userResult.columns.forEach((col, j) => { obj[col] = row[j]; });
        return obj;
      }),
      expectedResult: expResult.values.map((row, i) => {
        const obj: Record<string, any> = {};
        expResult.columns.forEach((col, j) => { obj[col] = row[j]; });
        return obj;
      }),
      userColumns: userResult.columns,
      expectedColumns: expResult.columns,
      detail,
      userTime: userResult.time,
      expectedTime: expResult.time,
    };
  } catch (err: any) {
    return {
      pass: false,
      error: err.message || 'Unexpected error',
      detail: `系统错误：${err.message || '请重试'}`,
    };
  }
}

/**
 * Simple format for displaying query results
 */
export function formatResultTable(columns: string[], values: any[][]): string {
  if (columns.length === 0) return '(空结果)';
  const header = columns.join(' | ');
  const rows = values.map((row) => row.join(' | ')).join('\n');
  return `${header}\n${'-'.repeat(header.length)}\n${rows}`;
}
