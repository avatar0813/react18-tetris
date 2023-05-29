import { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import propTypes from 'prop-types'

import style from './index.module.less'

const Pause = props => {
  const [timeout, setTime] = useState(null)
  const [showPause, setPause] = useState(false)
  const saveCallBack = useRef(null)

  useEffect(() => {
    saveCallBack.current = setShake
  })

  useEffect(() => {
    saveCallBack.current(props.data)
  }, [props])

  const setShake = bool => {
    // 根据props显示闪烁或停止闪烁
    if (bool && !timeout) {
      const time = setInterval(() => {
        setPause(n => !n)
      }, 400)
      setTime(time)
    }
    if (!bool && timeout) {
      clearInterval(timeout)
      setPause(false)
      setTime(null)
    }
  }
  return (
    <div
      className={cn({
        bg: true,
        [style.pause]: true,
        [style.c]: showPause,
      })}
    />
  )
}

Pause.propTypes = {
  data: propTypes.bool.isRequired,
}

Pause.defaultProps = {
  data: false,
}

export default Pause

