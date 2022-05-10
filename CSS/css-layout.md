# position:relative

```
只有relative，则offset相对于当前元素位置进行
```

# 父relative+子absolute

```
子的offset相对于父元素位置
```

# position:fixed

```
只有fixed，则相对于浏览器位置。且不随滚轮移动
```

# float

```
与width一起使用，将会把该元素从正常流中抽离出来并被推到父元素的左边或者右边
```

# z-index

```
一个元素的 z-index 属性值较高时，它在堆栈中的位置比那些值较低的值高。必须为整数
```

# margin:auto

```
另一种定位技术是将块元素水平居中。一种方法是将其边距设置为 auto 值。 此方法也适用于图像。默认情况下，图像是内联元素，但是当您将 display 属性设置为 block 时，可以将其更改为块元素。
```

# flex（容器属性）

任何一个容器都可以指定为Flex布局。

```
.box{
  display: flex;
}
```

行内元素也可以使用Flex布局。

```
.box{
  display: inline-flex;
}
```

Webkit内核的浏览器，必须加上-webkit前缀。

```
.box{
  display: -webkit-flex; /* Safari */
  display: flex;
}
```

注意，设为Flex布局以后，子元素的float、clear和vertical-align属性将失效。

## flex-direction

决定主轴的方向（即项目的排列方向）

```
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

- row（默认值）：主轴为水平方向，起点在左端。
- row-reverse：主轴为水平方向，起点在右端。
- column：主轴为垂直方向，起点在上沿。
- column-reverse：主轴为垂直方向，起点在下沿。

## flex-wrap

项目都排在一条线（又称”轴线”）上。flex-wrap属性定义，如果一条轴线排不下，如何换行.

```
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

nowrap（默认）：不换行。

wrap：换行，第一行在上方。

wrap-reverse：换行，第一行在下方。

## flex-flow

flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。

```
.box {
  flex-flow: <flex-direction> <flex-wrap>;
}
```

## justify-content

定义了项目在主轴上的对齐方式。

```
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

- flex-start（默认值）：左对齐
- flex-end：右对齐
- center： 居中
- space-between：两端对齐，项目之间的间隔都相等。
- space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

## align-items

定义项目在交叉轴上如何对齐。

```
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

- flex-start：交叉轴的起点对齐。
- flex-end：交叉轴的终点对齐。
- center：交叉轴的中点对齐。
- baseline: 项目的第一行文字的基线对齐。
- stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

## align-content

定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

```
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

- flex-start：与交叉轴的起点对齐。
- flex-end：与交叉轴的终点对齐。
- center：与交叉轴的中点对齐。
- space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
- space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
- stretch（默认值）：轴线占满整个交叉轴。

# flex（项目属性）

## order

定义项目的排列顺序。数值越小，排列越靠前，默认为0。

```
.item {
  order: <integer>;
}
```

## flex-grow

定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

```
.item {
  flex-grow: <number>; /* default 0 */
}
```

## flex-shrink

定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

```
.item {
  flex-shrink: <number>; /* default 1 */
}
```

## flex-basis

定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

```
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

它可以设为跟width或height属性一样的值（比如350px），则项目将占据固定空间。

## flex

lex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。

```
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。

建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

## align-self

允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

```
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```
