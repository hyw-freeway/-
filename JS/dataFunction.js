/****************************** 数字类型 ******************************/
// #region 
// 1.num.toString(base)
let num = 1457
console.log(num.toString(2)) //返回数字二进制格式的字符串10110110001

// 2.Math.floor/ceil/round/trunc
let num2 = 5.39589
console.log(Math.floor(num2)) //向下取整5
console.log(Math.ceil(num2)) //向上取整6
console.log(Math.round(num2)) //向最近整数取整5
console.log(Math.trunc(num2)) //去掉小数部分

// 3.num.toFixed(n)
console.log(num2.toFixed(2)) //保留两位小数，四舍五入

// 4.parseInt/parseFloat(string)
console.log(parseInt("123.4px")) //读取字符串中的整数
console.log(parseFloat("123.45px")) //读取字符串中的浮点数

// 5.Math.random()
console.log(Math.random()) //返回一个0-1之间的伪随机数，不包括1

// 6.Math.max(a,b,c)/min(a,b,c)
console.log(Math.max(3,5,7)) //返回最大值
console.log(Math.min(...[3,5,7])) //返回最小值

// 7.Math.pow(n,power)
console.log(Math.pow(2,3)) //n的power次方 8
// #endregion


/****************************** 字符串类型 ******************************/
// #region 
// 1.反引号``与${}配合
console.log(`1+2=${num}吗？`) //字符串中加表达式，1+2=1457吗？

// 2.string.charAt(pos)/string[pos]
let string = "0123456789"
console.log(string.charAt(3),string[3]) //获取指定位置的字符串字符 3

// 3.for...of
let nums = []
for ( let num of string ) { //遍历字符串各字符
    nums.push(num)
}
console.log(nums) //['0', '1', '2', '3','4', '5', '6', '7','8', '9']

// 4.string.toLowerCase()/toUpperCase()/
let string1 = "aBcDeF"
console.log(string1.toLowerCase()) //所有字符转小写
console.log(string1.toUpperCase()) //所有字符转大写
let stringArray = Array.from(string1) //所有字符大小写互转
let result = stringArray.map((value)=>{
    return value.toLowerCase() == value ? value.toUpperCase() : value.toLowerCase() 
})
console.log(result.join(""))

// 5.string.indexOf(substr, pos)/lastIndexOf(substr, pos)
console.log(string.indexOf("2",0)) //从0处寻找“2”字符，找到，返回其位置2
console.log(string.lastIndexOf("2",9)) //从9处反方向寻找“2”字符，找到，返回其位置2
console.log(string.indexOf("10",0)) //没找到，返回-1

// 6.string.includes(substr, pos)
console.log(string.includes("2",0)) //从0处寻找“2”字符，找到，返回true，没找到返回false

// 7.string.startsWith(substr)/endsWith(substr)
console.log(string1.startsWith("a")) //判断字符串是否以a开头，是返回true
console.log(string1.endsWith("l")) //判断字符串是否以l结尾，不是返回false

// 8.string.slice(start [, end])
console.log(string.slice(1,6)) //划分新的字符串12345，不包括end处的值6

// 9.string.substring(start [, end])
console.log(string.substring(1,6)) //划分新的字符串12345，不包括end处的值6

// 10.string.substr(start [, length])
console.log(string.substr(1,6)) //划分新的长度为6的字符串123456，已弃用

// 11.string.trim()
let string2 = " jhg kh h "
console.log(string2.trim()) //删除字符串前后空格，不删除中间的jhg kh h

// 12.string.repeat(4)
console.log(string1.repeat(2)) //重复整个字符串两次，aBcDeFaBcDeF

// 13.string.split(str)
console.log(string2.split(" ")) //按照str划分字符串为数组[ '', 'jhg', 'kh', 'h', '' ]

// 14.string.replace(searchvalue, newvalue)/match/search
let str="Mr Blue has a blue house and a blue car";
str.replace(/blue/gi, "red");    // 全局blue换red，不区分大小写 输出结果：'Mr red has a red house and a red car'
str.replace("a", "My")  //把第一个找到的a换为My，并返回转换后的字符串
str.match("a") // 返回第一个找到a的数组，包括其位置等 ['a',index: 9,input: 'Mr Blue has a blue house and a blue car',groups: undefined]
console.log(str.search(/lu/i)) //返回第一个出现lu的位置，加了i不区分大小写

// 15.string.padStart(length, str)
'x'.padStart(5, 'ab') // 'ababx' 在字符串首部以'ab'补齐，补齐后长度为5
'x'.padEnd(5, 'ab') // 'xabab' 在字符串尾部以'ab'补齐，补齐后长度为5

// #endregion


/****************************** 数组类型 ******************************/
// #region 
// 1.改变原数组：array.push/pop/unshift/shift/splice(start [, deleNumber, ele1, ele2..])/reverse/sort/copyWithin(target, start, end)/fill(value, start, end) 
let array = [1,2,3,4,5,6,7,8,9,10]
console.log(array.push(11)) //尾部添加一个，返回添加的元素
console.log(array.pop()) //尾部移除一个，返回移除的元素
console.log(array.unshift(0)) //首部添加一个，返回添加的元素
console.log(array.shift()) //首部移除一个，返回移除的元素
console.log(array.splice(0, 0, "2", "3")) //在0处删除0个元素，添加“2”、“3”，返回删除元素组成的数组
console.log(array.reverse()) //反转数组
console.log(array.sort((a, b)=>{
    return a-b  //按升序排序
}))
console.log(array.sort((a, b)=>{
    return b-a  //按降序排序 [10, 9, 8, 7, 6, 5, 4, 3, '3', 2, '2', 1]
}))
console.log(array.copyWithin(0, 8, 10)) //将8到10（不包括10）的元素复制代替到0位置上
console.log(array.fill(0)) //全部填充为0
console.log(array.fill(1, 2, 8)) //2到8（不包括8）全部填充为1


// 2.不改变原数组，返回新数组：array.slice(start, end)/join(str)/toLocaleString/toString/concat(arr1, arr2...)
let array1 = [0,1,2,3,4,5,6,7,8,9,10]
console.log(array1.slice(2,6)) //返回新数组，从原数组start开始，不包括end，2，3，4，5
console.log(array1.join("+")) //将数组转为字符串，并用+连接 0+1+2+3+4+5+6+7+8+9+10
console.log([...array1,new Date(),{name:"hyw"}].toLocaleString()) //0,1,2,3,4,5,6,7,8,9,10,2022/10/10 22:47:31,[object Object]
console.log(array1.toString()) //0,1,2,3,4,5,6,7,8,9,10,类似于join(",")
console.log(array.concat(array1)) //组合为新数组


// 3.不改变原数组，返回位置或布尔值：array.indexOf/lastIndexOf/includes
let array2 = [1,2,3,4,5]
console.log(array2.indexOf(5)) //查找数组是否有5，有，返回位置4，没有返回-1
console.log(array2.lastIndexOf(5)) //反向查找数组是否有5，有，返回位置4，没有返回-1
console.log(array2.includes(5)) ////查找数组是否有5，有，返回true，没有返回false


// 4.不改变原数组，遍历数组：array.forEach/every/some/filter/map/reduce/reduceRight/find/findIndex/keys/values/entries
let a = [1, 2, 3]
a.forEach((value, index, arr)=>{
    if(value == 2) return
    console.log(value, index, arr)
})

let result1 = a.every((value, index, arr)=>{
    return value < 3  //判断数组元素是否满足小于3，都满足返回true，有一个不满足返回false
})
console.log("every", result1)

let result2 = a.some((value, index, arr)=>{
    return value < 3  //判断数组元素是否满足小于3，有满足返回true，都不满足返回false
})
console.log("some", result2)

let result3 = a.filter((value, index, arr)=>{
    return value > 1  //过滤每个元素，返回满足条件的新数组
})
console.log(result3)

let result4 = a.map((value, index, arr)=>{
    return value*=value //对数组元素进行处理并返回处理后的新数组
})
console.log(result4)

let result5 = a.reduce((pre, current, currIndex, arr)=>{
    console.log(pre, current)
    return current = current + pre //累加
}, 0)
console.log(result5)

let result6 = a.reduceRight((pre, current, currIndex, arr)=>{
    console.log(pre, current)
    return current = current + pre //从右累加
})
console.log(result6)

let result7 = a.find((value, index, arr)=>{
    return value < 3
})
console.log(result7) //返回第一个符合条件的元素

let result8 = a.findIndex((value, index, arr)=>{
    return value < 3
})
console.log(result8) //返回第一个符合条件的元素位置

for (let index of a.keys()){
    console.log('keys',index) 
}
for (let index of a.values()){
    console.log('values',index)
}
for (let index of a.entries()){
    console.log('entries',index)
}

// #endregion


/****************************** 数组类型 ******************************/
// #region
// 1.遍历对象：for...in/Object.keys(obj)/Object.values(obj)/Object.entries(obj)/Object.getOwnPropertyNames(obj)/Object.getOwnPropertySymbols(obj)/Reflect.ownKeys(obj)
let obj = {name:"hyw", age:28, height:180}
for (let key in obj){  //遍历对象元素的键
    console.log(obj[key])
}

console.log(Object.keys(obj)) //返回对象各元素键组成的数组[ 'name', 'age', 'height' ]
console.log(Object.values(obj)) //返回对象各元素值组成的数组[ 'hyw', 28, 180 ]
console.log(Object.entries(obj)) //返回对象各元素键值对数组组成的数组[ [ 'name', 'hyw' ], [ 'age', 28 ], [ 'height', 180 ] ]
console.log(Object.getOwnPropertyNames(obj)) //返回包含对象自身的所有属性，包括不可枚举属性[ 'name', 'age', 'height' ]
console.log(Object.getOwnPropertySymbols(obj))  //返回对象的所有symbol属性的键名[]
console.log(Reflect.ownKeys(obj)) //返回对象所有键名，包括不可枚举，symbol，不包括继承的[ 'name', 'age', 'height' ]
// #endregion


/****************************** 对象赋值与深浅拷贝 ******************************/
// #region 
// 基本类型：String、Number、Boolean、Null、Undefined、Symbol
// 引用数据类型：Object、Array、Function，正则（RegExp）和日期（Date）
// 深浅拷贝只针对引用数据类型
// 深拷贝：在堆内存里申请新的空间储存数据
// 浅拷贝：如果是基本类型，拷贝的是基本类型的值，修改对象里的基本数据类型，不改变源对象的；如果是引用类型，拷贝的是内存地址，修改会一起改变 
//        => 可理解为当对象或者数组改变的参数只有一层，则相当于深拷贝，不影响原来。
// 对象赋值：把引用数据类型赋值给新的变量，赋的是该对象在栈中的地址,所以修改新变量对象里的基本数据类型或者引用数据类型都会改变原变量

// 浅拷贝：Object.assign()/arr.slice()/arr.concat()/...arr
// 深拷贝：lodash中的cloneDeep()/jQuery中的extend()/JSON.parse(JSON.stringify(obj))
// #endregion


/****************************** 手写递归深拷贝 ******************************/
// #region 
// 判断数据类型
const checkedType = (target) => {
    //Object.prototype.toString.call(arr) ===> '[object Array]'
    //Object.prototype.toString.call(arr).slice(8,-1) ===> 'Array'
    Object.prototype.toString.call(target).replace(/\[object (\w+)\]/, "$1").toLowerCase();
}
// 实现深拷贝（obj arr）
const clone = (target) => {
    let result
    let type = checkedType(target)
    if (type === 'object') result = {}
    else if (type === 'array' ) result = []
    else return target
    for (let key in target) {
        if(checkedType(target[key]) === 'object' || checkedType(target[key]) === 'array'){
            result[key] = clone(target[key])
        }else{
            result[key] = target[key]
        }
    }
    return result
}
// 使用
const example = {
    name: 'Chen',
    detail: {
        age: '18',
        height: '180',
        bodyWeight: '68'
    },
    hobby: ['see a film',  'write the code',  'play basketball', 'tourism']
}
const example1 = clone(example); // { name: 'Chen',detail: { age: '18', height: '180', bodyWeight: '68' },  hobby: [ 'see a film', 'write the code', 'play basketball', 'tourism' ]}
console.log(example1 === obj); // false
// #endregion
