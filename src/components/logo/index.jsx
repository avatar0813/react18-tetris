import { useState, useEffect, memo } from 'react'
import cn from 'classnames'
import propTypes from 'prop-types'

import style from './index.module.less'
import { i18n, lan } from '../../unit/const'

const Logo = props => {
  const [state, setState] = useState({
    style: style.r1,
    display: 'none',
  })

  useEffect(() => {
    animate(props)
  }, [])

  useEffect(() => {
    if ((props.cur, props.reset)) {
      animate(props)
    }
  }, [props])

  function animate({ cur, reset }) {
    clearTimeout(Logo.timeout)
    setState({
      style: style.r1,
      display: 'none',
    })
    if (cur || reset) {
      setState({ ...state, display: 'none' })
      return
    }

    let m = 'r' // 方向
    let count = 0

    const set = (func, delay) => {
      if (!func) {
        return
      }
      Logo.timeout = setTimeout(func, delay)
    }

    const show = func => {
      // 显示
      set(() => {
        setState({
          ...state,
          display: 'block',
        })
        if (func) {
          func()
        }
      }, 150)
    }

    const hide = func => {
      // 隐藏
      set(() => {
        setState({
          ...state,
          display: 'none',
        })
        if (func) {
          func()
        }
      }, 150)
    }

    const eyes = (func, delay1, delay2) => {
      // 龙在眨眼睛
      set(() => {
        setState({ ...state, style: style[m + 2] })
        set(() => {
          setState({ ...state, style: style[m + 1] })
          if (func) {
            func()
          }
        }, delay2)
      }, delay1)
    }

    const run = func => {
      // 开始跑步啦！
      set(() => {
        setState({ ...state, style: style[m + 4] })
        set(() => {
          setState({ ...state, style: style[m + 3] })
          count++
          if (count === 10 || count === 20 || count === 30) {
            m = m === 'r' ? 'l' : 'r'
          }
          if (count < 40) {
            run(func)
            return
          }
          setState({ ...state, style: style[m + 1] })
          if (func) {
            set(func, 4000)
          }
        }, 100)
      }, 100)
    }

    const dra = () => {
      count = 0
      eyes(
        () => {
          eyes(
            () => {
              eyes(
                () => {
                  setState({ ...state, style: style[m + 2] })
                  run(dra)
                },
                150,
                150
              )
            },
            150,
            150
          )
        },
        1000,
        1500
      )
    }

    show(() => {
      // 忽隐忽现
      hide(() => {
        show(() => {
          hide(() => {
            show(() => {
              dra() // 开始运动
            })
          })
        })
      })
    })
  }
  if (props.cur) {
    return null
  }
  return (
    <div className={style.logo} style={{ display: state.display }}>
      <div className={cn({ bg: true, [style.dragon]: true, [state.style]: true })} />
      <p dangerouslySetInnerHTML={{ __html: i18n.titleCenter[lan] }} />
    </div>
  )
}

Logo.propTypes = {
  cur: propTypes.bool,
  reset: propTypes.bool.isRequired,
}
Logo.statics = {
  timeout: null,
}

export default memo(Logo, function (pre, next) {
  return pre.cur === next.cur && pre.reset === next.reset && next.cur
})

