const arr = [1, 2, 3]
const [a1] = arr; // number | undefined

const [b1] = [1, 2, 3] // number

const [c1] = [1, 2, 3] as const  // 1

// const [d1, d2] = [1] // ts error

const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];
const a = MyArray[0]