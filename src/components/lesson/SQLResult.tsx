import type { JudgeResult } from '../../types';

interface SQLResultProps {
  result: JudgeResult | null;
}

export default function SQLResult({ result }: SQLResultProps) {
  if (!result) {
    return (
      <div className="text-center py-8 text-duo-text-secondary">
        <div className="text-4xl mb-2">💡</div>
        <p>输入 SQL 并点击「运行」查看结果</p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="bg-duo-red-light rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">❌</span>
          <span className="font-bold text-duo-red">SQL 执行错误</span>
        </div>
        <pre className="text-sm font-mono text-red-700 whitespace-pre-wrap bg-red-50/50 p-3 rounded-xl">
          {result.error}
        </pre>
      </div>
    );
  }

  const { pass, userColumns, userResult, expectedColumns, expectedResult, detail, userTime, expectedTime } = result;

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div className={`rounded-2xl p-4 ${pass ? 'bg-duo-green-light' : 'bg-duo-red-light'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{pass ? '✅' : '❌'}</span>
          <span className={`font-bold text-lg ${pass ? 'text-duo-green' : 'text-duo-red'}`}>
            {pass ? '回答正确！' : '还需要调整'}
          </span>
        </div>
        <p className="text-sm text-duo-text-secondary">{detail}</p>
        {userTime && (
          <p className="text-xs text-duo-text-secondary mt-1">
            执行耗时：{userTime.toFixed(1)}ms{expectedTime ? ` (预期：${expectedTime.toFixed(1)}ms)` : ''}
          </p>
        )}
      </div>

      {/* Results comparison */}
      {!pass && userResult && expectedResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Your Result */}
          <div>
            <h4 className="text-sm font-bold text-duo-text-secondary mb-2 flex items-center gap-1">
              <span>📝</span> 你的结果 ({userResult.length} 行)
            </h4>
            <div className="bg-duo-surface rounded-xl overflow-hidden">
              <ResultTable columns={userColumns || []} rows={userResult} />
            </div>
          </div>

          {/* Expected Result */}
          <div>
            <h4 className="text-sm font-bold text-duo-text-secondary mb-2 flex items-center gap-1">
              <span>✅</span> 预期结果 ({expectedResult.length} 行)
            </h4>
            <div className="bg-duo-surface rounded-xl overflow-hidden">
              <ResultTable columns={expectedColumns || []} rows={expectedResult} />
            </div>
          </div>
        </div>
      )}

      {/* Show result when correct */}
      {pass && userResult && userResult.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-duo-text-secondary mb-2">
            查询结果 ({userResult.length} 行)
          </h4>
          <div className="bg-duo-surface rounded-xl overflow-hidden">
            <ResultTable columns={userColumns || []} rows={userResult} />
          </div>
        </div>
      )}

      {pass && userResult && userResult.length === 0 && (
        <div className="text-center py-4 text-duo-text-secondary">
          <p>查询返回了空结果（0 行）——这可能是预期的结果。</p>
        </div>
      )}
    </div>
  );
}

function ResultTable({ columns, rows }: { columns: string[]; rows: Record<string, any>[] }) {
  if (columns.length === 0) {
    return <div className="p-4 text-center text-duo-text-secondary">(空)</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-duo-surface-dark">
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-bold text-duo-text text-xs uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-gray-200/50 ${i % 2 === 0 ? 'bg-white' : 'bg-duo-surface/50'}`}
            >
              {columns.map((col, j) => (
                <td key={j} className="px-3 py-2 text-duo-text font-mono text-xs">
                  {formatValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatValue(val: any): string {
  if (val === null || val === undefined) return <span className="text-gray-400 italic">NULL</span> as any;
  if (typeof val === 'number') return val.toString();
  return String(val);
}
