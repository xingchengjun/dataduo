import type { SkillUnit } from '../types';

export const SKILL_TREE: SkillUnit[] = [
  {
    id: 'sql-basics',
    title: 'SQL 基础',
    description: '掌握核心查询语法，构建数据科学基石',
    icon: '📊',
    color: '#58CC02',
    nodes: [
      {
        id: 'select',
        unitId: 'sql-basics',
        title: 'SELECT 查询',
        description: '学习基础查询语法，选择列与别名',
        icon: '🔍',
        prerequisites: [],
        lessonIds: ['sql-select-1', 'sql-select-2', 'sql-select-3'],
        status: 'unlocked',
        progress: 0,
        teaching: [
          { title: 'SELECT 基础语法', content: 'SELECT 是最常用的 SQL 语句，用于从表中检索数据。\n\n基本语法：\nSELECT 列名1, 列名2 FROM 表名;\n\n使用 * 选择所有列：\nSELECT * FROM 表名;', example: '-- 查询特定列\nSELECT name, salary FROM employees;\n\n-- 使用别名 AS\nSELECT name, salary * 12 AS annual_salary FROM employees;', highlight: '记住：SQL 语句不区分大小写，但习惯上关键词大写、表名列名小写。' },
          { title: '列别名 AS', content: '使用 AS 关键字给列或表达式起一个更有意义的名称。\n\n语法：\nSELECT 列名 AS 别名 FROM 表名;\n\nAS 可以省略，但建议保留提升可读性。', example: 'SELECT name, salary * 12 AS annual_salary FROM employees;', highlight: '别名只在查询结果中生效，不改变实际表结构。' },
        ],
      },
      {
        id: 'where',
        unitId: 'sql-basics',
        title: 'WHERE 过滤',
        description: '使用条件筛选你需要的数据',
        icon: '🎯',
        prerequisites: ['select'],
        lessonIds: ['sql-where-1', 'sql-where-2', 'sql-where-3', 'sql-where-4'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: 'WHERE 条件过滤', content: 'WHERE 子句用于过滤行记录，只返回满足条件的行。\n\n比较运算符：=, !=, <, >, <=, >=\n逻辑运算符：AND, OR, NOT\n范围：BETWEEN, IN', example: "-- 单个条件\nSELECT * FROM employees WHERE salary > 100000;\n\n-- 多条件 (AND)\nSELECT * FROM employees WHERE department = 'Engineering' AND salary > 100000;\n\n-- IN 操作符\nSELECT * FROM employees WHERE department IN ('Engineering', 'Sales');\n\n-- BETWEEN 范围\nSELECT * FROM employees WHERE salary BETWEEN 90000 AND 110000;", highlight: '面试重点：AND 优先级高于 OR，建议加括号明确逻辑分组！' },
        ],
      },
      {
        id: 'pattern-null',
        unitId: 'sql-basics',
        title: 'LIKE 与 NULL',
        description: '模糊匹配和 NULL 值处理',
        icon: '🔤',
        prerequisites: ['where'],
        lessonIds: ['sql-like-1', 'sql-null-1', 'sql-distinct-1'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: 'LIKE 模糊匹配', content: 'LIKE 用于字符串模式匹配。\n\n通配符：\n- % 匹配任意多个字符（含 0 个）\n- _ 匹配单个字符', example: "-- 以 A 开头\nSELECT * FROM employees WHERE name LIKE 'A%';\n\n-- 包含 'son'\nSELECT * FROM employees WHERE name LIKE '%son%';\n\n-- 第二个字母是 'l'\nSELECT * FROM employees WHERE name LIKE '_l%';", highlight: '% 匹配零个或多个字符，_ 只匹配一个字符——这是常考细节！' },
          { title: 'NULL 值处理', content: 'NULL 表示"未知"或"没有值"，不是 0 也不是空字符串。\n\n判断 NULL 必须用 IS NULL / IS NOT NULL，不能用 = NULL。', example: '-- 正确写法\nSELECT * FROM employees WHERE dept_id IS NULL;\n\n-- 错误写法！\nSELECT * FROM employees WHERE dept_id = NULL;  -- 不会报错但也不返回任何行', highlight: '任何值与 NULL 运算结果都是 NULL！这是 SQL 面试的经典陷阱。' },
        ],
      },
      {
        id: 'group-order',
        unitId: 'sql-basics',
        title: '排序与分组',
        description: 'ORDER BY, GROUP BY, HAVING 组合技',
        icon: '📈',
        prerequisites: ['pattern-null'],
        lessonIds: ['sql-group-1', 'sql-group-2', 'sql-group-3', 'sql-order-1', 'sql-order-2'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: 'ORDER BY 排序', content: '对查询结果进行排序。\n\n语法：ORDER BY 列1 [ASC|DESC], 列2 [ASC|DESC]\n- ASC = 升序（默认）\n- DESC = 降序', example: '-- 降序排列\nSELECT name, salary FROM employees ORDER BY salary DESC;\n\n-- 多列排序\nSELECT * FROM employees ORDER BY department ASC, salary DESC;\n\n-- 取前 3 名\nSELECT * FROM employees ORDER BY salary DESC LIMIT 3;', highlight: 'ORDER BY 在 SELECT 执行顺序的最后阶段运行——所以可以用别名！' },
          { title: 'GROUP BY 聚合', content: 'GROUP BY 将数据分组，配合聚合函数使用。\n\n常用聚合函数：COUNT(), SUM(), AVG(), MAX(), MIN()\n\nHAVING VS WHERE：\n- WHERE：分组前过滤行\n- HAVING：分组后过滤组', example: '-- 统计每组人数\nSELECT department, COUNT(*) FROM employees GROUP BY department;\n\n-- 多聚合\nSELECT department, AVG(salary), MAX(salary) FROM employees GROUP BY department;\n\n-- HAVING 过滤分组\nSELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 1;', highlight: '面试必问：HAVING 和 WHERE 的区别！WHERE 作用于行，HAVING 作用于组。' },
        ],
      },
      {
        id: 'case-limit',
        unitId: 'sql-basics',
        title: 'CASE 与 LIMIT',
        description: '条件表达式和 LIMIT 分页',
        icon: '🔢',
        prerequisites: ['group-order'],
        lessonIds: ['sql-case-1', 'sql-case-2'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: 'CASE WHEN 条件表达式', content: 'CASE WHEN 是 SQL 中的 if-else 逻辑。\n\n简单 CASE：\nCASE 列 WHEN 值1 THEN 结果1 ELSE 默认 END\n\n搜索 CASE（更常用）：\nCASE WHEN 条件1 THEN 结果1 WHEN 条件2 THEN 结果2 ELSE 默认 END', example: '-- 二分类\nSELECT name, CASE WHEN salary >= 100000 THEN \'High\' ELSE \'Standard\' END as level FROM employees;\n\n-- 多级分类\nSELECT name, CASE WHEN salary >= 110000 THEN \'High\' WHEN salary >= 90000 THEN \'Mid\' ELSE \'Low\' END as level FROM employees;', highlight: '多级 CASE WHEN 按顺序判断——把最严格的条件放在最前面！' },
        ],
      },
    ],
  },
  {
    id: 'sql-joins',
    title: '多表连接',
    description: '打通数据孤岛，学会各种 JOIN 操作',
    icon: '🔗',
    color: '#1CB0F6',
    nodes: [
      {
        id: 'inner-join',
        unitId: 'sql-joins',
        title: 'INNER JOIN',
        description: '内连接和交叉连接',
        icon: '🔄',
        prerequisites: ['case-limit'],
        lessonIds: ['sql-inner-join-1', 'sql-inner-join-2', 'sql-cross-join-1'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: 'INNER JOIN 内连接', content: 'INNER JOIN 只返回两张表中满足连接条件的行。\n\n语法：\nSELECT * FROM 表A INNER JOIN 表B ON 表A.键 = 表B.键;\n\n可以省略 INNER，只写 JOIN。', example: '-- 标准内连接\nSELECT e.name, d.dept_name \nFROM employees e \nJOIN departments d ON e.dept_id = d.id;\n\n-- 多表连接\nSELECT s.name, c.course_name, e.grade\nFROM students s\nJOIN enrollments e ON s.id = e.student_id\nJOIN courses c ON e.course_id = c.id;', highlight: '三表连接需要两个 JOIN 条件——通过中间表串联！' },
          { title: 'CROSS JOIN 交叉连接', content: 'CROSS JOIN 生成笛卡尔积——左表每行 × 右表每行。\n\n没有 ON 条件，结果是行数的乘积。', example: 'SELECT colors.color, sizes.size \nFROM colors CROSS JOIN sizes;', highlight: 'CROSS JOIN 要小心使用——1000 行 × 1000 行 = 100 万行！' },
        ],
      },
      {
        id: 'outer-join',
        unitId: 'sql-joins',
        title: 'LEFT / RIGHT JOIN',
        description: '外连接：保留主表所有行',
        icon: '⬅️',
        prerequisites: ['inner-join'],
        lessonIds: ['sql-left-join-1', 'sql-join-agg-1'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: 'LEFT JOIN 外连接', content: 'LEFT JOIN 保留左表所有行，右表没匹配的填 NULL。\n\n应用场景：\n- 查所有客户及其订单（含未下单的）\n- 查所有部门及其员工（含空部门）\n- 数据完整性检查', example: '-- 所有员工 + 部门名（含无部门的）\nSELECT e.name, d.dept_name \nFROM employees e \nLEFT JOIN departments d ON e.dept_id = d.id;\n\n-- 所有部门 + 员工数（含 0 人的）\nSELECT d.dept_name, COUNT(e.id)\nFROM departments d\nLEFT JOIN employees e ON d.id = e.dept_id\nGROUP BY d.dept_name;', highlight: 'LEFT JOIN + GROUP BY + COUNT(右表列) 是查"无数据"的经典模式！' },
        ],
      },
      {
        id: 'advanced-join',
        unitId: 'sql-joins',
        title: '进阶连接',
        description: 'SELF JOIN 复杂场景',
        icon: '🌐',
        prerequisites: ['outer-join'],
        lessonIds: ['sql-self-join-1'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: 'SELF JOIN 自连接', content: '自连接把一张表当作两张表来连接自己。\n\n关键技巧：\n1. 给表起不同的别名\n2. 用条件避免重复对（如 a.id < b.id）', example: '-- 同一部门的同事对\nSELECT e1.name, e2.name, e1.department\nFROM employees e1\nJOIN employees e2 \n  ON e1.department = e2.department\n  AND e1.id < e2.id;', highlight: 'e1.id < e2.id 确保每对只出现一次——否则 (A,B) 和 (B,A) 都会出现！' },
        ],
      },
    ],
  },
  {
    id: 'window-functions',
    title: '窗口函数',
    description: '数据分析必备的强力工具',
    icon: '🪟',
    color: '#CE82FF',
    nodes: [
      {
        id: 'row-number',
        unitId: 'window-functions',
        title: '排名函数',
        description: 'ROW_NUMBER, RANK, DENSE_RANK',
        icon: '🏅',
        prerequisites: ['advanced-join'],
        lessonIds: ['sql-rank-1', 'sql-rank-2'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: '窗口函数入门', content: '窗口函数在不改变行数的情况下进行排名和聚合计算。\n\n基本语法：\n函数() OVER (PARTITION BY 分组列 ORDER BY 排序列)\n\n三大排名函数：\n- ROW_NUMBER()：连续排名 1,2,3,4\n- RANK()：并列跳过 1,1,3,4\n- DENSE_RANK()：并列不跳过 1,1,2,3', example: '-- 部门内薪资排名\nSELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank\nFROM employees;\n\n-- 全局密集排名\nSELECT name, salary,\n  DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank\nFROM employees;', highlight: 'RANK 跳号 VS DENSE_RANK 不跳号——面试必考区别！' },
        ],
      },
      {
        id: 'lag-lead',
        unitId: 'window-functions',
        title: '前后行函数',
        description: 'LAG, LEAD 访问前后行数据',
        icon: '⏮️',
        prerequisites: ['row-number'],
        lessonIds: ['sql-lag-1', 'sql-lead-1'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: 'LAG / LEAD 偏移函数', content: 'LAG() 访问同一列前一行的值\nLEAD() 访问同一列下一行的值\n\n语法：\nLAG(列名, 偏移量, 默认值) OVER (ORDER BY ...)\n\n常用于：环比计算、前后对比', example: '-- 日销售额变化\nSELECT date, sales,\n  sales - LAG(sales) OVER (ORDER BY date) as diff\nFROM daily_sales;\n\n-- 预测明天\nSELECT date, sales,\n  LEAD(sales) OVER (ORDER BY date) as next_day\nFROM daily_sales;', highlight: 'LAG/LEAD 的默认值是 NULL——第一行 LAG 和最后一行 LEAD 都是 NULL！' },
        ],
      },
      {
        id: 'aggregate-window',
        unitId: 'window-functions',
        title: '聚合窗口',
        description: 'SUM/AVG OVER PARTITION BY',
        icon: '📊',
        prerequisites: ['lag-lead'],
        lessonIds: ['sql-window-agg-1', 'sql-window-agg-2', 'sql-ntile-1'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: '窗口聚合函数', content: '聚合函数 + OVER() = 窗口聚合。\n\n窗口聚合不折叠行数——每行都保留。\n\nSUM() OVER (ORDER BY ...) 实现累计求和\nSUM() OVER (PARTITION BY ...) 实现组内汇总', example: '-- 累计求和 (Running Total)\nSELECT date, sales,\n  SUM(sales) OVER (ORDER BY date) as running_total\nFROM daily_sales;\n\n-- 部门薪资占比\nSELECT name, department, salary,\n  ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY department), 2) as pct\nFROM employees;', highlight: '窗口聚合 VS GROUP BY 聚合：窗口不折叠行，GROUP BY 折叠——这是最核心的区别！' },
          { title: 'NTILE 分箱函数', content: 'NTILE(N) 将数据平均分到 N 个桶中。\n\n常用于：客户分群、分数段划分、百分位分析。', example: '-- 四分位分组\nSELECT name, salary,\n  NTILE(4) OVER (ORDER BY salary DESC) as quartile\nFROM employees;', highlight: 'NTILE 在数据不均匀时尽量平均分配，可能会有少量桶多一行。' },
        ],
      },
    ],
  },
  {
    id: 'advanced-sql',
    title: '进阶 SQL',
    description: 'CTE、子查询、集合操作，成为 SQL 大师',
    icon: '🚀',
    color: '#FF9600',
    nodes: [
      {
        id: 'subqueries',
        unitId: 'advanced-sql',
        title: '子查询',
        description: 'EXISTS, NOT EXISTS, IN 子查询',
        icon: '📦',
        prerequisites: ['aggregate-window'],
        lessonIds: ['sql-subquery-1', 'sql-subquery-2'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: '子查询 (Subquery)', content: '子查询是嵌套在其他查询中的查询。\n\n三种位置：\n- WHERE 子查询：SELECT * FROM t WHERE col = (SELECT ...)\n- FROM 子查询（派生表）：SELECT * FROM (SELECT ...) AS dt\n- SELECT 子查询（标量）：SELECT (SELECT ...) AS val', example: '-- WHERE + 标量子查询\nSELECT name, salary \nFROM employees \nWHERE salary > (SELECT AVG(salary) FROM employees);\n\n-- EXISTS 检查存在性\nSELECT d.dept_name\nFROM departments d\nWHERE EXISTS (\n  SELECT 1 FROM employees e WHERE e.dept_id = d.id\n);', highlight: 'EXISTS 找到第一个匹配就停止，效率比 IN 高——尤其是子表很大时！' },
        ],
      },
      {
        id: 'cte',
        unitId: 'advanced-sql',
        title: 'CTE 表达式',
        description: 'WITH 子句，让复杂查询变清晰',
        icon: '🧩',
        prerequisites: ['subqueries'],
        lessonIds: ['sql-cte-1', 'sql-cte-2'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: 'CTE 公共表表达式', content: 'CTE (Common Table Expression) 用 WITH 定义临时结果集。\n\n语法：\nWITH cte_name AS (\n  SELECT ...\n)\nSELECT * FROM cte_name;\n\n优势：可读性强、可复用、支持递归。', example: '-- 基本 CTE\nWITH dept_avg AS (\n  SELECT department, AVG(salary) as avg_salary\n  FROM employees\n  GROUP BY department\n)\nSELECT e.name, e.department, e.salary, d.avg_salary\nFROM employees e\nJOIN dept_avg d ON e.department = d.department\nWHERE e.salary > d.avg_salary;\n\n-- 递归 CTE：生成数列\nWITH RECURSIVE nums AS (\n  SELECT 1 as num\n  UNION ALL\n  SELECT num + 1 FROM nums WHERE num < 10\n)\nSELECT * FROM nums;', highlight: 'CTE 在面试中是加分项！它让复杂查询像"流水线"一样清晰。' },
        ],
      },
      {
        id: 'set-operations',
        unitId: 'advanced-sql',
        title: '集合操作',
        description: 'UNION, INTERSECT, EXCEPT',
        icon: '⚡',
        prerequisites: ['cte'],
        lessonIds: ['sql-set-1', 'sql-set-2', 'sql-str-1', 'sql-date-1', 'sql-view-1'],
        status: 'locked',
        progress: 0,
        teaching: [
          { title: '集合操作', content: '集合操作合并多个 SELECT 的结果。\n\n- UNION：并集（去重）\n- UNION ALL：并集（保留重复）\n- INTERSECT：交集（两表共有）\n- EXCEPT：差集（左表有右表无）\n\n⚠️ 每条 SELECT 的列数必须相同！', example: '-- UNION 去重合并\nSELECT name FROM sql_students\nUNION\nSELECT name FROM python_students;\n\n-- INTERSECT 交集\nSELECT name FROM sql_students\nINTERSECT\nSELECT name FROM python_students;\n\n-- EXCEPT 差集\nSELECT name FROM sql_students\nEXCEPT\nSELECT name FROM python_students;', highlight: 'UNION 对结果排序去重（较慢），UNION ALL 不处理（较快）。只要不关心去重就用 UNION ALL！' },
          { title: '实用函数', content: 'SQL 中的字符串和日期函数也很重要。\n\n字符串：|| 或 CONCAT(), SUBSTR(), LENGTH()\n日期：STRFTIME(), DATE(), DATEPART()', example: '-- 字符串拼接 (SQLite)\nSELECT name || \' - \' || department FROM employees;\n\n-- 提取年份\nSELECT name, STRFTIME(\'%Y\', hire_date) as hire_year\nFROM employees;', highlight: '不同数据库的日期函数差异很大。面试时先问清楚用的是哪种数据库！' },
        ],
      },
    ],
  },
];

export function getNodeById(id: string) {
  for (const unit of SKILL_TREE) {
    const node = unit.nodes.find((n) => n.id === id);
    if (node) return { unit, node };
  }
  return null;
}

export function getUnitById(id: string) {
  return SKILL_TREE.find((u) => u.id === id);
}

export function getInitialNode(): { unitId: string; nodeId: string } | null {
  for (const unit of SKILL_TREE) {
    for (const node of unit.nodes) {
      if (node.status === 'unlocked') {
        return { unitId: unit.id, nodeId: node.id };
      }
    }
  }
  return null;
}
