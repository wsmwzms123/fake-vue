const a = {b: 1}
let val = a['b']
Object.defineProperty(a, 'b', {
  configurable: true,
  enumerable: true,
  get () {
    return val
  },
  set (newVal) {
    if (val === newVal) return
    val = newVal
  }
})
Object.defineProperty(a, 'fn', {
  configurable: true,
  enumerable: true,
  get () {
    return this.b * 3
  },
  set () {}
})
a.b = 4
console.log(a.fn)
