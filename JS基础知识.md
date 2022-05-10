# 1-脚本引用

```
<script>
    alert('Hello, world!');
  </script>
```

```
<script src="/path/to/script.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script>
```

# 2-代码结构

```
alert('Hello'); alert('World');
[1, 2].forEach(alert);
```

最好记得加分号；

单行注释Ctrl+/

```
//。。。。。。。。
```

多行注释Ctrl+Shift+/

```
/*。。。。。。*/
```

# 3-严格模式

将 `"use strict";` 写在脚本的顶部开启严格模式

# 4-变量

- `let` — 现代的变量声明方式。
- `var` — 老旧的变量声明方式。一般情况下，我们不会再使用它。但是，我们会在 [旧时的 "var"](https://zh.javascript.info/var) 章节介绍 `var` 和 `let` 的微妙差别，以防你需要它们。
- `const` — 类似于 `let`，但是变量的值无法被修改。

驼峰式命名法（[camelCase](https://en.wikipedia.org/wiki/CamelCase)）；

美元符号 `'$'` 和下划线 `'_'` 也可以用于变量命名

# 5-数据类型

## Number

```
Infinity`、`-Infinity` 和 `NaN；
NaN 代表一个计算错误；
任何对 NaN 的进一步数学运算都会返回 NaN。
```

## BigInt

用于表示任意长度的整数

```
// 尾部的 "n" 表示这是一个 BigInt 类型
const bigInt = 1234567890123456789012345678901234567890n;
```

## String

双引号和单引号都是“简单”引用，在 JavaScript 中两者几乎没有什么差别。

反引号是 **功能扩展** 引号。它们允许我们通过将变量和表达式包装在 `${…}` 中，来将它们嵌入到字符串中。

```
let name = "John";

// 嵌入一个变量
alert( `Hello, ${name}!` ); // Hello, John!

// 嵌入一个表达式
alert( `the result is ${1 + 2}` ); // the result is 3
```

## Boolean

boolean 类型仅包含两个值：`true` 和 `false`。

## ”null“值和”undefined“值

JavaScript 中的 `null` 仅仅是一个代表“无”、“空”或“值未知”的特殊值。

如果一个变量已被声明，但未被赋值，那么它的值就是 `undefined`：

## object、symbol和typeof

`object` 则用于储存数据集合和更复杂的实体。

`symbol` 类型用于创建对象的唯一标识符。

`typeof` 运算符返回参数的类型。

通常用作 `typeof x`，但 `typeof(x)` 也可行。

# 6-交互：alert、prompt和confirm

```
alert("Hello");
//带有信息的小窗口被称为 模态窗。

result = prompt(title, [default]);
//带有文本消息的模态窗口，还有 input 框和确定/取消按钮
title
 显示给用户的文本
default
 可选的第二个参数，指定 input 框的初始值。
result 
 获取输入文本值
 
result = confirm(question);
//confirm 函数显示一个带有 question 以及确定和取消两个按钮的模态窗口。
点击确定返回 true，点击取消返回 false。
```

# 7-类型转换

有三种常用的类型转换：转换为 string 类型、转换为 number 类型和转换为 boolean 类型。

**字符串转换** —— 转换发生在输出内容的时候，也可以通过 `String(value)` 进行显式转换。原始类型值的 string 类型转换通常是很明显的。

**数字型转换** —— 转换发生在进行算术操作时，也可以通过 `Number(value)` 进行显式转换。

数字型转换遵循以下规则：

| 值             | 变成……                                                       |
| :------------- | :----------------------------------------------------------- |
| `undefined`    | `NaN`                                                        |
| `null`         | `0`                                                          |
| `true / false` | `1 / 0`                                                      |
| `string`       | “按原样读取”字符串，两端的空白会被忽略。空字符串变成 `0`。转换出错则输出 `NaN`。 |

**布尔型转换** —— 转换发生在进行逻辑操作时，也可以通过 `Boolean(value)` 进行显式转换。

布尔型转换遵循以下规则：

| 值                                    | 变成……  |
| :------------------------------------ | :------ |
| `0`, `null`, `undefined`, `NaN`, `""` | `false` |
| 其他值                                | `true`  |

# 8-基础运算符

- 取余 `%`, `a % b` 的结果是 `a` 整除 `b` 的余数
- 求幂 `**`. 求幂运算 `a ** b` 将 `a` 提升至 `a` 的 `b` 次幂

```
alert(2 + 2 + '1' ); // "41"，不是 "221"
```

```
alert('1' + 2 + 2); // "122"，不是 "14"
```

```
alert( 6 - '2' ); // 4，将 '2' 转换为数字
alert( '6' / '2' ); // 3，将两个运算元都转换为数字
```

```
let apples = "2";
let oranges = "3";

// 在二元运算符加号起作用之前，所有的值都被转化为了数字
alert( +apples + +oranges ); // 5

// 更长的写法
// alert( Number(apples) + Number(oranges) ); // 5
```

```
a = b = c = 2 + 2;
alert( a ); // 4
alert( b ); // 4
alert( c ); // 4
```

```
let n = 2;

n *= 3 + 5;

alert( n ); // 16 
```

```
let counter = 0;
alert( ++counter ); // 1

let counter = 0;
alert( counter++ ); // 0
```

```
let counter = 1;
alert( 2 * counter++ ); // 2，因为 counter++ 返回的是“旧值”
let counter = 1;
alert( 2 * ++counter ); // 4
```

# 9-比较

## ==和===

普通的相等性检查 `==` 存在一个问题，它不能区分出 `0` 和 `false`：

```javascript
alert( 0 == false ); // true
```

也同样无法区分空字符串和 `false`：

```javascript
alert( '' == false ); // true
```

**严格相等运算符 `===` 在进行比较时不会做任何的类型转换。**

换句话说，如果 `a` 和 `b` 属于不同的数据类型，那么 `a === b` 不会做任何的类型转换而立刻返回 `false`

```
alert( 0 === false ); // false，因为被比较值的数据类型不同
```

## null与undefined

当使用严格相等 `===` 比较二者时

它们不相等，因为它们属于不同的类型。

```javascript
alert( null === undefined ); // false
```

当使用非严格相等 `==` 比较二者时

JavaScript 存在一个特殊的规则，会判定它们相等。它们俩就像“一对恋人”，仅仅等于对方而不等于其他任何的值（只在非严格相等下成立）。

```javascript
alert( null == undefined ); // true
```

当使用数学式或其他比较方法 `< > <= >=` 时：

`null/undefined` 会被转化为数字：`null` 被转化为 `0`，`undefined` 被转化为 `NaN`。

`undefined` 不应该被与其他值进行比较，它与任何值进行比较都会返回 `false`，除了==undefined

# 10-条件运算符？

```javascript
let result = condition ? value1 : value2;
```

计算条件结果，如果结果为真，则返回 `value1`，否则返回 `value2`

可使用多个？

```javascript
let message = (age < 3) ? 'Hi, baby!' :
  (age < 18) ? 'Hello!' :
  (age < 100) ? 'Greetings!' :
  'What an unusual age!';

alert( message );
```

经过仔细观察，我们可以看到它只是一个普通的检查序列。

# 11-逻辑运算符

`||`（或），`&&`（与），`!`（非），`??`（空值合并运算符）

`||`（或）：

1.寻找真值

```
let firstName = ""; 
let lastName = ""; 
let nickName = "SuperCoder"; 
alert( firstName || lastName || nickName || "Anonymous"); // SuperCoder
```

2.短路求值

```
true || alert("not printed");
false || alert("printed");
```

只会打印第二条信息。

`&&`（与）：

如果结果是 `false`，就停止计算

```
alert( 1 && 0 ); // 0 
alert( 1 && 5 ); // 5 
alert( null && 5 ); // null
alert( 0 && "no matter what" ); // 0
```

&&优先级高于||

`!`（非）：

非运算符 `!` 的优先级在所有逻辑运算符里面最高，所以它总是在 `&&` 和 `||` 之前执行。

`??`（空值合并运算符）：

 `a ?? b` 的结果是：

- 如果 `a` 是已定义的，则结果为 `a`，

- 如果 `a` 不是已定义的，则结果为 `b`。

  ```
  let firstName = null;
  let lastName = null;
  let nickName = "Supercoder";
  
  // 显示第一个已定义的值：
  alert(firstName ?? lastName ?? nickName ?? "Anonymous"); // Supercoder
  ```

  ```
  // 当 height 的值为 null 或 undefined 时，将 height 的值设置为 100
  height = height ?? 100;
  ```

# 循环

```
1. while (condition) {
  // 代码
  // 所谓的“循环体”
 }
 
2. do {
  // 循环体
 } while (condition);
 
3. for (begin; condition; step) {
  // ……循环体……
 }
```

通常条件为假时，循环会终止。可以使用 `break` 指令强制退出。

`continue` 指令不会停掉整个循环。而是停止当前这一次迭代，并强制启动新一轮循环（如果条件允许的话）。

**禁止** `break/continue` **在 ‘?’ 的右边**

需要一次从多层嵌套的循环中跳出来：

**标签** 是在循环之前带有冒号的标识符：
break <labelName> 语句跳出循环至标签处：

```
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    let input = prompt(`Value at coords (${i},${j})`, '');
    // 如果是空字符串或被取消，则中断并跳出这两个循环。
    if (!input) break outer; // (*)
    // 用得到的值做些事……
  }
}
alert('Done!');
```

# switch

```
switch(x) {
  case 'value1':  // if (x === 'value1')
    ...
    [break]

  case 'value2':  // if (x === 'value2')
    ...
    [break]

  default:
    ...
    [break]
}
```

**如果没有 `break`，程序将不经过任何检查就会继续执行下一个 `case`。**

**任何表达式都可以成为** `switch/case` **的参数**

case分组：

```
 case 3: // (*) 下面这两个 case 被分在一组
  case 5:
    alert('Wrong!');
    alert("Why don't you take a math class?");
    break;
```

# 函数

```
let sayHi = function() 
{  
alert( "Hello" ); 
};
function sayHi() {
  alert( "Hello" );
}
```

```
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

ask(
  "Do you agree?",
  function() { alert("You agreed."); },
  function() { alert("You canceled the execution."); }
);
```

这里直接在 `ask(...)` 调用内进行函数声明。这两个函数没有名字，所以叫 **匿名函数**。这样的函数在 `ask` 外无法访问（因为没有对它们分配变量）。

**箭头**函数是相当方便的。它具体有两种：

1. 不带花括号：`(...args) => expression` — 右侧是一个表达式：函数计算表达式并返回其结果。
2. 带花括号：`(...args) => { body }` — 花括号允许我们在函数中编写多个语句，但是我们需要显式地 `return` 来返回一些内容。

