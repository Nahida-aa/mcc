const arr = [1, 2, 3]
const [a1] = arr; // number

const [b1] = [1, 2, 3] // number

const [c1] = [1, 2, 3] as const  // 1

// const [d1, d2] = [1] // ts error