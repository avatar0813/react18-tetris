const eventName = {}

const down = options => {
  // 键盘、手指按下
  const keys = Object.keys(eventName)
  keys.forEach(i => {
    clearTimeout(eventName[i])
    eventName[i] = null
  })
  if (!options.callback) {
    return
  }
  const clear = () => {
    clearTimeout(eventName[options.key])
  }
  options.callback(clear)
  if (options.once === true) {
    return
  }
  let begin = options.begin || 100
  const interval = options.interval || 50
  const loop = () => {
    eventName[options.key] = setTimeout(() => {
      begin = null
      loop()
      options.callback(clear)
    }, begin || interval)
  }
  loop()
}

const up = options => {
  // 键盘、手指松开
  clearTimeout(eventName[options.key])
  eventName[options.key] = null
  if (!options.callback) {
    return
  }
  options.callback()
}

const clearAll = () => {
  const keys = Object.keys(eventName)
  keys.forEach(i => {
    clearTimeout(eventName[i])
    eventName[i] = null
  })
}

export default {
  down,
  up,
  clearAll,
}
