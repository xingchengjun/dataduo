import type { SQLQuestion } from '../types';
import { SKILL_TREE } from './skillTree';

// ========== 所有题目索引 ==========

export const SQL_QUESTIONS: SQLQuestion[] = [
  // ==================== Unit 1: SQL 基础 ====================
  {
    id: 'sql-select-1',
    unitId: 'sql-basics',
    title: '查询所有员工',
    description: '有一张 `employees` 表，包含所有员工信息。请查询所有列。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000, '2023-02-28');
    `,
    expectedSQL: 'SELECT * FROM employees;',
    hints: ['使用 SELECT * FROM 表名'],
    explanation: 'SELECT * 表示选择所有列。在数据探索阶段，这是最常用的查询。星号(*)是通配符，代表所有字段。',
  },
  {
    id: 'sql-select-2',
    unitId: 'sql-basics',
    title: '选择特定列',
    description: '从 `employees` 表中只查询员工的姓名和薪资两列。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000, '2023-02-28');
    `,
    expectedSQL: 'SELECT name, salary FROM employees;',
    hints: ['在 SELECT 后面列出列名，用逗号分隔'],
    explanation: '指定列名替代星号可以精确控制输出，提高查询效率和可读性。',
  },
  {
    id: 'sql-select-3',
    unitId: 'sql-basics',
    title: '列别名',
    description: '从 `employees` 表查询员工姓名和年薪（salary * 12），年薪列别名设为 annual_salary。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000, '2023-02-28');
    `,
    expectedSQL: 'SELECT name, salary * 12 AS annual_salary FROM employees;',
    hints: ['使用 AS 关键字给列起别名', '可以在 SELECT 中进行计算'],
    explanation: 'AS 为表达式结果创建一个有意义的列名。salary * 12 在 SELECT 执行时实时计算，不改变原始数据。',
  },

  {
    id: 'sql-where-1',
    unitId: 'sql-basics',
    title: '过滤高薪员工',
    description: '从 `employees` 表中查询薪资大于 100000 的员工的所有信息。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000, '2023-02-28');
    `,
    expectedSQL: 'SELECT * FROM employees WHERE salary > 100000;',
    hints: ['使用 WHERE 子句过滤条件'],
    explanation: 'WHERE 子句用于过滤行记录。salary > 100000 只保留满足条件的行。比较运算符包括 >, <, >=, <=, =, !=。',
  },
  {
    id: 'sql-where-2',
    unitId: 'sql-basics',
    title: '多条件 AND',
    description: '查询 Engineering 部门中薪资大于 100000 的员工姓名和薪资。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Engineering', 85000, '2023-02-28');
    `,
    expectedSQL: "SELECT name, salary FROM employees WHERE department = 'Engineering' AND salary > 100000;",
    hints: ['多个条件用 AND 连接', '字符串要用单引号括起来'],
    explanation: 'AND 要求所有条件同时满足。OR 只需要满足任一条件。可以组合使用，建议加括号明确优先级。',
  },
  {
    id: 'sql-where-3',
    unitId: 'sql-basics',
    title: 'OR 与 IN 操作符',
    description: '查询部门为 Engineering 或 Sales 的所有员工姓名和部门。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000, '2023-02-28');
    `,
    expectedSQL: "SELECT name, department FROM employees WHERE department IN ('Engineering', 'Sales');",
    hints: ['IN 可以替代多个 OR 条件', 'IN 的语法更简洁清晰'],
    explanation: 'IN 操作符检查值是否在列表中，等同于 department = \'Engineering\' OR department = \'Sales\'，但更简洁。',
  },
  {
    id: 'sql-where-4',
    unitId: 'sql-basics',
    title: 'BETWEEN 范围查询',
    description: '查询薪资在 90000 到 110000 之间（含边界）的员工姓名和薪资。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000, '2023-02-28');
    `,
    expectedSQL: 'SELECT name, salary FROM employees WHERE salary BETWEEN 90000 AND 110000;',
    hints: ['BETWEEN 包含边界值', '等价于 salary >= 90000 AND salary <= 110000'],
    explanation: 'BETWEEN 是包含边界的（>= AND <=），常用于数值和日期范围查询，比两个条件更直观。',
  },
  {
    id: 'sql-like-1',
    unitId: 'sql-basics',
    title: 'LIKE 模糊匹配',
    description: '查询名字以 "A" 开头的员工信息。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000, '2023-02-28');
    `,
    expectedSQL: "SELECT * FROM employees WHERE name LIKE 'A%';",
    hints: ["% 是通配符，匹配任意个字符", "'A%' 表示以 A 开头"],
    explanation: `'A%' 匹配以 A 开头的任意字符串。% 匹配零个或多个字符，_ 匹配单个字符。模糊匹配在文本分析中非常常用。`,
  },
  {
    id: 'sql-null-1',
    unitId: 'sql-basics',
    title: 'NULL 值处理',
    description: '有一张表，部分员工没有部门（dept_id 为 NULL）。找出所有没有分配部门的员工姓名。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, dept_id)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER);
      INSERT INTO employees VALUES (1, 'Alice', 1);
      INSERT INTO employees VALUES (2, 'Bob', 2);
      INSERT INTO employees VALUES (3, 'Charlie', 1);
      INSERT INTO employees VALUES (4, 'Diana', NULL);
      INSERT INTO employees VALUES (5, 'Eve', NULL);
    `,
    expectedSQL: 'SELECT name FROM employees WHERE dept_id IS NULL;',
    hints: ['判断 NULL 不能用 = NULL', '必须使用 IS NULL'],
    explanation: 'NULL 表示"未知"或"不存在"，在 SQL 中用 IS NULL / IS NOT NULL 来判断。任何值与 NULL 比较都返回未知——这是常见的面试考点！',
  },
  {
    id: 'sql-distinct-1',
    unitId: 'sql-basics',
    title: 'DISTINCT 去重',
    description: '查询所有不同的部门名称（不重复）。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000);
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 'Engineering', 85000);
    `,
    expectedSQL: 'SELECT DISTINCT department FROM employees;',
    hints: ['DISTINCT 放在 SELECT 后面', '去除重复值'],
    explanation: 'DISTINCT 对结果集去重。这里 Engineering 虽然出现 3 次，但 DISTINCT 只返回一次。面试中常问 DISTINCT 和 GROUP BY 去重的区别。',
  },

  {
    id: 'sql-group-1',
    unitId: 'sql-basics',
    title: '统计各部门人数',
    description: '统计每个部门的员工人数，按部门名分组。结果包含 department 和 count 两列。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Engineering', 85000, '2023-02-28');
    `,
    expectedSQL: 'SELECT department, COUNT(*) as count FROM employees GROUP BY department;',
    hints: ['使用 GROUP BY 分组', 'COUNT(*) 统计每组行数'],
    explanation: 'GROUP BY 将数据按部门分组，COUNT(*) 统计每组的行数。GROUP BY 是数据分析中最常用的聚合操作之一。',
  },
  {
    id: 'sql-group-2',
    unitId: 'sql-basics',
    title: 'HAVING 过滤分组',
    description: '统计每个部门的员工人数，只显示人数大于 1 的部门。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Engineering', 85000, '2023-02-28');
    `,
    expectedSQL: 'SELECT department, COUNT(*) as count FROM employees GROUP BY department HAVING count > 1;',
    hints: ['GROUP BY 之后用 HAVING 过滤分组', 'WHERE 不能用于聚合后的过滤'],
    explanation: 'HAVING 用于过滤分组后的结果（聚合后），WHERE 在分组前过滤（聚合前）。这是面试中经常被搞混的概念！',
  },
  {
    id: 'sql-group-3',
    unitId: 'sql-basics',
    title: '多级聚合',
    description: '统计每个部门的平均薪资和最高薪资。输出 department, avg_salary, max_salary。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000);
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 'Engineering', 85000);
      INSERT INTO employees VALUES (6, 'Frank', 'Sales', 105000);
    `,
    expectedSQL: 'SELECT department, AVG(salary) as avg_salary, MAX(salary) as max_salary FROM employees GROUP BY department;',
    hints: ['AVG() 计算平均值', 'MAX() 计算最大值', '可以在一个 SELECT 中用多个聚合函数'],
    explanation: '可以在 GROUP BY 中同时使用多个聚合函数。AVG() 和 MAX() 分别计算每组的平均值和最大值。',
  },
  {
    id: 'sql-order-1',
    unitId: 'sql-basics',
    title: 'ORDER BY 排序',
    description: '查询所有员工，按薪资从高到低排序。输出姓名和薪资。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000);
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000);
    `,
    expectedSQL: 'SELECT name, salary FROM employees ORDER BY salary DESC;',
    hints: ['ORDER BY 列名 DESC 降序', '默认 ASC 升序'],
    explanation: 'ORDER BY 对结果集排序。DESC 降序（大到小），ASC 升序（小到大，默认）。可以按多列排序：ORDER BY col1 ASC, col2 DESC。',
  },
  {
    id: 'sql-order-2',
    unitId: 'sql-basics',
    title: '多列排序 + LIMIT',
    description: '查询薪资最高的前 3 名员工的姓名和薪资。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000);
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000);
      INSERT INTO employees VALUES (6, 'Frank', 'Sales', 105000);
    `,
    expectedSQL: 'SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;',
    hints: ['先 ORDER BY 排序', '再用 LIMIT 限制行数'],
    explanation: 'LIMIT 限制返回的行数，常用于 Top-N 分析。ORDER BY salary DESC 先排序，LIMIT 3 取前 3 行。',
  },
  {
    id: 'sql-case-1',
    unitId: 'sql-basics',
    title: 'CASE WHEN 打标签',
    description: '给员工打标签：薪资 >= 100000 为 "High"，< 100000 为 "Standard"。输出 name, salary, level。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000, '2023-02-28');
    `,
    expectedSQL: "SELECT name, salary, CASE WHEN salary >= 100000 THEN 'High' ELSE 'Standard' END as level FROM employees;",
    hints: ['使用 CASE WHEN ... THEN ... ELSE ... END'],
    explanation: 'CASE WHEN 是 SQL 中的条件表达式，类似编程中的 if-else-if。可以嵌套多个 WHEN 实现多级分类。',
  },
  {
    id: 'sql-case-2',
    unitId: 'sql-basics',
    title: '多级 CASE 分类',
    description: '薪资分类：>= 110000 为 "High"，>= 90000 为 "Mid"，其余为 "Low"。输出姓名和薪资等级。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000);
      INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000);
    `,
    expectedSQL: "SELECT name, salary, CASE WHEN salary >= 110000 THEN 'High' WHEN salary >= 90000 THEN 'Mid' ELSE 'Low' END as level FROM employees;",
    hints: ['多个 WHEN 按顺序判断', '第一个匹配的条件生效'],
    explanation: 'CASE 按顺序判断，第一个匹配的返回结果。注意条件和顺序——>= 110000 要在 >= 90000 之前，否则 High 会被 Mid 吞掉！',
  },

  // ==================== Unit 2: 多表连接 ====================
  {
    id: 'sql-inner-join-1',
    unitId: 'sql-joins',
    title: '基本 INNER JOIN',
    description: '有两张表：employees 和 departments。查询每个有部门的员工姓名和对应的部门名称。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, dept_id)\ndepartments(id, dept_name)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER);
      INSERT INTO employees VALUES (1, 'Alice', 1);
      INSERT INTO employees VALUES (2, 'Bob', 2);
      INSERT INTO employees VALUES (3, 'Charlie', 1);
      INSERT INTO employees VALUES (4, 'Diana', 3);
      INSERT INTO employees VALUES (5, 'Eve', NULL);
      CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);
      INSERT INTO departments VALUES (1, 'Engineering');
      INSERT INTO departments VALUES (2, 'Marketing');
      INSERT INTO departments VALUES (3, 'Sales');
    `,
    expectedSQL: 'SELECT e.name, d.dept_name FROM employees e INNER JOIN departments d ON e.dept_id = d.id;',
    hints: ['INNER JOIN ... ON ... 连接两张表', '给表起别名简化查询'],
    explanation: 'INNER JOIN 只返回匹配的行。Eve 的 dept_id 为 NULL，没有匹配所以不出现。表别名（e, d）让查询更简洁。',
  },
  {
    id: 'sql-inner-join-2',
    unitId: 'sql-joins',
    title: '三表连接',
    description: '查询每个学生的选课信息：姓名、课程名、成绩。涉及 students, enrollments, courses 三张表。',
    difficulty: 'medium',
    tableSchema: 'students(id, name)\ncourses(id, course_name)\nenrollments(student_id, course_id, grade)',
    setupSQL: `
      CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
      INSERT INTO students VALUES (1, 'Alice'); INSERT INTO students VALUES (2, 'Bob'); INSERT INTO students VALUES (3, 'Charlie');
      CREATE TABLE courses (id INTEGER PRIMARY KEY, course_name TEXT NOT NULL);
      INSERT INTO courses VALUES (1, 'Math'); INSERT INTO courses VALUES (2, 'SQL 101'); INSERT INTO courses VALUES (3, 'Statistics');
      CREATE TABLE enrollments (student_id INTEGER, course_id INTEGER, grade TEXT);
      INSERT INTO enrollments VALUES (1, 1, 'A'); INSERT INTO enrollments VALUES (1, 2, 'A'); INSERT INTO enrollments VALUES (2, 2, 'B'); INSERT INTO enrollments VALUES (3, 3, 'C');
    `,
    expectedSQL: 'SELECT s.name, c.course_name, e.grade FROM students s JOIN enrollments e ON s.id = e.student_id JOIN courses c ON e.course_id = c.id;',
    hints: ['多次 JOIN 连接多张表', 'enrollments 是关联表/中间表'],
    explanation: '多表连接通过中间表（enrollments）串联。先 students JOIN enrollments，再 JOIN courses——这就是数据建模中多对多关系的标准查询方式。',
  },
  {
    id: 'sql-left-join-1',
    unitId: 'sql-joins',
    title: 'LEFT JOIN 保留所有',
    description: '查询所有员工及其部门名称，包括没有部门的员工（Eve）。输出 name, dept_name。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, dept_id)\ndepartments(id, dept_name)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER);
      INSERT INTO employees VALUES (1, 'Alice', 1); INSERT INTO employees VALUES (2, 'Bob', 2);
      INSERT INTO employees VALUES (3, 'Charlie', 1); INSERT INTO employees VALUES (4, 'Diana', 3);
      INSERT INTO employees VALUES (5, 'Eve', NULL);
      CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);
      INSERT INTO departments VALUES (1, 'Engineering'); INSERT INTO departments VALUES (2, 'Marketing'); INSERT INTO departments VALUES (3, 'Sales');
    `,
    expectedSQL: 'SELECT e.name, d.dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.id;',
    hints: ['LEFT JOIN 保留左表所有行', '没有匹配时右表列显示 NULL'],
    explanation: 'LEFT JOIN 保留左表所有行，右表没匹配就填 NULL。Eve 没有部门但仍出现在结果中。面试题：LEFT JOIN 和 INNER JOIN 的返回行数区别？',
  },
  {
    id: 'sql-join-agg-1',
    unitId: 'sql-joins',
    title: 'JOIN + 聚合',
    description: '查询每个部门的员工人数（包括没有员工的部门也显示 0 人）。输出 dept_name 和 emp_count。',
    difficulty: 'medium',
    tableSchema: 'departments(id, dept_name)\nemployees(id, name, dept_id)',
    setupSQL: `
      CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);
      INSERT INTO departments VALUES (1, 'Engineering'); INSERT INTO departments VALUES (2, 'Marketing');
      INSERT INTO departments VALUES (3, 'Sales'); INSERT INTO departments VALUES (4, 'HR');
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER);
      INSERT INTO employees VALUES (1, 'Alice', 1); INSERT INTO employees VALUES (2, 'Bob', 2);
      INSERT INTO employees VALUES (3, 'Charlie', 1); INSERT INTO employees VALUES (4, 'Diana', 3);
    `,
    expectedSQL: 'SELECT d.dept_name, COUNT(e.id) as emp_count FROM departments d LEFT JOIN employees e ON d.id = e.dept_id GROUP BY d.dept_name;',
    hints: ['LEFT JOIN 保留下属所有部门', 'COUNT(e.id) 而不是 COUNT(*) 避免误算'],
    explanation: 'LEFT JOIN departments 作为主表，COUNT(e.id) 对员工 ID 计数——NULL 不被计数，所以 HR 部门显示 0。如果 COUNT(*) 会把 HR 也算作 1 行！',
  },
  {
    id: 'sql-cross-join-1',
    unitId: 'sql-joins',
    title: 'CROSS JOIN 笛卡尔积',
    description: '有两个集合：colors (Red, Blue) 和 sizes (S, M, L)。生成所有颜色和尺寸的组合。',
    difficulty: 'easy',
    tableSchema: 'colors(color)\nsizes(size)',
    setupSQL: `
      CREATE TABLE colors (color TEXT NOT NULL);
      INSERT INTO colors VALUES ('Red'); INSERT INTO colors VALUES ('Blue');
      CREATE TABLE sizes (size TEXT NOT NULL);
      INSERT INTO sizes VALUES ('S'); INSERT INTO sizes VALUES ('M'); INSERT INTO sizes VALUES ('L');
    `,
    expectedSQL: 'SELECT c.color, s.size FROM colors c CROSS JOIN sizes s;',
    hints: ['CROSS JOIN 没有 ON 条件', '结果是行数的乘积'],
    explanation: 'CROSS JOIN 生成笛卡尔积——每行左表 × 每行右表。2 × 3 = 6 行结果。实际业务中小心使用，大表 CROSS JOIN 会产生天文数字的行数！',
  },
  {
    id: 'sql-self-join-1',
    unitId: 'sql-joins',
    title: 'SELF JOIN 找同部门同事',
    description: '有一张 employees 表。找出同一部门中所有员工对组合（排除自己和自己配对）。输出 name1, name2, department。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, department)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering'); INSERT INTO employees VALUES (2, 'Bob', 'Marketing');
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering'); INSERT INTO employees VALUES (4, 'Diana', 'Sales');
      INSERT INTO employees VALUES (5, 'Eve', 'Engineering'); INSERT INTO employees VALUES (6, 'Frank', 'Sales');
    `,
    expectedSQL: "SELECT e1.name as name1, e2.name as name2, e1.department FROM employees e1 JOIN employees e2 ON e1.department = e2.department AND e1.id < e2.id;",
    hints: ['自连接 = 同一张表 JOIN 自身', 'e1.id < e2.id 防止重复对 (A,B) 和 (B,A)'],
    explanation: '自连接将一张表视为两个实例。e1.id < e2.id 是关键——保证每对只出现一次。Engineering 有 3 人所以产生 C(3,2)=3 对。',
  },

  // ==================== Unit 3: 窗口函数 ====================
  {
    id: 'sql-rank-1',
    unitId: 'window-functions',
    title: 'RANK 部门薪资排名',
    description: '在每个部门内按薪资从高到低排名。输出 name, department, salary, rank。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000); INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000); INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 'Engineering', 85000); INSERT INTO employees VALUES (6, 'Frank', 'Sales', 105000);
    `,
    expectedSQL: "SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank FROM employees;",
    hints: ['RANK() OVER (PARTITION BY ... ORDER BY ...)', 'PARTITION BY 分组，ORDER BY 排序'],
    explanation: '窗口函数 RANK() 在每个 PARTITION 内独立排名。PARTITION BY department 按部门分组，ORDER BY salary DESC 降序排列。',
  },
  {
    id: 'sql-rank-2',
    unitId: 'window-functions',
    title: 'DENSE_RANK 密集排名',
    description: '用 DENSE_RANK 给全局员工按薪资排名（不跳过并列名次）。输出 name, salary, dense_rank。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 120000); INSERT INTO employees VALUES (2, 'Bob', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 120000); INSERT INTO employees VALUES (4, 'Diana', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 90000);
    `,
    expectedSQL: 'SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank FROM employees;',
    hints: ['DENSE_RANK 不跳过名次', 'RANK 会跳过：比如 1,1,3'],
    explanation: 'DENSE_RANK 和 RANK 的区别——并列时 RANK 跳过名次(1,1,3)，DENSE_RANK 不跳过(1,1,2)。这是 SQL 面试必考题！',
  },
  {
    id: 'sql-lag-1',
    unitId: 'window-functions',
    title: 'LAG 看日销售额变化',
    description: '查询每天销售额以及与前一天的变化值（差值）。输出 date, sales, diff。',
    difficulty: 'medium',
    tableSchema: 'daily_sales(date TEXT, sales REAL)',
    setupSQL: `
      CREATE TABLE daily_sales (date TEXT PRIMARY KEY, sales REAL NOT NULL);
      INSERT INTO daily_sales VALUES ('2024-01-01', 1000); INSERT INTO daily_sales VALUES ('2024-01-02', 1200);
      INSERT INTO daily_sales VALUES ('2024-01-03', 1100); INSERT INTO daily_sales VALUES ('2024-01-04', 1500);
      INSERT INTO daily_sales VALUES ('2024-01-05', 1400);
    `,
    expectedSQL: "SELECT date, sales, sales - LAG(sales) OVER (ORDER BY date) as diff FROM daily_sales ORDER BY date;",
    hints: ['LAG() 访问前一行的值', 'LAG(column) OVER (ORDER BY ...)'],
    explanation: 'LAG(sales) 返回前一行的 sales 值。第一行的 LAG 是 NULL（没有前一行）。LEAD() 相反，访问下一行。',
  },
  {
    id: 'sql-lead-1',
    unitId: 'window-functions',
    title: 'LEAD 预测明天',
    description: '查询每天销售额和第二天销售额的预估（有数据就用实际值，没有则 NULL）。输出 date, sales, next_day_sales。',
    difficulty: 'medium',
    tableSchema: 'daily_sales(date TEXT, sales REAL)',
    setupSQL: `
      CREATE TABLE daily_sales (date TEXT PRIMARY KEY, sales REAL NOT NULL);
      INSERT INTO daily_sales VALUES ('2024-01-01', 1000); INSERT INTO daily_sales VALUES ('2024-01-02', 1200);
      INSERT INTO daily_sales VALUES ('2024-01-03', 1100); INSERT INTO daily_sales VALUES ('2024-01-04', 1500);
    `,
    expectedSQL: "SELECT date, sales, LEAD(sales) OVER (ORDER BY date) as next_day_sales FROM daily_sales ORDER BY date;",
    hints: ['LEAD() 访问下一行的值', '和 LAG 是相反的兄弟函数'],
    explanation: 'LEAD(sales) 返回下一行的值。最后一行没有"下一行"，返回 NULL。LAG/LEAD 常用于计算环比变化。',
  },
  {
    id: 'sql-window-agg-1',
    unitId: 'window-functions',
    title: 'SUM OVER 累计求和',
    description: '计算从年初到每天的累计销售额。输出 date, sales, running_total。',
    difficulty: 'medium',
    tableSchema: 'daily_sales(date TEXT, sales REAL)',
    setupSQL: `
      CREATE TABLE daily_sales (date TEXT PRIMARY KEY, sales REAL NOT NULL);
      INSERT INTO daily_sales VALUES ('2024-01-01', 1000); INSERT INTO daily_sales VALUES ('2024-01-02', 1200);
      INSERT INTO daily_sales VALUES ('2024-01-03', 1100); INSERT INTO daily_sales VALUES ('2024-01-04', 1500);
      INSERT INTO daily_sales VALUES ('2024-01-05', 1400);
    `,
    expectedSQL: "SELECT date, sales, SUM(sales) OVER (ORDER BY date) as running_total FROM daily_sales ORDER BY date;",
    hints: ['SUM() OVER (ORDER BY ...) 实现累计', '不加 PARTITION BY 就是全局累计'],
    explanation: '窗口中的 SUM() OVER (ORDER BY date) 按日期顺序累加——第 N 行是前 N 行的和。不加 PARTITION BY 就是全表累计。',
  },
  {
    id: 'sql-window-agg-2',
    unitId: 'window-functions',
    title: '部门薪资占比',
    description: '计算每个员工薪资占他所在部门总薪资的百分比。输出 name, department, salary, pct。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000); INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000); INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 'Engineering', 85000); INSERT INTO employees VALUES (6, 'Frank', 'Sales', 105000);
    `,
    expectedSQL: "SELECT name, department, salary, ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY department), 2) as pct FROM employees ORDER BY department, pct DESC;",
    hints: ['SUM OVER PARTITION 算部门总薪资', 'ROUND(..., 2) 保留两位小数'],
    explanation: '窗口聚合 SUM(salary) OVER (PARTITION BY department) 计算每个部门的总薪资。salary / 总薪资 × 100 得到占比。这是数据分析中的常用计算！',
  },
  {
    id: 'sql-ntile-1',
    unitId: 'window-functions',
    title: 'NTILE 四分位分组',
    description: '将所有员工按薪资从高到低分成 4 组（四分位）。输出 name, salary, quartile。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 120000); INSERT INTO employees VALUES (2, 'Bob', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 110000); INSERT INTO employees VALUES (4, 'Diana', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 85000); INSERT INTO employees VALUES (6, 'Frank', 105000);
      INSERT INTO employees VALUES (7, 'Grace', 130000); INSERT INTO employees VALUES (8, 'Henry', 78000);
    `,
    expectedSQL: 'SELECT name, salary, NTILE(4) OVER (ORDER BY salary DESC) as quartile FROM employees;',
    hints: ['NTILE(N) 分成 N 组', '常用于百分位分析'],
    explanation: 'NTILE(4) 将 8 行数据均匀分成 4 组，每组 2 行。常用于客户分群（如 RFM 分析中的四分位打分）。',
  },

  // ==================== Unit 4: 进阶 SQL ====================
  {
    id: 'sql-subquery-1',
    unitId: 'advanced-sql',
    title: '高于平均薪资',
    description: '查询薪资高于公司平均水平的员工姓名和薪资。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000); INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000); INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000); INSERT INTO employees VALUES (6, 'Frank', 'Sales', 105000);
    `,
    expectedSQL: "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
    hints: ['子查询放在 WHERE 后面', 'AVG() 计算平均值'],
    explanation: '子查询先计算平均薪资，外层查询筛选高于平均值的人。子查询可以放在 SELECT/FROM/WHERE 中，是 SQL 的核心能力。',
  },
  {
    id: 'sql-subquery-2',
    unitId: 'advanced-sql',
    title: 'EXISTS 判断存在',
    description: '查询有下属的部门名称（至少有一个员工的部门）。',
    difficulty: 'medium',
    tableSchema: 'departments(id, dept_name)\nemployees(id, name, dept_id)',
    setupSQL: `
      CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);
      INSERT INTO departments VALUES (1, 'Engineering'); INSERT INTO departments VALUES (2, 'Marketing');
      INSERT INTO departments VALUES (3, 'Sales'); INSERT INTO departments VALUES (4, 'HR');
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER);
      INSERT INTO employees VALUES (1, 'Alice', 1); INSERT INTO employees VALUES (2, 'Bob', 2);
      INSERT INTO employees VALUES (3, 'Charlie', 1); INSERT INTO employees VALUES (4, 'Diana', 3);
    `,
    expectedSQL: "SELECT d.dept_name FROM departments d WHERE EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);",
    hints: ['EXISTS 检查子查询是否有结果', 'SELECT 1 只是检查存在性，不关心具体值'],
    explanation: 'EXISTS 比 IN 效率更高——它找到第一个匹配就停止，不必扫描所有行。SELECT 1 只是"存在标记"，不读取实际数据。',
  },
  {
    id: 'sql-cte-1',
    unitId: 'advanced-sql',
    title: 'CTE 分析部门平均',
    description: '使用 CTE (WITH) 先计算各部门平均薪资，然后找出高于本部门平均线的员工。输出 name, department, salary, dept_avg。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `
      CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000); INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000);
      INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000); INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000);
      INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000); INSERT INTO employees VALUES (6, 'Frank', 'Sales', 105000);
    `,
    expectedSQL: "WITH dept_avg AS (SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department) SELECT e.name, e.department, e.salary, d.avg_salary as dept_avg FROM employees e JOIN dept_avg d ON e.department = d.department WHERE e.salary > d.avg_salary;",
    hints: ['WITH cte_name AS (子查询)', 'CTE 是临时视图，可在主查询中引用'],
    explanation: 'CTE 将复杂查询拆成可读的步骤。这里 WITH dept_avg 算部门平均，主查询再 JOIN 比较。面试中 CTE 是加分项！',
  },
  {
    id: 'sql-cte-2',
    unitId: 'advanced-sql',
    title: '递归 CTE 生成数列',
    description: '使用递归 CTE 生成从 1 到 10 的数字序列。输出列名设为 num。',
    difficulty: 'hard',
    tableSchema: '无需建表',
    setupSQL: '',
    expectedSQL: "WITH RECURSIVE nums AS (SELECT 1 as num UNION ALL SELECT num + 1 FROM nums WHERE num < 10) SELECT * FROM nums;",
    hints: ['递归 CTE 需要 UNION ALL', '锚点查询 + 递归查询'],
    explanation: '递归 CTE：先执行锚点查询(SELECT 1)，UNION ALL 后递归执行直到条件不满足。常用于树形结构（组织架构、分类层级）。',
  },
  {
    id: 'sql-set-1',
    unitId: 'advanced-sql',
    title: 'UNION 合并结果',
    description: '有两张选课表：sql_students 和 python_students。找出选修了 SQL 或 Python 的学生名单（去重）。',
    difficulty: 'easy',
    tableSchema: 'sql_students(student_id, name)\npython_students(student_id, name)',
    setupSQL: `
      CREATE TABLE sql_students (student_id INTEGER, name TEXT NOT NULL);
      INSERT INTO sql_students VALUES (1, 'Alice'); INSERT INTO sql_students VALUES (2, 'Bob'); INSERT INTO sql_students VALUES (3, 'Charlie');
      CREATE TABLE python_students (student_id INTEGER, name TEXT NOT NULL);
      INSERT INTO python_students VALUES (2, 'Bob'); INSERT INTO python_students VALUES (3, 'Charlie'); INSERT INTO python_students VALUES (4, 'Diana');
    `,
    expectedSQL: "SELECT name FROM sql_students UNION SELECT name FROM python_students;",
    hints: ['UNION 自动去重', 'UNION ALL 保留重复'],
    explanation: 'UNION 合并两个结果集并去重。4 名学生：Alice, Bob, Charlie, Diana。UNION ALL 保留重复行（6 行），速度更快因为不排序去重。',
  },
  {
    id: 'sql-set-2',
    unitId: 'advanced-sql',
    title: 'INTERSECT 找交集',
    description: '找出同时选修了 SQL 和 Python 的学生名字。',
    difficulty: 'medium',
    tableSchema: 'sql_students(student_id, name)\npython_students(student_id, name)',
    setupSQL: `
      CREATE TABLE sql_students (student_id INTEGER, name TEXT NOT NULL);
      INSERT INTO sql_students VALUES (1, 'Alice'); INSERT INTO sql_students VALUES (2, 'Bob'); INSERT INTO sql_students VALUES (3, 'Charlie');
      CREATE TABLE python_students (student_id INTEGER, name TEXT NOT NULL);
      INSERT INTO python_students VALUES (2, 'Bob'); INSERT INTO python_students VALUES (3, 'Charlie'); INSERT INTO python_students VALUES (4, 'Diana');
    `,
    expectedSQL: "SELECT name FROM sql_students INTERSECT SELECT name FROM python_students;",
    hints: ['INTERSECT 返回两表共同的行', '注意 SQLite 支持 INTERSECT 和 EXCEPT'],
    explanation: 'INTERSECT 返回同时出现在两个结果集中的行。Bob 和 Charlie 两门课都选了。EXCEPT 则返回只在第一个结果集中出现的行。',
  },
  {
    id: 'sql-str-1',
    unitId: 'advanced-sql',
    title: '字符串拼接',
    description: '将员工的姓名和部门用 " - " 拼接成一个描述字段。输出 description 列。',
    difficulty: 'easy',
    tableSchema: 'employees(name, department)',
    setupSQL: `
      CREATE TABLE employees (name TEXT NOT NULL, department TEXT NOT NULL);
      INSERT INTO employees VALUES ('Alice', 'Engineering'); INSERT INTO employees VALUES ('Bob', 'Marketing');
      INSERT INTO employees VALUES ('Charlie', 'Engineering');
    `,
    expectedSQL: "SELECT name || ' - ' || department as description FROM employees;",
    hints: ['SQLite 中用 || 拼接字符串', '其他数据库用 CONCAT() 函数'],
    explanation: '|| 是 SQL 标准中的字符串连接符。MySQL 用 CONCAT()，但 SQLite 和 PostgreSQL 用 ||。这是编写跨数据库 SQL 时需要注意的差异。',
  },
  {
    id: 'sql-date-1',
    unitId: 'advanced-sql',
    title: '日期函数',
    description: '查询 2020 年入职的员工姓名和入职年份。输出 name, hire_year。',
    difficulty: 'medium',
    tableSchema: 'employees(name, hire_date)',
    setupSQL: `
      CREATE TABLE employees (name TEXT NOT NULL, hire_date TEXT NOT NULL);
      INSERT INTO employees VALUES ('Alice', '2020-01-15'); INSERT INTO employees VALUES ('Bob', '2021-03-20');
      INSERT INTO employees VALUES ('Charlie', '2019-11-01'); INSERT INTO employees VALUES ('Diana', '2020-06-10');
    `,
    expectedSQL: "SELECT name, STRFTIME('%Y', hire_date) as hire_year FROM employees WHERE STRFTIME('%Y', hire_date) = '2020';",
    hints: ['STRFTIME 是 SQLite 的日期格式化函数', "STRFTIME('%Y', date) 提取年份"],
    explanation: 'STRFTIME 类似 Python 的 strftime。%Y 是四位年份。SQL 中的日期处理是面试常考内容——不同数据库的日期函数各不相同。',
  },
  {
    id: 'sql-view-1',
    unitId: 'advanced-sql',
    title: 'EXCEPT 差集',
    description: '找出只选修了 SQL 但没有选修 Python 的学生名字。',
    difficulty: 'medium',
    tableSchema: 'sql_students(student_id, name)\npython_students(student_id, name)',
    setupSQL: `
      CREATE TABLE sql_students (student_id INTEGER, name TEXT NOT NULL);
      INSERT INTO sql_students VALUES (1, 'Alice'); INSERT INTO sql_students VALUES (2, 'Bob'); INSERT INTO sql_students VALUES (3, 'Charlie');
      CREATE TABLE python_students (student_id INTEGER, name TEXT NOT NULL);
      INSERT INTO python_students VALUES (2, 'Bob'); INSERT INTO python_students VALUES (3, 'Charlie'); INSERT INTO python_students VALUES (4, 'Diana');
    `,
    expectedSQL: "SELECT name FROM sql_students EXCEPT SELECT name FROM python_students;",
    hints: ['EXCEPT 返回左表的行减去右表的行'],
    explanation: 'EXCEPT 返回只在第一个结果集中出现但不在第二个结果集中的行。这里 Alice 只选 SQL 没选 Python。有些数据库用 MINUS 关键字。',
  },
];

// ==================== 工具函数 ====================

export function getQuestionById(id: string): SQLQuestion | undefined {
  return SQL_QUESTIONS.find((q) => q.id === id);
}

export function getQuestionsByNodeId(nodeId: string): SQLQuestion[] {
  for (const unit of SKILL_TREE) {
    const node = unit.nodes.find((n) => n.id === nodeId);
    if (node) {
      return node.lessonIds
        .map((id: string) => getQuestionById(id))
        .filter(Boolean) as SQLQuestion[];
    }
  }
  return [];
}

export function getQuestionsByUnit(unitId: string): SQLQuestion[] {
  return SQL_QUESTIONS.filter((q) => q.unitId === unitId);
}
