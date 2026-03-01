# form

- input: 有多种类型
- textarea: 多行文本输入框
- select: 下拉选择框, n 选 1, 默认必选, 变种多
- checkbox: 多选框, 用于n选m, n>=m, n为1 时: 可以当作 bool .  
  
- radio: 单选框, n 选 1, 默认必选 
- switch: 开关, bool

## component

### Checkbox
原生 `<input type="checkbox">` 在现代 UI 开发中确实很少直接裸用，尤其在复杂多选场景下。UI 库（如 shadcn/ui、MUI、Ant Design）底层常用 `<button>` 或 `<div role="checkbox">` 模拟，就是为了自定义便利

### RadioGroup
RadioGroup 的名字正是因为它是一组 Radio Buttons（单选按钮）的集合——“Radio” 来自无线电按钮的比喻（像老式收音机，只能调到一个频道），
而 “Group” 表示这些按钮被分组管理，确保它们**互斥（选一个，其他自动取消）**。
这在 UI 设计中是标准术语，源自早期的 HTML `<input type="radio">` 规范（W3C），现在广泛用于 React/Vue 等框架的组件库（如 shadcn/ui、MUI）。

### other

#### label 
Label 的设计主要是为了语义化和无障碍访问 (a11y)，让点击标签等同于点击控件本身（提升 UX），但事件处理仍需在控件上绑定

label 可以通过 id 间接触发控件的激活事件（如 focus 或 click）

关联方式：`<label for="myId">标签</label>` 与 `<input id="myId">` 绑定。点击 label 会：
- 自动焦点到 input（focus 事件）。
- 如果 input 是 checkbox/radio，点击 label 会 toggle 选中（change 事件）。