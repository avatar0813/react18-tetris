import { useState, useEffect } from 'react'
import cn from 'classnames'
import propTypes from 'prop-types'

import style from './index.module.less'

const render = data => (
  <div className={style.number}>
    {data.map((e, k) => (
      <span className={cn(['bg', style[`s_${e}`]])} key={k} />
    ))}
  </div>
)

const formate = num => (num < 10 ? `0${num}`.split('') : `${num}`.split(''))

const Number = props => {
  const [state, setState] = useState({
    time_count: false,
    time: new Date(),
  })

  useEffect(() => {
    if (!props.time) {
      return
    }
    const clock = () => {
      const count = +Number.timeInterval
      Number.timeInterval = setTimeout(() => {
        setState({
          time: new Date(),
          time_count: count, // 用来做 shouldComponentUpdate 优化
        })
        clock()
      }, 1000)
    }
    clock()
    return () => {
      clearTimeout(Number.timeInterval)
    }
  }, [])

  if (props.time) {
    // 右下角时钟
    const now = state.time
    const hour = formate(now.getHours())
    const min = formate(now.getMinutes())
    const sec = now.getSeconds() % 2
    const t = hour.concat(sec ? 'd' : 'd_c', min)
    return render(t)
  }

  const num = `${props.number}`.split('')
  for (let i = 0, len = props.length - num.length; i < len; i++) {
    num.unshift('n')
  }
  return render(num)
}

Number.statics = {
  timeInterval: null,
  time_count: null,
}

Number.propTypes = {
  number: propTypes.number,
  length: propTypes.number,
  time: propTypes.bool,
}

Number.defaultProps = {
  length: 6,
}

export default Number

