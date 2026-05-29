// sql.js 接口定义
interface QueryExecResult {
  columns: string[];
  values: any[][];
}

interface Database {
  run(sql: string): Database;
  exec(sql: string): QueryExecResult[];
  close(): void;
}

interface SqlJsStatic {
  Database: new () => Database;
}

let _db: Database | null = null;
let _initPromise: Promise<Database> | null = null;
let _SQL: SqlJsStatic | null = null;

async function initEngine(): Promise<Database> {
  if (_db) return _db;

  if (!_initPromise) {
    _initPromise = (async () => {
      // 动态导入 sql.js —— 不会阻塞 React 渲染
      // 兼容不同模块格式：CJS (module.exports) 和 ESM (export default)
      const sqlJsModule = await import('sql.js');
      const initSqlJs = typeof sqlJsModule.default === 'function'
        ? sqlJsModule.default
        : (typeof sqlJsModule === 'function' ? sqlJsModule : null);

      if (!initSqlJs) {
        throw new Error('initSqlJs not found in sql.js module. Check module exports.');
      }

      _SQL = await initSqlJs({
        locateFile: (file: string) => `/sql-wasm.wasm`,
      }) as any;
      _db = new _SQL.Database();
      return _db;
    })();
  }

  return _initPromise;
}

export async function executeSQL(sql: string): Promise<{
  columns: string[];
  values: any[][];
  error?: string;
  time?: number;
}> {
  const start = performance.now();
  try {
    const db = await initEngine();
    const results = db.exec(sql);
    const end = performance.now();

    if (results.length === 0) {
      return { columns: [], values: [], time: end - start };
    }

    const result = results[results.length - 1];
    return {
      columns: result.columns,
      values: result.values.map((row) => [...row]),
      time: end - start,
    };
  } catch (err: any) {
    const end = performance.now();
    return {
      columns: [],
      values: [],
      error: err.message || 'SQL execution error',
      time: end - start,
    };
  }
}

export async function runSetupSQL(sql: string): Promise<void> {
  const db = await initEngine();
  db.run(sql);
}

export async function resetDatabase(): Promise<void> {
  if (!_SQL) return;
  _db = new _SQL.Database();
}

export async function preloadEngine(): Promise<void> {
  // 预加载 sql.js，可在首页空闲时调用
  try {
    await initEngine();
  } catch {
    // 静默失败，真正使用时再重试
  }
}
