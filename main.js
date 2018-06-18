class Vue {
  constructor (options) {
    if (!(this instanceof Vue)) return new Vue(options)
    const vm = this
    vm.data = options.data
    this.$proxy()
    this.$walk(vm.data)
    if (options.el) {
      vm.$mount(options.el)
    }
  }

  $mount (el) {
    this.$el = document.querySelector(el)
    this.$compile(this.$el)
    return this
  }

  $proxy () {
    const vm = this
    Object.keys(vm.data).forEach(key => {
      Object.defineProperty(vm, key, {
        configurable: false,
        enumerable: true,
        get: () => vm.data[key],
        set (newVal) {
          vm.data[key] = newVal
        }
      })
    })
  }

  $walk (data) {
    for (const prop in data) {
      const value = data[prop]
      if (typeof value !== 'object') {
        this.$walk(value)
      }
      this.$defineReactive(data, prop, value)
    }
  }

  $defineReactive (data, prop, value) {
    const dep = new Dep()
    Object.defineProperty(data, prop, {
      configurable: false,
      enumerable: true,
      get () {
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        Dep.target = null
        return value
      },
      set (newVal) {
        if (newVal === value) return
        value = newVal
        dep.update(newVal)
      }
    })
  }

  $compile (data) {
    const REG = /\{\{(.*)\}\}/
    const vm = this
    Array.from(this.$el.childNodes).forEach(function (node) {
      const type = node.nodeType
      const ifMatched = REG.test(node.data)
      if (ifMatched) {
        const matched = RegExp.$1.trim()
        if (type === 3) {
          Dep.target = node
          node.data = vm[matched]
        }

        if (type === 1) {
          this.$compile(node)
        }
      }
    })
  }
}

class Dep {
  constructor () {
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  update (value) {
    this.subs.forEach(sub => {
      const type = sub.nodeType
      if (type === 1 || type === 3) {
        sub[type === 1 ? 'textContent' : 'data'] = value
      }
    })
  }
}
