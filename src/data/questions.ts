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

  {
    id: 'sql-cohort-1',
    unitId: 'advanced-sql',
    title: 'Cohort 留存分析',
    description: '按首次下单月份分组（同期群），统计每个同期群在各月的活跃用户数。',
    difficulty: 'hard',
    tableSchema: 'orders(id, user_id, order_date)',
    setupSQL: `CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, order_date DATE NOT NULL);INSERT INTO orders VALUES (1, 1, '2024-01-05');INSERT INTO orders VALUES (2, 1, '2024-02-10');INSERT INTO orders VALUES (3, 2, '2024-01-15');INSERT INTO orders VALUES (4, 2, '2024-02-20');INSERT INTO orders VALUES (5, 2, '2024-03-01');INSERT INTO orders VALUES (6, 3, '2024-02-01');INSERT INTO orders VALUES (7, 3, '2024-02-15');INSERT INTO orders VALUES (8, 3, '2024-03-10');INSERT INTO orders VALUES (9, 4, '2024-01-20');`,
    expectedSQL: "WITH cohort AS (SELECT user_id, STRFTIME('%Y-%m', MIN(order_date)) AS cohort_month FROM orders GROUP BY user_id), activity AS (SELECT user_id, STRFTIME('%Y-%m', order_date) AS order_month FROM orders GROUP BY user_id, order_month) SELECT c.cohort_month AS cohort, COUNT(DISTINCT c.user_id) AS cohort_size, a.order_month, COUNT(DISTINCT a.user_id) AS active_users FROM cohort c LEFT JOIN activity a ON c.user_id = a.user_id GROUP BY c.cohort_month, a.order_month ORDER BY c.cohort_month, a.order_month;",
    hints: ['CTE1: 先找每个用户首月 cohort', 'CTE2: 再按月统计各用户活跃情况'],
    explanation: 'Cohort 留存在数据面试中是最高频的 SQL 题。首月分组，按月追踪后续活跃。',
  },
  {
    id: 'sql-where-5',
    unitId: 'sql-basics',
    title: '多条件过滤 + 排除',
    description: '从 employees 表查询 Engineering 部门薪资在 90000 到 120000 之间的员工，排除名字为 Bob 的员工。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 105000, '2021-03-20');INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 95000, '2019-11-01');INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000, '2023-02-28');`,
    expectedSQL: "SELECT * FROM employees WHERE department = 'Engineering' AND salary BETWEEN 90000 AND 120000 AND name != 'Bob';",
    hints: ['用 AND 连接多个条件', 'BETWEEN 是包含边界的'],
    explanation: '面试中常见组合条件过滤。BETWEEN 是闭区间，等价于 salary >= 90000 AND salary <= 120000。',
  },
  {
    id: 'sql-where-6',
    unitId: 'sql-basics',
    title: 'NOT IN 排除列表',
    description: '从 employees 表查询部门不是 Engineering 也不是 Sales 的员工。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary, hire_date)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL, hire_date TEXT NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000, '2020-01-15');INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 90000, '2021-03-20');INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000, '2019-11-01');INSERT INTO employees VALUES (4, 'Diana', 'Sales', 95000, '2022-06-10');INSERT INTO employees VALUES (5, 'Eve', 'HR', 85000, '2023-02-28');`,
    expectedSQL: "SELECT * FROM employees WHERE department NOT IN ('Engineering', 'Sales');",
    hints: ['使用 NOT IN 语法', '也可以写成 != 并用 AND 连接'],
    explanation: 'NOT IN 常用于排除多个值。注意如果列表中有 NULL，NOT IN 结果会为空，这是面试常考陷阱！',
  },

  // ===== 新增题：NULL 处理 =====
  {
    id: 'sql-null-2',
    unitId: 'sql-basics',
    title: 'COALESCE 处理 NULL',
    description: '从 employees 表查询员工姓名和部门，如果部门为 NULL 则显示未分配。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);INSERT INTO employees VALUES (2, 'Bob', NULL, 90000);INSERT INTO employees VALUES (3, 'Charlie', 'Marketing', 110000);INSERT INTO employees VALUES (4, 'Diana', NULL, 95000);`,
    expectedSQL: "SELECT name, COALESCE(department, '未分配') AS department FROM employees;",
    hints: ['COALESCE 返回第一个非 NULL 值'],
    explanation: 'COALESCE 是处理 NULL 最常用的函数，接受多个参数返回第一个非 NULL 值。面试必考！',
  },
  {
    id: 'sql-null-3',
    unitId: 'sql-basics',
    title: 'NULL 陷阱：空值运算',
    description: '从 employees 表查询员工姓名和薪资，如果薪资为 NULL 则显示 0。同时查询薪资加 1000 后的值。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, salary REAL);INSERT INTO employees VALUES (1, 'Alice', 120000);INSERT INTO employees VALUES (2, 'Bob', NULL);INSERT INTO employees VALUES (3, 'Charlie', 110000);INSERT INTO employees VALUES (4, 'Diana', NULL);`,
    expectedSQL: "SELECT name, COALESCE(salary, 0) AS salary, COALESCE(salary, 0) + 1000 AS salary_plus FROM employees;",
    hints: ['任何值与 NULL 运算结果都是 NULL', '使用 COALESCE 或 IFNULL'],
    explanation: 'NULL + 1000 = NULL 是经典陷阱。必须先用 COALESCE 把 NULL 转成 0 再做运算。',
  },

  // ===== 新增题：去重 / 排序 / 分组 =====
  {
    id: 'sql-distinct-2',
    unitId: 'sql-basics',
    title: '多列去重',
    description: '从 employees 表查询所有不重复的 (department, position) 组合。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, position, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, position TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 'Senior', 120000);INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 'Junior', 90000);INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 'Senior', 110000);INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 'Senior', 95000);INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 'Junior', 85000);`,
    expectedSQL: "SELECT DISTINCT department, position FROM employees;",
    hints: ['DISTINCT 可以作用于多列组合'],
    explanation: 'DISTINCT 作用于后面所有列的组合。这是数据分析中查看唯一组合模式的常用方法。',
  },
  {
    id: 'sql-order-3',
    unitId: 'sql-basics',
    title: '多级排序 + TOP N',
    description: '从 employees 表先按部门升序再按薪资降序排列，返回前 3 条记录。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 90000);INSERT INTO employees VALUES (3, 'Charlie', 'Marketing', 110000);INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 95000);INSERT INTO employees VALUES (5, 'Eve', 'Sales', 85000);`,
    expectedSQL: "SELECT * FROM employees ORDER BY department ASC, salary DESC LIMIT 3;",
    hints: ['ORDER BY 多个列用逗号分隔', 'LIMIT 限制返回行数'],
    explanation: '多级排序面试高频题。先按部门排序，同部门内按薪资降序排列。',
  },
  {
    id: 'sql-order-4',
    unitId: 'sql-basics',
    title: 'ORDER BY + 表达式',
    description: '从 employees 表按年薪（salary * 12）降序排列，查询员工姓名和年薪。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 120000);INSERT INTO employees VALUES (2, 'Bob', 90000);INSERT INTO employees VALUES (3, 'Charlie', 110000);`,
    expectedSQL: "SELECT name, salary * 12 AS annual_salary FROM employees ORDER BY annual_salary DESC;",
    hints: ['可以在 ORDER BY 中使用别名', 'ORDER BY 在 SELECT 之后执行'],
    explanation: 'ORDER BY 在 SELECT 之后执行，所以可以使用别名排序。',
  },
  {
    id: 'sql-having-1',
    unitId: 'sql-basics',
    title: 'HAVING 过滤分组',
    description: '从 employees 表统计各部门平均薪资，只显示平均薪资 > 95000 的部门。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 90000);INSERT INTO employees VALUES (3, 'Charlie', 'Marketing', 110000);INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 65000);INSERT INTO employees VALUES (5, 'Eve', 'Sales', 50000);`,
    expectedSQL: "SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 95000;",
    hints: ['HAVING 过滤分组，WHERE 过滤行', 'HAVING 可以使用聚合函数'],
    explanation: 'WHERE 在 GROUP BY 之前过滤行，HAVING 在 GROUP BY 之后过滤组。',
  },
  {
    id: 'sql-group-4',
    unitId: 'sql-basics',
    title: 'GROUP BY 多列',
    description: '从 employees 表统计每个部门每种职位的员工数量和平均薪资。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, position, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, position TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 'Senior', 120000);INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 'Junior', 90000);INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 'Senior', 130000);INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 'Senior', 95000);INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 'Junior', 85000);`,
    expectedSQL: "SELECT department, position, COUNT(*) AS cnt, AVG(salary) AS avg_salary FROM employees GROUP BY department, position;",
    hints: ['GROUP BY 后面可以跟多个列', '多列分组按组合去重'],
    explanation: '多列分组是按列的组合来聚合，相当于 Excel 中的多级透视表。',
  },

  // ===== 新增题：CASE WHEN =====
  {
    id: 'sql-case-3',
    unitId: 'sql-basics',
    title: 'CASE WHEN + 聚合 Pivot',
    description: '从 employees 表统计每个部门的薪资级别分布。薪资 >= 100000 为高薪，>= 70000 为中薪，其余为低薪。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 80000);INSERT INTO employees VALUES (3, 'Charlie', 'Marketing', 110000);INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 65000);INSERT INTO employees VALUES (5, 'Eve', 'Sales', 50000);`,
    expectedSQL: "SELECT department, COUNT(CASE WHEN salary >= 100000 THEN 1 END) AS high_salary, COUNT(CASE WHEN salary >= 70000 AND salary < 100000 THEN 1 END) AS mid_salary, COUNT(CASE WHEN salary < 70000 THEN 1 END) AS low_salary FROM employees GROUP BY department;",
    hints: ['在 COUNT 或 SUM 里面嵌套 CASE WHEN', 'CASE WHEN 不匹配时返回 NULL'],
    explanation: '数据分析面试高频题——用 CASE WHEN 做条件聚合，把行转成列统计。',
  },
  {
    id: 'sql-case-4',
    unitId: 'sql-basics',
    title: 'CASE WHEN 打标签',
    description: '从 employees 表根据 hire_date 给员工打标签。2020 年之前入职为老员工，2020-2021 为骨干，2022 之后为新员工。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, hire_date, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, hire_date TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', '2019-01-15', 120000);INSERT INTO employees VALUES (2, 'Bob', '2020-03-20', 90000);INSERT INTO employees VALUES (3, 'Charlie', '2021-11-01', 110000);INSERT INTO employees VALUES (4, 'Diana', '2022-06-10', 95000);INSERT INTO employees VALUES (5, 'Eve', '2023-02-28', 85000);`,
    expectedSQL: "SELECT name, hire_date, CASE WHEN hire_date < '2020-01-01' THEN '老员工' WHEN hire_date < '2022-01-01' THEN '骨干' ELSE '新员工' END AS tag FROM employees;",
    hints: ['CASE WHEN 按顺序判断，把最严格的条件放前面'],
    explanation: 'CASE WHEN 顺序很重要。先判断最严格的条件。',
  },

  // ===== 新增题：多表连接 =====
  {
    id: 'sql-inner-join-3',
    unitId: 'sql-joins',
    title: '三表连接查询',
    description: '查询每个员工的姓名、部门名和项目名（三张表：employees, departments, projects）。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, dept_id) / departments(id, dept_name) / projects(id, project_name, employee_id)',
    setupSQL: `CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);INSERT INTO departments VALUES (1, 'Engineering');INSERT INTO departments VALUES (2, 'Marketing');CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER);INSERT INTO employees VALUES (1, 'Alice', 1);INSERT INTO employees VALUES (2, 'Bob', 1);INSERT INTO employees VALUES (3, 'Charlie', 2);INSERT INTO employees VALUES (4, 'Diana', 2);CREATE TABLE projects (id INTEGER PRIMARY KEY, project_name TEXT NOT NULL, employee_id INTEGER);INSERT INTO projects VALUES (1, 'Web App', 1);INSERT INTO projects VALUES (2, 'Mobile App', 1);INSERT INTO projects VALUES (3, 'Ad Campaign', 3);`,
    expectedSQL: "SELECT e.name, d.dept_name, p.project_name FROM employees e JOIN departments d ON e.dept_id = d.id JOIN projects p ON e.id = p.employee_id;",
    hints: ['多表连接需要多个 JOIN 子句', '每个 JOIN 后面跟上 ON 条件'],
    explanation: '三表连接面试高频题。通过 JOIN 链把三张表关联起来。',
  },
  {
    id: 'sql-inner-join-4',
    unitId: 'sql-joins',
    title: 'JOIN + 条件过滤',
    description: '查询 Engineering 部门所有员工的姓名和薪资。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, dept_id, salary) / departments(id, dept_name)',
    setupSQL: `CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);INSERT INTO departments VALUES (1, 'Engineering');INSERT INTO departments VALUES (2, 'Marketing');INSERT INTO departments VALUES (3, 'Sales');CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 1, 120000);INSERT INTO employees VALUES (2, 'Bob', 1, 90000);INSERT INTO employees VALUES (3, 'Charlie', 2, 110000);INSERT INTO employees VALUES (4, 'Diana', 3, 95000);`,
    expectedSQL: "SELECT e.name, e.salary FROM employees e JOIN departments d ON e.dept_id = d.id WHERE d.dept_name = 'Engineering';",
    hints: ['先 JOIN 再 WHERE'],
    explanation: 'JOIN 后加 WHERE 是最常见的 JOIN + 过滤模式。',
  },
  {
    id: 'sql-left-join-2',
    unitId: 'sql-joins',
    title: 'LEFT JOIN 查空部门',
    description: '查询所有部门及其员工数，包含没有员工的部门（显示 0）。',
    difficulty: 'medium',
    tableSchema: 'departments(id, dept_name) / employees(id, name, dept_id)',
    setupSQL: `CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);INSERT INTO departments VALUES (1, 'Engineering');INSERT INTO departments VALUES (2, 'Marketing');INSERT INTO departments VALUES (3, 'HR');INSERT INTO departments VALUES (4, 'Sales');CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER);INSERT INTO employees VALUES (1, 'Alice', 1);INSERT INTO employees VALUES (2, 'Bob', 1);INSERT INTO employees VALUES (3, 'Charlie', 2);`,
    expectedSQL: "SELECT d.dept_name, COUNT(e.id) AS emp_count FROM departments d LEFT JOIN employees e ON d.id = e.dept_id GROUP BY d.dept_name;",
    hints: ['LEFT JOIN 保留左表所有行', 'COUNT(右表列) 不会统计 NULL'],
    explanation: 'LEFT JOIN + GROUP BY + COUNT 是查无数据的经典模式。用 COUNT(e.id) 而非 COUNT(*)。',
  },
  {
    id: 'sql-join-agg-2',
    unitId: 'sql-joins',
    title: 'JOIN + 聚合分析',
    description: '查询每个部门的部门名、员工数、最高薪资和最低薪资。',
    difficulty: 'medium',
    tableSchema: 'departments(id, dept_name) / employees(id, name, dept_id, salary)',
    setupSQL: `CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);INSERT INTO departments VALUES (1, 'Engineering');INSERT INTO departments VALUES (2, 'Marketing');CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 1, 120000);INSERT INTO employees VALUES (2, 'Bob', 1, 90000);INSERT INTO employees VALUES (3, 'Charlie', 1, 110000);INSERT INTO employees VALUES (4, 'Diana', 2, 95000);INSERT INTO employees VALUES (5, 'Eve', 2, 85000);`,
    expectedSQL: "SELECT d.dept_name, COUNT(e.id) AS emp_count, MAX(e.salary) AS max_salary, MIN(e.salary) AS min_salary FROM departments d LEFT JOIN employees e ON d.id = e.dept_id GROUP BY d.dept_name;",
    hints: ['LEFT JOIN 保留所有部门', 'GROUP BY 按部门聚合统计'],
    explanation: 'JOIN + GROUP BY 是最常见的数据分析模式。',
  },
  {
    id: 'sql-self-join-2',
    unitId: 'sql-joins',
    title: 'SELF JOIN 组织架构',
    description: 'employees 表有 manager_id 表示上级。查询每个员工及其上级的姓名。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, manager_id)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, manager_id INTEGER);INSERT INTO employees VALUES (1, 'Alice', NULL);INSERT INTO employees VALUES (2, 'Bob', 1);INSERT INTO employees VALUES (3, 'Charlie', 1);INSERT INTO employees VALUES (4, 'Diana', 2);INSERT INTO employees VALUES (5, 'Eve', 2);`,
    expectedSQL: "SELECT e1.name AS employee, e2.name AS manager FROM employees e1 LEFT JOIN employees e2 ON e1.manager_id = e2.id;",
    hints: ['给同一张表起两个不同的别名', '用 LEFT JOIN 保留无上级的员工'],
    explanation: '自连接是 SQL 面试难点——把一张表当作两张表用。常见于组织架构。',
  },

  // ===== 新增题：窗口函数 =====
  {
    id: 'sql-row-number-1',
    unitId: 'window-functions',
    title: 'ROW_NUMBER 分区排名',
    description: '给每个部门按薪资降序编号，薪资最高的标为 1。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 90000);INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000);INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 95000);INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000);`,
    expectedSQL: "SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num FROM employees;",
    hints: ['ROW_NUMBER 给每个分区内的行编号', 'PARTITION BY 定义分区'],
    explanation: 'ROW_NUMBER 是窗口函数最基础也最有用的一种。结合 PARTITION BY 实现组内排名。',
  },
  {
    id: 'sql-rank-3',
    unitId: 'window-functions',
    title: 'RANK vs DENSE_RANK',
    description: '同时用 RANK 和 DENSE_RANK 排名，对比区别。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 120000);INSERT INTO employees VALUES (2, 'Bob', 120000);INSERT INTO employees VALUES (3, 'Charlie', 110000);INSERT INTO employees VALUES (4, 'Diana', 95000);INSERT INTO employees VALUES (5, 'Eve', 95000);`,
    expectedSQL: "SELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS rank, DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank FROM employees;",
    hints: ['RANK 并列会跳过后续名次', 'DENSE_RANK 并列不会跳过名次'],
    explanation: 'RANK 跳号（1,1,3），DENSE_RANK 不跳号（1,1,2）。面试必考区别！',
  },
  {
    id: 'sql-lag-2',
    unitId: 'window-functions',
    title: 'LAG 环比增长率',
    description: '计算每日销售额的环比增长率和增长金额。',
    difficulty: 'hard',
    tableSchema: 'daily_sales(date, sales)',
    setupSQL: `CREATE TABLE daily_sales (date TEXT PRIMARY KEY, sales REAL NOT NULL);INSERT INTO daily_sales VALUES ('2024-01-01', 1000);INSERT INTO daily_sales VALUES ('2024-01-02', 1200);INSERT INTO daily_sales VALUES ('2024-01-03', 1100);INSERT INTO daily_sales VALUES ('2024-01-04', 1500);`,
    expectedSQL: "SELECT date, sales, sales - LAG(sales) OVER (ORDER BY date) AS mom_change, ROUND((sales - LAG(sales) OVER (ORDER BY date)) * 100.0 / LAG(sales) OVER (ORDER BY date), 2) AS mom_pct FROM daily_sales;",
    hints: ['LAG 可以访问前一行的值'],
    explanation: 'LAG 环比计算是数据分析面试必考题。用 LAG 取前一周期值，再算差额和百分比。',
  },
  {
    id: 'sql-window-agg-3',
    unitId: 'window-functions',
    title: '累计求和 Running Total',
    description: '计算每日的累计销售额（从第一天到当天的总和）。',
    difficulty: 'medium',
    tableSchema: 'daily_sales(date, sales)',
    setupSQL: `CREATE TABLE daily_sales (date TEXT PRIMARY KEY, sales REAL NOT NULL);INSERT INTO daily_sales VALUES ('2024-01-01', 1000);INSERT INTO daily_sales VALUES ('2024-01-02', 1200);INSERT INTO daily_sales VALUES ('2024-01-03', 1100);INSERT INTO daily_sales VALUES ('2024-01-04', 1500);`,
    expectedSQL: "SELECT date, sales, SUM(sales) OVER (ORDER BY date) AS running_total FROM daily_sales;",
    hints: ['SUM OVER ORDER BY 实现累计求和'],
    explanation: 'SUM OVER ORDER BY 是窗口聚合的经典用法——每行累计到当前行的总和。',
  },
  {
    id: 'sql-window-agg-4',
    unitId: 'window-functions',
    title: '移动平均 MA3',
    description: '计算每日销售额的 3 天移动平均值。',
    difficulty: 'hard',
    tableSchema: 'daily_sales(date, sales)',
    setupSQL: `CREATE TABLE daily_sales (date TEXT PRIMARY KEY, sales REAL NOT NULL);INSERT INTO daily_sales VALUES ('2024-01-01', 1000);INSERT INTO daily_sales VALUES ('2024-01-02', 1200);INSERT INTO daily_sales VALUES ('2024-01-03', 1100);INSERT INTO daily_sales VALUES ('2024-01-04', 1500);INSERT INTO daily_sales VALUES ('2024-01-05', 1400);`,
    expectedSQL: "SELECT date, sales, ROUND(AVG(sales) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3 FROM daily_sales;",
    hints: ['使用 ROWS BETWEEN 定义窗口范围', '移动平均是时间序列分析基础'],
    explanation: '移动平均通过 ROWS BETWEEN 定义窗口范围。面试常考 MA3、MA7。',
  },
  {
    id: 'sql-window-agg-5',
    unitId: 'window-functions',
    title: '组内占比计算',
    description: '计算每个员工薪资占其部门总薪资的百分比。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 90000);INSERT INTO employees VALUES (3, 'Charlie', 'Marketing', 110000);INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 65000);`,
    expectedSQL: "SELECT name, department, salary, ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY department), 2) AS pct FROM employees;",
    hints: ['SUM OVER PARTITION BY 计算组内总和'],
    explanation: '窗口中用聚合函数 OVER PARTITION BY 实现组内占比，是数据分析的常用技巧。',
  },

  // ===== 新增题：子查询 =====
  {
    id: 'sql-subquery-3',
    unitId: 'advanced-sql',
    title: '相关子查询',
    description: '查询薪资高于其所在部门平均薪资的员工。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 90000);INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000);INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 95000);INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000);`,
    expectedSQL: "SELECT e1.name, e1.salary, e1.department FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department = e1.department);",
    hints: ['相关子查询引用外层表的列', '每行都会执行一次子查询'],
    explanation: '相关子查询是面试高频难题。内层查询依赖外层行的值，每行都要执行一次。',
  },
  {
    id: 'sql-subquery-4',
    unitId: 'advanced-sql',
    title: 'SELECT 中的标量子查询',
    description: '查询每个员工的姓名、薪资，以及薪资与公司平均薪资的差额。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 120000);INSERT INTO employees VALUES (2, 'Bob', 90000);INSERT INTO employees VALUES (3, 'Charlie', 110000);INSERT INTO employees VALUES (4, 'Diana', 95000);`,
    expectedSQL: "SELECT name, salary, (SELECT AVG(salary) FROM employees) AS company_avg, salary - (SELECT AVG(salary) FROM employees) AS diff_from_avg FROM employees;",
    hints: ['标量子查询返回单个值', '可以用在 SELECT 子句中'],
    explanation: 'SELECT 里的子查询必须返回单个值（标量）。常用于查询时做对比基准。',
  },
  {
    id: 'sql-subquery-5',
    unitId: 'advanced-sql',
    title: 'EXISTS 与 NOT EXISTS',
    description: '查询没有员工的部门。',
    difficulty: 'medium',
    tableSchema: 'departments(id, dept_name) / employees(id, name, dept_id)',
    setupSQL: `CREATE TABLE departments (id INTEGER PRIMARY KEY, dept_name TEXT NOT NULL);INSERT INTO departments VALUES (1, 'Engineering');INSERT INTO departments VALUES (2, 'Marketing');INSERT INTO departments VALUES (3, 'HR');CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER);INSERT INTO employees VALUES (1, 'Alice', 1);INSERT INTO employees VALUES (2, 'Bob', 1);INSERT INTO employees VALUES (3, 'Charlie', 2);`,
    expectedSQL: "SELECT d.dept_name FROM departments d WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);",
    hints: ['EXISTS 找到第一条匹配就返回 TRUE'],
    explanation: 'EXISTS 在找到第一行时就停止，效率高于 IN。',
  },

  // ===== 新增题：CTE =====
  {
    id: 'sql-cte-3',
    unitId: 'advanced-sql',
    title: '多 CTE 级联查询',
    description: '分别计算各部门的平均薪资和人数，联合查询出人数 > 1 且平均薪资 > 90000 的部门。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, department, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 120000);INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 90000);INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 110000);INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 95000);INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 85000);`,
    expectedSQL: "WITH dept_avg AS (SELECT department, AVG(salary) AS avg_sal FROM employees GROUP BY department), dept_count AS (SELECT department, COUNT(*) AS cnt FROM employees GROUP BY department) SELECT a.department, a.avg_sal, c.cnt FROM dept_avg a JOIN dept_count c ON a.department = c.department WHERE a.avg_sal > 90000 AND c.cnt > 1;",
    hints: ['WITH 后面可以定义多个 CTE，用逗号分隔'],
    explanation: '多 CTE 让复杂查询像流水线一样清晰——每一步都在前一步的基础上加工。',
  },
  {
    id: 'sql-cte-4',
    unitId: 'advanced-sql',
    title: '递归 CTE 生成日期序列',
    description: '用递归 CTE 生成 2024 年 1 月的所有日期。',
    difficulty: 'hard',
    tableSchema: '无',
    setupSQL: '',
    expectedSQL: "WITH RECURSIVE dates AS (SELECT DATE('2024-01-01') AS dt UNION ALL SELECT DATE(dt, '+1 day') FROM dates WHERE dt < '2024-01-31') SELECT * FROM dates;",
    hints: ['递归 CTE 需要 UNION ALL', '递归部分引用自身并添加终止条件'],
    explanation: '递归 CTE 面试加分题！常用于生成日历数据。',
  },
  {
    id: 'sql-cte-5',
    unitId: 'advanced-sql',
    title: 'CTE 用户次日留存',
    description: '计算每个首次登录日期的用户次日留存数。',
    difficulty: 'hard',
    tableSchema: 'logins(id, user_id, login_date)',
    setupSQL: `CREATE TABLE logins (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, login_date DATE NOT NULL);INSERT INTO logins VALUES (1, 1, '2024-01-01');INSERT INTO logins VALUES (2, 1, '2024-01-02');INSERT INTO logins VALUES (3, 2, '2024-01-01');INSERT INTO logins VALUES (4, 3, '2024-01-01');INSERT INTO logins VALUES (5, 3, '2024-01-02');INSERT INTO logins VALUES (6, 2, '2024-01-03');`,
    expectedSQL: "WITH first_login AS (SELECT user_id, MIN(login_date) AS first_date FROM logins GROUP BY user_id) SELECT f.first_date, COUNT(DISTINCT l.user_id) AS retained FROM first_login f LEFT JOIN logins l ON f.user_id = l.user_id AND l.login_date = DATE(f.first_date, '+1 day') GROUP BY f.first_date;",
    hints: ['先找出每个用户首次登录日期作为基准', 'LEFT JOIN 查找次日登录'],
    explanation: '留存率分析是数据分析师面试必考题。用 CTE 先取基准组，再计算后续活跃用户。',
  },

  // ===== 新增题：集合 / 字符串 / 日期 / 进阶 =====
  {
    id: 'sql-set-3',
    unitId: 'advanced-sql',
    title: 'UNION ALL 合并结果',
    description: '查询两个地区的销售团队名单合并到一起。',
    difficulty: 'easy',
    tableSchema: 'sales_north(name, sales) / sales_south(name, sales)',
    setupSQL: `CREATE TABLE sales_north (name TEXT NOT NULL, sales REAL NOT NULL);INSERT INTO sales_north VALUES ('Alice', 1000);INSERT INTO sales_north VALUES ('Bob', 900);CREATE TABLE sales_south (name TEXT NOT NULL, sales REAL NOT NULL);INSERT INTO sales_south VALUES ('Charlie', 1100);INSERT INTO sales_south VALUES ('Diana', 950);`,
    expectedSQL: "SELECT name, sales FROM sales_north UNION ALL SELECT name, sales FROM sales_south;",
    hints: ['UNION ALL 保留所有行包括重复', '列数必须相同'],
    explanation: 'UNION ALL 性能比 UNION 好，因为不检查重复。',
  },
  {
    id: 'sql-set-4',
    unitId: 'advanced-sql',
    title: 'EXCEPT 查差异',
    description: '查询全部产品中当前没有库存的产品。',
    difficulty: 'medium',
    tableSchema: 'products_all(product_id) / products_current(product_id)',
    setupSQL: `CREATE TABLE products_all (product_id TEXT PRIMARY KEY);INSERT INTO products_all VALUES ('A001');INSERT INTO products_all VALUES ('A002');INSERT INTO products_all VALUES ('A003');INSERT INTO products_all VALUES ('A004');CREATE TABLE products_current (product_id TEXT PRIMARY KEY);INSERT INTO products_current VALUES ('A001');INSERT INTO products_current VALUES ('A003');`,
    expectedSQL: "SELECT product_id FROM products_all EXCEPT SELECT product_id FROM products_current;",
    hints: ['EXCEPT 返回左表有右表无的数据'],
    explanation: 'EXCEPT 常用于数据差异对比和分析，比如查缺失数据。',
  },
  {
    id: 'sql-str-2',
    unitId: 'advanced-sql',
    title: '字符串拼接',
    description: '从 employees 表将姓名和部门用 - 拼接成一个字段。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, department)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering');INSERT INTO employees VALUES (2, 'Bob', 'Marketing');`,
    expectedSQL: "SELECT name || ' - ' || department AS name_dept FROM employees;",
    hints: ['SQLite 用 || 拼接字符串'],
    explanation: '不同数据库字符串拼接语法不同，SQLite 用 ||，MySQL 用 CONCAT()。',
  },
  {
    id: 'sql-str-3',
    unitId: 'advanced-sql',
    title: '提取邮箱用户名',
    description: '从 employees 表的 email 字段中提取 @ 符号前的用户名部分。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, email)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'alice@company.com');INSERT INTO employees VALUES (2, 'Bob', 'bob@company.com');INSERT INTO employees VALUES (3, 'Charlie', 'charlie@test.org');`,
    expectedSQL: "SELECT email, SUBSTR(email, 1, INSTR(email, '@') - 1) AS username FROM employees;",
    hints: ['INSTR 查找字符位置', 'SUBSTR 截取字符串'],
    explanation: '字符串处理是数据分析师基本功。INSTR 定位 @，SUBSTR 截取前面的部分。',
  },
  {
    id: 'sql-date-2',
    unitId: 'advanced-sql',
    title: '日期提取年/月',
    description: '从 employees 表中提取每位员工的入职年份和月份。',
    difficulty: 'easy',
    tableSchema: 'employees(id, name, hire_date)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, hire_date TEXT NOT NULL);INSERT INTO employees VALUES (1, 'Alice', '2020-01-15');INSERT INTO employees VALUES (2, 'Bob', '2021-03-20');INSERT INTO employees VALUES (3, 'Charlie', '2019-11-01');`,
    expectedSQL: "SELECT name, hire_date, STRFTIME('%Y', hire_date) AS hire_year, STRFTIME('%m', hire_date) AS hire_month FROM employees;",
    hints: ['SQLite 用 STRFTIME 格式化日期'],
    explanation: 'STRFTIME 是 SQLite 中处理日期的核心函数。%Y 年份，%m 月份，%d 日。',
  },
  {
    id: 'sql-date-3',
    unitId: 'advanced-sql',
    title: '日期差计算',
    description: '计算每位员工入职至今的天数。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, hire_date)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, hire_date TEXT NOT NULL);INSERT INTO employees VALUES (1, 'Alice', '2020-01-15');INSERT INTO employees VALUES (2, 'Bob', '2021-03-20');INSERT INTO employees VALUES (3, 'Charlie', '2022-11-01');`,
    expectedSQL: "SELECT name, hire_date, CAST(JULIANDAY('now') - JULIANDAY(hire_date) AS INTEGER) AS days_employed FROM employees;",
    hints: ['JULIANDAY 把日期转成儒略日数字'],
    explanation: 'JULIANDAY 转成数值后相减得到天数差。',
  },
  {
    id: 'sql-date-4',
    unitId: 'advanced-sql',
    title: '按年月分组统计',
    description: '统计每个年月的入职人数，按年月排序。',
    difficulty: 'medium',
    tableSchema: 'employees(id, name, hire_date)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, hire_date TEXT NOT NULL);INSERT INTO employees VALUES (1, 'Alice', '2020-01-15');INSERT INTO employees VALUES (2, 'Bob', '2020-01-20');INSERT INTO employees VALUES (3, 'Charlie', '2020-02-01');INSERT INTO employees VALUES (4, 'Diana', '2020-02-10');INSERT INTO employees VALUES (5, 'Eve', '2021-03-01');`,
    expectedSQL: "SELECT STRFTIME('%Y-%m', hire_date) AS year_month, COUNT(*) AS hires FROM employees GROUP BY year_month ORDER BY year_month;",
    hints: ['先格式化日期到年月，再 GROUP BY'],
    explanation: '按年月分组统计是最常见的日期聚合模式。',
  },
  {
    id: 'sql-percentile-1',
    unitId: 'advanced-sql',
    title: '四分位与百分位',
    description: '将员工按薪资分为四等份，并计算每个员工的百分位排名。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, salary)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, salary REAL NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 120000);INSERT INTO employees VALUES (2, 'Bob', 95000);INSERT INTO employees VALUES (3, 'Charlie', 110000);INSERT INTO employees VALUES (4, 'Diana', 85000);INSERT INTO employees VALUES (5, 'Eve', 65000);INSERT INTO employees VALUES (6, 'Frank', 78000);INSERT INTO employees VALUES (7, 'Grace', 135000);INSERT INTO employees VALUES (8, 'Henry', 100000);`,
    expectedSQL: "SELECT name, salary, NTILE(4) OVER (ORDER BY salary) AS quartile, ROUND(PERCENT_RANK() OVER (ORDER BY salary) * 100, 1) AS pct_rank FROM employees;",
    hints: ['NTILE(N) 平均分成 N 组', 'PERCENT_RANK 返回百分比排名 0-1'],
    explanation: '百分位分析用于评估相对位置。NTILE 分箱（四分位），PERCENT_RANK 精确百分比排名。',
  },
  {
    id: 'sql-pivot-1',
    unitId: 'advanced-sql',
    title: '行转列 Pivot',
    description: '统计每个部门中各个职位的员工数量，行转列显示。',
    difficulty: 'hard',
    tableSchema: 'employees(id, name, department, position)',
    setupSQL: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department TEXT NOT NULL, position TEXT NOT NULL);INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 'Senior');INSERT INTO employees VALUES (2, 'Bob', 'Engineering', 'Junior');INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 'Senior');INSERT INTO employees VALUES (4, 'Diana', 'Marketing', 'Senior');INSERT INTO employees VALUES (5, 'Eve', 'Marketing', 'Junior');INSERT INTO employees VALUES (6, 'Frank', 'Marketing', 'Senior');`,
    expectedSQL: "SELECT department, SUM(CASE WHEN position = 'Senior' THEN 1 ELSE 0 END) AS senior_count, SUM(CASE WHEN position = 'Junior' THEN 1 ELSE 0 END) AS junior_count FROM employees GROUP BY department;",
    hints: ['用 CASE WHEN + SUM 做行转列', '每个 CASE WHEN 生成一列'],
    explanation: '行转列是数据分析面试高频题。用 CASE WHEN 把列值分散成多个列。',
  },
  {
    id: 'sql-funnel-1',
    unitId: 'advanced-sql',
    title: '漏斗转化率',
    description: '计算用户从浏览到点击再到购买的漏斗各步骤转化人数和转化率。',
    difficulty: 'hard',
    tableSchema: 'events(event_id, user_id, event, event_time)',
    setupSQL: `CREATE TABLE events (event_id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, event TEXT NOT NULL, event_time TEXT NOT NULL);INSERT INTO events VALUES (1, 1, 'view', '2024-01-01 10:00');INSERT INTO events VALUES (2, 1, 'click', '2024-01-01 10:05');INSERT INTO events VALUES (3, 1, 'purchase', '2024-01-01 10:10');INSERT INTO events VALUES (4, 2, 'view', '2024-01-01 11:00');INSERT INTO events VALUES (5, 2, 'click', '2024-01-01 11:05');INSERT INTO events VALUES (6, 3, 'view', '2024-01-01 12:00');INSERT INTO events VALUES (7, 4, 'view', '2024-01-01 13:00');INSERT INTO events VALUES (8, 4, 'click', '2024-01-01 13:05');`,
    expectedSQL: "WITH view_users AS (SELECT COUNT(DISTINCT user_id) AS cnt FROM events WHERE event = 'view'), click_users AS (SELECT COUNT(DISTINCT user_id) AS cnt FROM events WHERE event = 'click'), purchase_users AS (SELECT COUNT(DISTINCT user_id) AS cnt FROM events WHERE event = 'purchase') SELECT 'view' AS stage, cnt, 100.0 AS conversion_rate FROM view_users UNION ALL SELECT 'click', cnt, ROUND(cnt * 100.0 / (SELECT cnt FROM view_users), 1) FROM click_users UNION ALL SELECT 'purchase', cnt, ROUND(cnt * 100.0 / (SELECT cnt FROM view_users), 1) FROM purchase_users;",
    hints: ['漏斗每一层是独立的 COUNT(DISTINCT)', '转化率 = 当前层 / 首层 * 100%'],
    explanation: '漏斗分析是分析师面试考题中的常客。每层是独立计算的用户去重数。',
  },
  {
    id: 'sql-cohort-1',
    unitId: 'advanced-sql',
    title: 'Cohort 留存分析',
    description: '按首次下单月份分组（同期群），统计每个同期群在各月的活跃用户数。',
    difficulty: 'hard',
    tableSchema: 'orders(id, user_id, order_date)',
    setupSQL: `CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, order_date DATE NOT NULL);INSERT INTO orders VALUES (1, 1, '2024-01-05');INSERT INTO orders VALUES (2, 1, '2024-02-10');INSERT INTO orders VALUES (3, 2, '2024-01-15');INSERT INTO orders VALUES (4, 2, '2024-02-20');INSERT INTO orders VALUES (5, 2, '2024-03-01');INSERT INTO orders VALUES (6, 3, '2024-02-01');INSERT INTO orders VALUES (7, 3, '2024-02-15');INSERT INTO orders VALUES (8, 3, '2024-03-10');INSERT INTO orders VALUES (9, 4, '2024-01-20');`,
    expectedSQL: "WITH cohort AS (SELECT user_id, STRFTIME('%Y-%m', MIN(order_date)) AS cohort_month FROM orders GROUP BY user_id), activity AS (SELECT user_id, STRFTIME('%Y-%m', order_date) AS order_month FROM orders GROUP BY user_id, order_month) SELECT c.cohort_month AS cohort, COUNT(DISTINCT c.user_id) AS cohort_size, a.order_month, COUNT(DISTINCT a.user_id) AS active_users FROM cohort c LEFT JOIN activity a ON c.user_id = a.user_id GROUP BY c.cohort_month, a.order_month ORDER BY c.cohort_month, a.order_month;",
    hints: ['CTE1: 先找每个用户首月 cohort', 'CTE2: 再按月统计各用户活跃情况'],
    explanation: 'Cohort 留存在数据面试中是最高频的 SQL 题。首月分组，按月追踪后续活跃。',
  },
];

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
