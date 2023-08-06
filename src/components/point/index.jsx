import { useState, useEffect, memo } from 'react'
import propTypes from 'prop-types'

import Number from '../number'
import { i18n, lan } from '../../unit/const'

const DF = i18n.point[lan]
const ZDF = i18n.highestScore[lan]
const SLDF = i18n.lastRound[lan]

const Point = props => {
  const [time, setTime] = useState(null)
  const [state, setState] = useState({
    label: '',
    number: 0,
  })

  useEffect(() => {
    onChange(props)
  }, [])

  const onChange = ({ cur, point, max }) => {
    clearInterval(time)
    if (cur) {
      // 在游戏进行中
      setState({
        label: point >= max ? ZDF : DF,
        number: point,
      })
    } else {
      // 游戏未开始
      const toggle = () => {
        // 最高分与上轮得分交替出现
        setState({
          label: SLDF,
          number: point,
        })
        setTime(
          setTimeout(() => {
            setState({
              label: ZDF,
              number: max,
            })
            setTime(setTimeout(toggle, 3000))
          }, 3000)
        )
      }

      if (point !== 0) {
        // 如果为上轮没玩, 也不用提示了
        toggle()
      } else {
        setState({
          label: ZDF,
          number: max,
        })
      }
    }
  }
  return (
    <div>
      <p>{state.label}</p>
      <Number number={state.number} />
    </div>
  )
}

Point.statics = {
  timeout: null,
}

Point.propTypes = {
  cur: propTypes.bool,
  max: propTypes.number.isRequired,
  point: propTypes.number.isRequired,
}

export default memo(Point, function (pre, next) {
  return pre.cur === next.cur && pre.point === next.point && pre.max === next.max && pre.cur
})

