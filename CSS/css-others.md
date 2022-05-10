#  background: linear-gradient()

```
background: linear-gradient(gradient_direction, color 1, color 2, color 3, ...);
第一个参数指定颜色转换开始的方向 - 它可以表示为度数，其中 90 度表示水平渐变（从左到右），45 度表示对角渐变（从左下角到右上角）。以下参数指定渐变中使用的颜色顺序。
background:linear-gradient(35deg,#CCFFFF,#FFCCCC)  好看
```

# background: repeating-linear-gradient()

```
background: repeating-linear-gradient(
      45deg,
      yellow 0px,
      yellow 40px,
      black 40px,
      black 80px
    ); 黄黑相间
```

# background: url()

```
背景照片
```

# transform: scale()

```
按比例缩放
```

# transform: skewX()

```
transform 属性的下一个函数是 skewX()，它将选定元素沿其 X（水平）轴倾斜给定度数。skewY()类似
```

# 伪元素

| 伪元素         | 例子               | 例子描述                                              |
| -------------- | ------------------ | ----------------------------------------------------- |
| ::after        | p::after           | 在每个 <p> 元素之后插入内容                           |
| ::before       | p::before          | 在每个 <p> 元素之前插入内容                           |
| ::first-letter | p::first-letter    | 匹配每个 <p> 元素中内容的首字母                       |
| ::first-line   | p::first-line      | 匹配每个 <p> 元素中内容的首行                         |
| ::selection    | p::selection       | 匹配用户选择的元素部分                                |
| ::placeholder  | input::placeholder | 匹配每个表单输入框（例如 <input>）的 placeholder 属性 |