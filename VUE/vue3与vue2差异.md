非兼容的变更

下面列出了从 2.x 开始的非兼容的变更：

# 一、全局 API

## 1.1全局 Vue API 已更改为使用应用程序实例

从技术上讲，Vue 2 没有“app”的概念，我们定义的应用只是通过 `new Vue()` 创建的根 Vue 实例。从同一个 Vue 构造函数创建的每个根实例**共享相同的全局配置**，因此：

1. 在测试期间，全局配置很容易意外地污染其他测试用例。

2. 全局配置使得在同一页面上的多个“应用”在全局配置不同时共享同一个 Vue 副本非常困难。

   ```javascript
   // 这会影响到所有根实例
   Vue.mixin({
     /* ... */
   })
   
   const app1 = new Vue({ el: '#app-1' })
   const app2 = new Vue({ el: '#app-2' })
   ```

   **一个新的全局 API：`createApp`**

   调用 `createApp` 返回一个*应用实例*，一个 Vue 3 中的新概念。

   ```javascript
   import { createApp } from 'vue'
   
   const app = createApp({})
   ```

   如果你使用的是 Vue 的 [CDN](https://v3.cn.vuejs.org/guide/installation.html#cdn) 构建版本，那么 `createApp` 将通过全局的 `Vue` 对象暴露。

   ```js
   const { createApp } = Vue
   
   const app = createApp({})
   ```

   应用实例暴露了 Vue 2 全局 API 的一个子集，经验法则是，*任何全局改变 Vue 行为的 API 现在都会移动到应用实例上*，以下是 Vue2 全局 API 及其相应的实例 API 列表：

   | 2.x 全局 API                                                 | 3.x 实例 API (`app`)                                         |
   | ------------------------------------------------------------ | ------------------------------------------------------------ |
   | Vue.config                                                   | app.config                                                   |
   | Vue.config.productionTip                                     | 移除 （“使用生产版本”提示）                                  |
   | Vue.config.ignoredElements                                   | app.config.compilerOptions.isCustomElement ([见下方](https://v3.cn.vuejs.org/guide/migration/global-api.html#config-ignoredelements-替换为-config-iscustomelement)) |
   | Vue.component                                                | app.component                                                |
   | Vue.directive（全局指令）                                    | app.directive                                                |
   | Vue.mixin                                                    | app.mixin                                                    |
   | Vue.use（插件开发者使用 `Vue.use` 来自动安装插件是一个通用的做法 window.Vue.use(VueRouter)） | app.use（在应用实例上显式指定使用此插件const app = createApp(MyApp) ；app.use(VueRouter)） |
   | Vue.prototype                                                | app.config.globalProperties （用于添加所有组件都能访问的 property） |
   | Vue.extend（用于创建一个基于 Vue 构造函数的“子类”，其参数应为一个包含组件选项的对象） | 移除（没有组件构造器的概念了。应该始终使用 `createApp` 这个全局 API 来挂载组件） |

   所有其他不全局改变行为的全局 API 现在都是具名导出，文档见[全局 API Treeshaking](https://v3.cn.vuejs.org/guide/migration/global-api-treeshaking.html)。

   1. **Vue.config与app.config**

   2. **Vue.config.productionTip与移除**

      在 Vue 3.x 中，“使用生产版本”提示仅在使用“dev + full build”(包含运行时编译器并有警告的构建版本) 时才会显示。

      对于 ES 模块构建版本，由于它们是与打包器一起使用的，而且在大多数情况下，CLI 或脚手架已经正确地配置了生产环境，所以本提示将不再出现。

   3. **Vue.config.ignoredElements与app.config.compilerOptions.isCustomElement**

      使用方法：假如我使用了未定义的<icon></icon>组件，api里面说明的抛出Unknown custom element警告。

      使用场景：有时候我们会再引入其他第三方库的组件，但是vue会抛出错误，我们要避免这个错误，可以在Vue.config.ignoredElements配置里面配置下

      ```javascript
      // 之前
      Vue.config.ignoredElements = ['my-el', /^ion-/]
      
      // 之后，新选项接受一个函数，相比旧的字符串或正则表达式来说能提供更高的灵活性：
      const app = createApp({})
      app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
      ```

   4. **Vue.component与app.component**

      注册全局组件

      vue2：

      ```javascript
      Vue.component('button-counter', {
        data: () => ({
          count: 0
        }),
        template: '<button @click="count++">Clicked {{ count }} times.</button>'
      })
      ```

      vue3：

      ```javascript
      const app = createApp(MyApp)
      app.component('button-counter', {
        data: () => ({
          count: 0
        }),
        template: '<button @click="count++">Clicked {{ count }} times.</button>'
      })
      ```

   5. **Vue.directive与app.directive**

      自定义指令，类似于vue中的v-for v-if v-model。有时候需要对DOM进行其他操作，用自定义扩展更多的功能

      小demo  把当前元素设为绝对定位 并移动指定的top值

      directive/index.js

      ```javascript
      export default {
        install (app) {
          app.directive('top', {
            mounted (el, binding) {
              console.log(el, binding)
              el.style.position = 'absolute'
              el.style.top = binding.value + 'px'
            }
          })
        }
      }
      ```

      main.js

      ```javascript
      import directive from '@/directive/index'
      const app = createApp(App)
      app.use(directive)
      ```

       dom

      ```javascript
      <div v-top='50' style="width:100px;height:100px;background:pink"></div>
      ```

       **vue2.0和vue3.0中的区别**
      vue2.0中和vue3.0中 自定义指令的原理是一致的，只是生命周期 钩子函数不同  

      vue2中绑定的钩子函数为

      ```html
      bind - 指令绑定到元素后发生。只发生一次。
      inserted - 元素插入父 DOM 后发生。
      update - 当元素更新，但子元素尚未更新时，将调用此钩子。
      componentUpdated - 一旦组件和子级被更新，就会调用这个钩子。
      unbind - 一旦指令被移除，就会调用这个钩子。也只调用一次。
      ```

      vue3.0

      将钩子函数的命名与生命周期的钩子函数命名相一致

      ```html
      bind → beforeMount
      inserted → mounted
      beforeUpdate：新的！这是在元素本身更新之前调用的，很像组件生命周期钩子。
      componentUpdated → updated
      beforeUnmount：新的！与组件生命周期钩子类似，它将在卸载元素之前调用。
      unbind -> unmounted
      ```

   6. **Vue.mixin与app.mixin**

      组件和组件之间有时候会存在相同的代码逻辑，我们希望对`相同的代码逻辑进行抽取`

      - 一个Mixin对象可以包含`任何组件选项` --- `其本质就是一个对象`

      - 当组件使用Mixin对象时，`所有Mixin对象的选项将被 混合 进入该组件本身的选项`中

        ```vue
        mixin定义者 --- /mixins/fooMixin.js
        export default {
          data() {
            return {
              message: 'something in fooMixn'
            }
          },
        
          methods: {
            foo() {
              console.log('foo')
            }
          }
        }
        复制代码
        mixin使用者 --- App.vue
        <template>
          <div>
            <h2>{{ message }}</h2>
            <button @click="foo">click me</button>
          </div>
        </template>
        
        <script>
        import fooMixin from './mixins/fooMixin'
        
        export default {
          name: 'App',
        
          // mixin本质上是一个对象
          // 一个组件可以混入多个，所以mixins所对应的值是一个对象
          mixins: [fooMixin]
        }
        </script>
        复制代码
        ```

        **合并规则**

        1. 如果是data函数的返回值对象
           - 返回值对象默认情况下会进行合并
           - 如果data返回值对象的属性发生了冲突，那么会`保留组件自身的数据`
        2. 如何生命周期钩子函数
           - 生命周期的钩子函数会被`合并到数组`中，都会被调用
           - 先执行Mixin中对应的逻辑，在执行组件中对应生命周期钩子的逻辑
        3. 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象
           - 比如都有methods选项，并且都定义了方法，那么它们都会生效
           - 但是如果对象的`key相同`，那么会`取组件对象的键值对`

        **全局混入**

        如果组件中的某些选项，是所有的组件都需要拥有的，那么这个时候我们可以使用全局的mixin：

        - 全局的Mixin可以使用 应用app的方法 mixin 来完成注册
        - 一旦注册，那么全局混入的选项将会影响每一个组件
        - 全局混入的生命周期会优先执行 --- 因为最早被插入到数组中

        ```javascript
        import { createApp } from 'vue'
        import App from './App.vue'
        
        const app = createApp(App)
        
        app.mixin({
          created() {
            console.log('全局混入')
          }
        })
        
        app.mount('#app')
        ```

        **在vue3中，mixin是浅层次的。mixin`中也定义了一个变量`user: {  id: 1,   name: "Jack", }，vue2为user: { id: 1,name: "Jack" }，vue3为user: {id: 1}**

   7. **Vue.use与app.use**

      在 UMD 构建中，插件开发者使用 `Vue.use` 来自动安装插件是一个通用的做法。例如，官方的 `vue-router` 插件是这样在浏览器环境中自行安装的：

      ```javascript
      var inBrowser = typeof window !== 'undefined'
      /* … */
      if (inBrowser && window.Vue) {
        window.Vue.use(VueRouter)
      }
      ```

      由于 `use` 全局 API 在 Vue 3 中已无法使用，因此此方法将无法正常工作，并且调用 `Vue.use()` 现在将触发一个警告。取而代之的是，开发者必须在应用实例上显式指定使用此插件：

      ```javascript
      const app = createApp(MyApp)
      app.use(VueRouter)
      ```

   8. **Vue.prototype与app.config.globalProperties** 

      定义全局变量。

      在main.js中：
      vue2

      ```
      Vue.prototype.$verson = '1.0.0'
      ```

      使用

      ```
      this.$verson
      ```

      vue3

      ```
      Vue.config.globalProperties.$verson = '1.0.0'
      ```
      
      使用
      
      ```
        <p>姓名：{{$version}} </p>
        
        <script setup lang="ts">
        import {getCurrentInstance} from 'vue'
        console.log(getCurrentInstance().appContext.config.globalProperties.$verson)
        </script>
       
      
        **provide/inject也有类似作用**
      
        // 在入口中app.vue
        app.provide('guide', 'Vue 3 Guide')
        
        // 应用内任意组件（父级provide会覆盖祖父级的同名参数，即父组件也有'guide'，则会覆盖app.vue中的）
        export default {
          inject: {
            book: {
              from: 'guide'
            }
          },
          template: `<div>{{ book }}</div>`
        }
      ```
      
      
   
      9. **Vue.extend与移除**
   
         vue2中是通过new Vue构造器，extend则是通过创建vue构造器，并挂载到元素中，避免new vue。
   
         **基础用法**
   
         ```
         Vue.extend( options )
           参数：{Object} options
           用法：使用基础 Vue 构造器，创建一个Vue“子类”。参数是一个包含组件选项的对象；
           	   data 选项是特例，需要注意： 在 Vue.extend() 中它必须是函数；
           	   
         <div id="mount-point"></div>
         // 创建构造器
         var Profile = Vue.extend({
           template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
           data: function () {
             return {
               firstName: 'Walter',
               lastName: 'White',
               alias: 'Heisenberg'
             }
           }
         })
         // 创建 Profile 实例，并挂载到一个元素上。
         new Profile().$mount('#mount-point')
         
         // 结果如下：
         <p>Walter White aka Heisenberg</p>
         ```
   
         **继承只能继承script中的**
   
         ```
         基础组件
         <template>
           <div>
             <!--
               如果使用继承，只能继承script中的内容
               无法继承模板中的内容
             -->
             <h1>Base</h1>
           </div>
         </template>
         
         <script>
         export default {
           name: 'BaseComponent',
         
           data() {
             return {
               msg: 'base msg'
             }
           },
         
           methods: {
             foo() {
               console.log('foo')
             }
           }
         }
         </script>
         
         使用继承组件
         <template>
           <div>
             <h2>{{ msg }}</h2>
             <button @click="foo">click ms</button>
           </div>
         </template>
         
         <script>
         import BaseComponent from './BaseComponent.vue'
         
         export default {
           name: 'App',
         
           // 继承自BaseComponent, 对其进行扩展
           // 组件只能进行单继承
           extends: BaseComponent
         }
         </script>
         ```
   
         
   

## 1.2 全局和内部 API 已经被重构为支持 tree-shake

​              把无用的模块进行“剪枝”，很多没有用到的API就不会打包到最后的包里



# 二、模板指令

## 2.1 组件上 `v-model` 用法已更改，以替换 `v-bind.sync`

v-model 是语法糖，本质还是父子组件间的通信。父子组件通信时有两种方式：

1. 父给子传值：通过 props
2. 子给父传值：通过 Events up，使用 $emit 触发事件。

### **2.1.1、父组件给子组件传值**

父组件代码

```
<child  :msg="msg"  />
<script>
 export default{
  data(){
   return{
    msg:"父组件给子组件传值"
   }
  }
 }
</script>
```

子组件代码

```
<template>
 <div>{{msg}}</div>  
</template>
<script>
 export default{
  props:{
   msg:{
    type:String,
    default:""
   }
  } 
 }
</script>
复制代码
```

**props 是单向数据流，子组件只能读取，并不能修改 msg** 。对象类型可以，但不建议修改。

### **2.1.2、父子组件双向绑定**

子组件同步一个数据的时候，子组件既要使用，还要修改这个数据，以前需要通过 props Down 和 Events Up 来实现。现为了方便，提供了特殊的语法糖 v-model 。

父组件代码：

```
{{msg}}
<set-input v-model="msg" />
```

子组件 SetInput.vue 文件代码

```
<template>
 <div><input type="text" v-model="newValue"></div>
</template>
<script>
export default {
 props:{
  value:{
   type:String,
   default:''
  }
 },
 computed:{
  newValue:{
   get:function(){
    return this.value
   },
   set:function(value){
    this.$emit('input',value)
   }
  }
 }
}
</script>
```

在一个组件上，v-model 只能使用一次，如果想要对多个数据同步绑定，则可以使用.sync修饰符。

### **2.1.3、sync修饰符**

.sync 和 v-model 都是语法糖，本质还是父子组件间的通信。使用 .sync 修饰符实现父子组件多个数据双向绑定。

因为 vue2 中组件只能定义一个 v-model，如果父子需要实现多个数据双向绑定，就需要借助 .sync 修饰符。

.sync 使用原理：

```
<child-comp v-model="msg" :foo.sync="foo"  />
  
//可翻译为
<child-comp 
 :value="msg" @input="msg=$event"   
 :foo="foo" @update:foo="foo=$event"  />

/*********** 一个完整的代码示例 *************/
//父组件代码
<child-comp v-model="msg" :foo.sync="foo"  />

//子组件代码
<template>
 <div>
  <input type="text" v-model="newFoo">
  <input type="text" v-model="newValue">
 </div>
</template>
<script>
export default {
 props:{
  value:{
   type:String,
   default:''
  },
  foo:{
   type:String,
   default:""
  }
 },
 computed:{
  newValue:{
   get:function(){
    return this.value
   },
   set:function(value){
    this.$emit('input',value)
   }
  },
 newFoo:{
  get:function(){
   return this.foo
  },
  set:function(value){
   this.$emit('update:foo',value)
  }
 }
 }
}
</script>  
```

### **2.1.4、Vue3.x 使用 v-model**

vue2 中的 v-model 和 .sync 功能重叠，容易混淆，因此 vue3 做了统一，一个组件可以多次使用 v-model 。

单个数据双向绑定完整示例

```
//父组件代码
<child-comp v-model="name" />
  
子组件代码：
<template>
 <input type="text" v-model="newValue">
</template>

<script>
export default {
 props:{
  modelValue:{
   type:String,
   default:''
  }
 },
 computed:{
  newValue:{
   get:function(){
    return this.modelValue
   },
   set:function(value){
    this.$emit('update:modelValue',value)
   }
  }
 }
}
</script>
```

vue3 使用特定的 modelValue ，避免 value 的占用，通过 **update:modelValue** 实现数据双向绑定。值得注意的是，vue3 移除了 model 选项。

### **2.1.5、多个 v-model 使用**

在 vue3 一个组件可以使用多个 v-model ，统一了 vue2 的 v-model 和 .sync 修饰符。

使用原理：

```
<child-comp v-model:name="name" v-model:age="age" /> 
  
  //可翻译为
<child-comp 
  :name="name" @update:name="name=$event"
  :age="age" @update:age="age=$event" /> 
复制代码
```

实现多个数据双向绑定完整实例：

```
//父组件代码
<child-comp v-model:name="name" v-model:age="age" /> 
  
 //子组件代码
<template>
 <div>
  <input type="text" v-model="newName">
  <input type="text" v-model="newAge">
 </div>
</template>
<script>
export default {
 props:{
  name:{
   type:String,
   default:''
  },
  age:{
   type:String,
   default:""
  }
 },
 emits:['update:name','update:age'],
 computed:{
  newName:{
   get:function(){
    return this.name
   },
  set:function(value){
    this.$emit('update:name',value)
   }
 },
 newAge:{
  get:function(){
   return this.age
  },
  set:function(value){
   this.$emit('update:age',value)
  }
  }
 }
}
</script>  
```

需要注意的是 script 中多了一个 emits 选项，你发现了吗？

vue3 组件的自定义事件需要定义在 emits 选项中，只要是自定义事件，**就需要添加在 emits 中**，否则会有警告。它的优点：

1. 如果与原生事件相同名时，事件就会被触发两次，如果在 emits 选项中加入时，当作自定义事件处理，只会触发一次。
2. 更好地指示组件的工作方式。
3. 可以校验对象形式的事件。



## 2.2 在同一元素上使用的 `v-if` 和 `v-for` 优先级已更改

2.x 版本中在一个元素上同时使用 `v-if` 和 `v-for` 时，`v-for` 会优先作用。

3.x 版本中 `v-if` 总是优先于 `v-for` 生效。



## 2.3 `v-bind="object"` 现在排序敏感

**v-bind 的绑定顺序会影响渲染结果。**

在 2.x 中，如果一个元素同时定义了 `v-bind="object"` 和一个相同的独立 attribute，那么这个独立 attribute 总是会覆盖 `object` 中的绑定。

```javascript
<!-- 模板 -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- 结果 -->
<div id="red"></div>
```

在 3.x 中，如果一个元素同时定义了 `v-bind="object"` 和一个相同的独立 attribute，那么绑定的声明顺序将决定它们如何被合并。换句话说，相对于假设开发者总是希望独立 attribute 覆盖 `object` 中定义的内容，现在开发者能够对自己所希望的合并行为做更好的控制。

```javascript
<!-- 模板 -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- 结果 -->
<div id="blue"></div>

<!-- 模板 -->
<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- 结果 -->
<div id="red"></div>
```



## 2.4 `v-on:event.native` 修饰符已移除

Vue 2.x 的 .native 修饰符
在 Vue 2.x，如果想要在一个组件的根元素上直接监听一个原生事件，需要使用v-on 的 .native 修饰符。

```javascript
<base-input v-on:focus.native="onFocus"></base-input>
```

Vue 3.x 取消 .native 修饰符
.native 修饰符在 Vue 3.x 已经移除掉了。取而代之的是，在新增的 emits 选项中定义当前组件真正触发的事件（即，组件事件）。此外，Vue 现在将所有未在组件emits 选项中定义的事件作为原生事件添加到子组件的根元素中（除非子组件选项中设置了 inheritAttrs: false）。

```javascript
<my-component
  v-on:close="handleComponentEvent"
  v-on:click="handleNativeClickEvent"
/>
```

MyComponent.vue

```javascript
<template>
	<div>
		<button v-on:click="$emit('click')">click</button>
		<button v-on:click="$emit('close')">close</button>
	</div>
</template>
<script>
  export default {
    emits: ['close']
  }
</script>
```


上面代码的执行结果是：click事件会被自动添加到<div>中，所以当子组件被点击时，就会触发click事件。

若改成这样：

```javascript
<template>
	<div>
		<button v-on:click="$emit('click')">click</button>
		<button v-on:click="$emit('close')">close</button>
	</div>
</template>
<script>
  export default {
    emits: ['close', 'click']
  }
</script>
```

则click事件不会被添加给<div>。

强烈建议组件中使用的所有通过emit触发的event都在emits中声明。


## 2.5 `v-for` 中的 `ref` 不再注册 ref 数组

在 Vue 2 中，在 v-for 里使用的 ref attribute 会用 ref 数组填充相应的 $refs property。当存在嵌套的 v-for 时，这种行为会变得不明确且效率低下。
在 Vue 3 中，这样的用法将不再在 $ref 中自动创建数组。要从单个绑定获取多个 ref，请将 ref 绑定到一个更灵活的函数上 (这是一个新特性)：
一 : 在vue 2中的获取方式

```javascript
<p v-for="(item,index) in 5" :key="index" :ref="'test'"></p>
```

```javascript
mounted() {
    console.log(this.$refs);  //test：[p,p,p,p,p]
  },
```

二 : 在vue 3中的获取方式

```javascript
<p v-for="(item,index) in 5" :key="index" :ref="setItemRef"></p>
```

```javascript
import { ref, onBeforeUpdate, onUpdated } from 'vue'

export default {
  setup() {
    let itemRefs = []
    const setItemRef = el => {
      itemRefs.push(el)
    }
    onBeforeUpdate(() => {
      itemRefs = []
    })
    onUpdated(() => {
      console.log(itemRefs) //itemRef:[p,p,p,p,p]
    })
    return {
      itemRefs,
      setItemRef
    }
  }
}
```



# 三、组件

## 3.1 只能使用普通函数创建函数式组件

## 3.2 [`functional` attribute 在单文件组件 (SFC) 的<template>和functional组件选项中被废弃

**1.什么是函数式组件？**

若一个**组件只用于展示数据**，所有动态数据都从父组件传递进来（**只有props**），内部没有逻辑交互（**无methods方法、也没有mounted等任何生命周期处理函数**），没有状态修改(无data)，则推荐使用函数式组件来提升vue的性能。

**2.vue2中如何使用？**

- 在template标签上加上关键字 functional
- 使用 props. 获取父组件传递进来数据（函数也可以传入）
- 完整代码

父组件

```
<template>
  <!-- 函数式组件的使用 -->
  <Functional level="3">这是一个动态的h3元素</Functional>
</template>

<script>
export default {
  components: {
    Functional,
  }
}
</script>
```

子组件—— 函数式组件

```
// Vue 2 函数式组件示例
export default {
  functional: true,
  props: ['level'],
  render(h, { props, data, children }) {
    return h(`h${props.level}`, data, children)
  }
}
或者
<!-- Vue 2 结合 <template> 的函数式组件示例 -->
<template functional>
  <component
    :is="`h${props.level}`"
    v-bind="attrs"
    v-on="listeners"
  />
</template>

<script>
export default {
  props: ['level']
}
</script>
```

**3.vue3废除了functional**

在单文件组件上使用 `functional` 的开发者的迁移路径是删除该 attribute，并将 `props` 的所有引用重命名为 `$props`，以及将 `attrs` 重命名为 `$attrs`

子组件—— 函数式组件

```js
import { h } from 'vue'

const DynamicHeading = (props, context) => {
  return h(`h${props.level}`, context.attrs, context.slots)
}

DynamicHeading.props = ['level']

export default DynamicHeading
```



## 3.3 异步组件现在需要使用 `defineAsyncComponent` 方法来创建

**1.什么是异步组件**？

在大型应用中，需要加载的资源较多，导致加载时间过长，所以我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。

而Vue 提供的异步组件就实现了这个功能，使用 **Vue 中的工厂函数**的方式定义组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染时才会触发该工厂函数，且会把结果缓存起来供未来重渲染。

**2.vue2使用方法**

全局注册

```
    <div id="app">
        <div-counter>
        </div-counter>
    </div>
    <script>
        Vue.component('DivCounter', function(resolve, reject) {
            setTimeout(function() {
                // 向 `resolve` 回调传递组件定义
                resolve({
                    template: '<div>我是一个全局注册的异步组件</div>'
                });
            }, 1000)

        });
        let vm = new Vue({
            el: "#app",
        });
    </script>
```

这种方式是通过全局注册创建的组件，在没有调用时是不会解析的，只有在调用之后才会解析。**工厂函数有两个回调——resolve和reject，resolve会在你从服务器得到组件定义的时候被调用，reject会在加载失败的时候被调用**

局部注册

```
 <div id="app">
        <div-counter2>
        </div-counter2>
    </div>
    <script>
        let vm = new Vue({
            el: "#app",
            components: {
                'div-counter2': function(resolve, reject) {
                    //延时演示
                    setTimeout(function() {
                        resolve({
                            template: '<div>我是一个局部注册的异步组件</div>'
                        })
                    }, 1000);
                }
            }
        });
    </script>
```

**局部注册和全局注册没有很大区别，只是注册的位置不同，使用的范围大小差异。**

使用vue自带的工厂函数注册组件

        <div id="app">
            <div-counter>
            </div-counter>
        </div>
        <script>
            Vue.component('DivCounter', () => ({
                // 需要加载的组件 (应该是一个 `Promise` 对象)
                component: new Promise((reslove) => {
                    setTimeout(function() {
                        reslove({
                            template: '<div>我是一个全局注册的异步组件</div>'
                        })
                    }, 2000);
                }),
                // 异步组件加载时使用的组件
                loading: {
                    template: '<div>我是异步组件加载时使用的组件</div>'
                },
                // 加载失败时使用的组件
                error: {
                    template: '<div>我是加载失败时使用的组件</div>'
                },
                // 展示加载时组件的延时时间。默认值是 2000 (毫秒)
                delay: 2000,
                // 如果提供了超时时间且组件加载也超时了，
                // 则使用加载失败时使用的组件。默认值是：`Infinity`
                timeout: 3000
            }));
            let vm = new Vue({
                el: "#app",
    
            });
        </script>
异步组件还有一种使用方式：

```
Vue.component(
  'async-webpack-example',
  // 这个动态导入会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
//或者
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包，这些包
  // 会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})
```

这种使用方式是将一个组件在调用的时候转化为异步调用，组件本身还是普通组件。这种方式多用于 Vue Router 中，如路由懒加载就是异步组件的使用。如：

以前，异步组件是通过将组件定义为返回 Promise 的函数来创建的，例如：

```js
const asyncModal = () => import('./Modal.vue'）
```

或者，对于带有选项的更高阶的组件语法：

```js
const asyncModal = {
  component: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
}
```

**3.vue3使用方法**

现在，在 Vue 3 中，由于函数式组件被定义为纯函数，因此异步组件需要通过将其包裹在新的 `defineAsyncComponent` 助手方法中来显式地定义：

1、Vue3 提供了 `defineAsyncComponent` 方法与 `Suspense` 内置组件，我们可以用它们来做一个优雅的异步组件加载方案。

2、 异步组件高级声明方法中的 `component` 选项更名为`loader`；

2、`loader`绑定的组件加载函数不再接收`resolve`和`reject`参数，而且必须返回一个`Promise`；

```js
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './components/ErrorComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'

// 不带选项的异步组件
const asyncModal = defineAsyncComponent(() => import('./Modal.vue'))

// 带选项的异步组件
const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```



## 3.4 组件事件现在需要在 `emits` 选项中声明

**1.什么是emits？**

Vue 3 现在提供一个 `emits` 选项，和现有的 `props` 选项类似。这个选项可以**用来定义一个组件可以向其父组件触发的事件**。

**2.vue2中无法定义**

在 Vue 2 中，你可以定义一个组件可接收的 prop，但是你无法声明它可以触发哪些事件：

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text']
  }
</script>
```

在2.x时代，我们是通过 **event.$emit 和 event.$on, event.$off**去在父子组件、兄弟组件中去传递事件

**3.vue3中定义组件事件**

和 prop 类似，现在可以通过 `emits` 选项来定义组件可触发的事件：

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text'],
    emits: ['accepted']
  }
</script>
```

该选项也可以接收一个对象，该对象允许开发者定义传入事件参数的验证器，和 `props` 定义里的验证器类似。



# 四、渲染函数

## 4.1 渲染函数 API 更改

**1.什么是渲染函数？**

Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用**渲染函数**，它比模板更接近编译器。

让我们深入一个简单的例子，这个例子里 `render` 函数很实用。假设我们要生成一些带锚点的标题：

```html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

锚点标题的使用非常频繁，我们应该创建一个组件：

```vue-html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

当开始写一个只能通过 `level` prop 动态生成标题 (heading) 的组件时，我们很快就可以得出这样的结论：

```js
const { createApp } = Vue

const app = createApp({})

app.component('anchored-heading', {
  template: `
    <h1 v-if="level === 1">
      <slot></slot>
    </h1>
    <h2 v-else-if="level === 2">
      <slot></slot>
    </h2>
    <h3 v-else-if="level === 3">
      <slot></slot>
    </h3>
    <h4 v-else-if="level === 4">
      <slot></slot>
    </h4>
    <h5 v-else-if="level === 5">
      <slot></slot>
    </h5>
    <h6 v-else-if="level === 6">
      <slot></slot>
    </h6>
  `,
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

这个模板感觉不太好。它不仅冗长，而且我们为每个级别标题重复书写了 `<slot></slot>`。当我们添加锚元素时，我们必须在每个 `v-if/v-else-if` 分支中再次重复它。

虽然模板在大多数组件中都非常好用，但是显然在这里它就不合适了。那么，我们来尝试使用 `render` 函数重写上面的例子：

```js
const { createApp, h } = Vue

const app = createApp({})

app.component('anchored-heading', {
  render() {
    return h(
      'h' + this.level, // 标签名
      {}, // prop 或 attribute
      this.$slots.default() // 包含其子节点的数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

`render()` 函数的实现要精简得多，但是需要非常熟悉组件的实例 property。在这个例子中，你需要知道，向组件中传递不带 `v-slot` 指令的子节点时，比如 `anchored-heading` 中的 `Hello world!` ，这些子节点被存储在组件实例中的 `$slots.default` 中。

**2.vue2中的渲染函数**

在 2.x 中，`render` 函数会自动接收 **`h` 函数 (它是 `createElement` 的惯用别名)** 作为参数：

```js
// Vue 2 渲染函数示例
export default {
  render(h) {
    return h('div')
  }
}
```

**3.vue3中的渲染函数**

在 3.x 中，`h` 函数现在是全局导入的，而不是作为参数自动传递。

```js
// Vue 3 渲染函数示例
import { h } from 'vue'

export default {
  render() {
    return h('div')
  }
}
```

```js
import { h, reactive } from 'vue'

export default {
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0
    })

    function increment() {
      state.count++
    }

    // 返回渲染函数，可以访问在作用域中声明的响应式状态和函数，以及传递给 setup() 的参数
    return () =>
      h(
        'div',
        {
          onClick: increment
        },
        state.count
      )
  }
}
```

此外，注册组件后，用组件名进行渲染方式也有所不同：

```js
// 2.x
Vue.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      Clicked {{ count }} times.
    </button>
  `
})

export default {
  render(h) {
    return h('button-counter')
  }
}

// 3.x
import { h, resolveComponent } from 'vue'

export default {
  setup() {
    const ButtonCounter = resolveComponent('button-counter')
    return () => h(ButtonCounter)
  }
}
```

## 4.2 `$scopedSlots` property 已移除，所有插槽都通过 `$slots` 作为函数暴露

此更改统一了 3.x 中的普通插槽和作用域插槽。

以下是变化的变更总结：

- `this.$slots` 现在将插槽作为函数公开

- **非兼容**：移除 `this.$scopedSlots`

  

## 4.3 `$listeners` 被移除或整合到 `$attrs`

可以通过 `this.$attrs` 访问传递给组件的 attribute

如果这个组件接收一个 `id` attribute 和一个 `v-on:close` 监听器，那么 `$attrs` 对象现在将如下所示:

```js
{
  id: 'my-input',
  onClose: () => console.log('close 事件被触发')
}
```



## 4.4 `$attrs` 现在包含 `class` 和 `style` attribute

`$attrs` 现在包含了*所有*传递给组件的 attribute，包括 `class` 和 `style`。

Vue 2 的虚拟 DOM 实现对 `class` 和 `style` attribute 有一些特殊处理。因此，与其它所有 attribute 不一样，它们*没有*被包含在 `$attrs` 中。

上述行为在使用 `inheritAttrs: false` 时会产生副作用：

- `$attrs` 中的 attribute 将不再被自动添加到根元素中，而是由开发者决定在哪添加。
- 但是 `class` 和 `style` 不属于 `$attrs`，它们仍然会被应用到组件的根元素中：

```vue
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>
```

像这样使用时：

```html
<my-component id="my-id" class="my-class"></my-component>
```

……将生成以下 HTML：

```html
<label class="my-class">
  <input type="text" id="my-id" />
</label>
```

在vue3中

`$attrs` 包含了*所有的* attribute，这使得把它们全部应用到另一个元素上变得更加容易了。现在上面的示例将生成以下 HTML：

```html
<label>
  <input type="text" id="my-id" class="my-class" />
</label>
```



# 五、自定义元素

## 5.1 自定义元素检测现在在模板编译时执行

- **非兼容**：检测并确定哪些标签应该被视为自定义元素的过程，现在会在模板编译期间执行，且应该通过编译器选项而不是运行时配置来配置。

  在 Vue 2.x 中，通过 `Vue.config.ignoredElements` 将标签配置为自定义元素

  **在 Vue 3.0 中，此检查在模板编译期间执行**。要指示编译器将 `<plastic-button>` 视为自定义元素：

  - 如果使用构建步骤：给 Vue 模板编译器传入 `isCustomElement` 选项。如果使用了 `vue-loader`，则应通过 `vue-loader` 的 `compilerOptions` 选项传递：

    ```js
    // webpack 中的配置
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
        options: {
          compilerOptions: {
            isCustomElement: tag => tag === 'plastic-button'
          }
        }
      }
      // ...
    ]
    ```

  - 如果使用动态模板编译，请通过 `app.config.compilerOptions.isCustomElement` 传递：

    ```js
    const app = Vue.createApp({})
    app.config.compilerOptions.isCustomElement = tag => tag === 'plastic-button'
    ```

- **非兼容**：特殊的 `is` attribute 的使用被严格限制在保留的 `<component>` 标签中。

  自定义元素规范提供了一种将自定义元素作为[自定义内置元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)的方法，方法是向内置元素添加 `is` attribute：

  ```vue
  <button is="plastic-button">点击我!</button>
  ```

- **新增**：为了支持 2.x 在原生元素上使用 `is` 的用例来处理原生 HTML 解析限制，我们用 `vue:` 前缀来解析一个 Vue 组件

  





# 六、其他小改变

- `destroyed` 生命周期选项被重命名为 `unmounted`

  

- `beforeDestroy` 生命周期选项被重命名为 `beforeUnmount`

  

- `default` prop 工厂函数不再可以访问 `this` 上下

  生成 prop 默认值的工厂函数不再能访问 `this`。

  取而代之的是：

  - 组件接收到的原始 prop 将作为参数传递给默认函数；
  - [inject](https://v3.cn.vuejs.org/guide/composition-api-provide-inject.html) API 可以在默认函数中使用。

  ```js
  import { inject } from 'vue'
  
  export default {
    props: {
      theme: {
        default (props) {
          // `props` 是传递给组件的、
          // 在任何类型/默认强制转换之前的原始值，
          // 也可以使用 `inject` 来访问注入的 property
          return inject('theme', 'default-theme')
        }
      }
    }
  }
  ```

- 自定义指令的 API 已更改为与组件生命周期一致，且 `binding.expression` 已移除（见1.1）

- `data` 选项应始终被声明为一个函数，不能声明为对象了

- 来自 mixin 的 `data` 选项现在为浅合并（见1.1）

- [Attribute 强制策略已更改](https://v3.cn.vuejs.org/guide/migration/attribute-coercion.html)

- [一些过渡的 class 被重命名](https://v3.cn.vuejs.org/guide/migration/transition.html)

- [`` 不再默认渲染包裹元素](https://v3.cn.vuejs.org/guide/migration/transition-group.html)

- 当侦听一个数组时，只有当数组被替换时，回调才会触发，如果需要在变更时触发，则必须指定 `deep` 选项

  当使用 [`watch` 选项](https://v3.cn.vuejs.org/api/options-data.html#watch)侦听数组时，只有在数组被替换时才会触发回调。换句话说，在数组被改变时侦听回调将不再被触发。要想在数组被改变时触发侦听回调，必须指定 `deep` 选项。

  ```js
  watch: {
    bookList: {
      handler(val, oldVal) {
        console.log('book list changed')
      },
      deep: true
    },
  }
  ```

- 没有特殊指令的标记 (`v-if/else-if/else`、`v-for` 或 `v-slot`) 的 `<template>` 现在被视为普通元素，并将渲染为原生的 `<template>` 元素，而不是渲染其内部内容。

- 已挂载的应用不会取代它所挂载的元素

- 在 Vue 2 中，`keyCodes` 可以作为修改 `v-on` 方法的一种方式。

  ```html
  <!-- 键码版本 -->
  <input v-on:keyup.13="submit" />
  
  <!-- 别名版本 -->
  <input v-on:keyup.enter="submit" />
  ```

  此外，也可以通过全局的 `config.keyCodes` 选项定义自己的别名。

  ```js
  Vue.config.keyCodes = {
    f1: 112
  }
  ```

  ```html
  <!-- 键码版本 -->
  <input v-on:keyup.112="showHelpText" />
  
  <!-- 自定义别名版本 -->
  <input v-on:keyup.f1="showHelpText" />
  ```

  从 [`KeyboardEvent.keyCode` 已被废弃](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/keyCode)开始，Vue 3 继续支持这一点就不再有意义了。因此，现在建议对任何要用作修饰符的键使用 kebab-cased (短横线) 名称。

  ```html
  <!-- Vue 3 在 v-on 上使用按键修饰符 -->
  <input v-on:keyup.page-down="nextPage">
  
  <!-- 同时匹配 q 和 Q -->
  <input v-on:keypress.q="quit">
  ```

  因此，这意味着 `config.keyCodes` 现在也已弃用，不再受支持。

- [生命周期的 `hook:` 事件前缀改为 `vnode-`](https://v3.cn.vuejs.org/guide/migration/vnode-lifecycle-events.html)

  

# 七、被移除的 API

- `keyCode` 作为 `v-on` 修饰符的支持

- $on、$off 和 $once 实例方法

  我们从实例中完全移除了 `$on`、`$off` 和 `$once` 方法。`$emit` 仍然包含于现有的 API 中，因为它用于触发由父组件声明式添加的事件处理函数。

- 过滤器 (filter)

  在 3.x 中，过滤器已移除，且不再支持。取而代之的是，我们建议用方法调用或计算属性来替换它们。

  以上面的案例为例，以下是一种实现方式。

- [内联模板 attribute](https://v3.cn.vuejs.org/guide/migration/inline-template-attribute.html)

- [`$children` 实例 property](https://v3.cn.vuejs.org/guide/migration/children.html)

- [`propsData` 选项](https://v3.cn.vuejs.org/guide/migration/props-data.html)

- `$destroy` 实例方法。用户不应再手动管理单个 Vue 组件的生命周期。

- 全局函数 `set` 和 `delete` 以及实例方法 `$set` 和 `$delete`。基于代理的变化检测已经不再需要它们了。