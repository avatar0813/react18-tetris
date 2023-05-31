import { memo, useState, useEffect } from 'react'
import immutable, { List } from 'immutable'
import classnames from 'classnames'
import propTypes from 'prop-types'

import style from './index.module.less'
import { isClear } from '../../unit'
import { fillLine, blankLine } from '../../unit/const'
import states from '../../control/states'

const Matrix = props => {
  const [state, setState] = useState({
    clearLines: false,
    animateColor: 2,
    isOver: false,
    overState: null,
  })

  useEffect(() => {
    const clears = isClear(props.matrix)
    const overs = props.reset
    setState({
      ...state,
      clearLines: clears,
      isOver: overs,
    })
    if (!clears && overs && !state.isOver) {
      over(props)
    }
  }, [props])

  const getResult = (props = {}) => {
    const cur = props.cur
    const shape = cur && cur.shape
    const xy = cur && cur.xy

    let matrix = props.matrix
    const clearLines = state.clearLines
    if (clearLines) {
      const animateColor = state.animateColor
      clearLines.forEach(index => {
        matrix = matrix.set(
          index,
          List([
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
          ])
        )
      })
    } else if (shape) {
      shape.forEach((m, k1) =>
        m.forEach((n, k2) => {
          if (n && xy.get(0) + k1 >= 0) {
            // 竖坐标可以为负
            let line = matrix.get(xy.get(0) + k1)
            let color
            if (line.get(xy.get(1) + k2) === 1 && !clearLines) {
              // 矩阵与方块重合
              color = 2
            } else {
              color = 1
            }
            line = line.set(xy.get(1) + k2, color)
            matrix = matrix.set(xy.get(0) + k1, line)
          }
        })
      )
    }
    return matrix
  }
  const over = nextProps => {
    let overState = getResult(nextProps)
    setState({
      ...state,
      overState,
    })

    const exLine = index => {
      if (index <= 19) {
        overState = overState.set(19 - index, List(fillLine))
      } else if (index >= 20 && index <= 39) {
        overState = overState.set(index - 20, List(blankLine))
      } else {
        states.overEnd()
        return
      }
      setState({
        ...state,
        overState,
      })
    }

    for (let i = 0; i <= 40; i++) {
      setTimeout(exLine.bind(null, i), 40 * (i + 1))
    }
  }
  let matrix
  if (state.isOver) {
    matrix = state.overState
  } else {
    matrix = getResult(props)
  }
  return (
    <div className={style.matrix}>
      {matrix.map((p, k1) => (
        <p key={k1}>
          {p.map((e, k2) => (
            <b
              className={classnames({
                c: e === 1,
                d: e === 2,
              })}
              key={k2}
            />
          ))}
        </p>
      ))}
    </div>
  )
}

Matrix.propTypes = {
  matrix: propTypes.object.isRequired,
  cur: propTypes.object,
  reset: propTypes.bool.isRequired,
}

export default memo(Matrix, (pre, next) => {
  return !(
    immutable.is(next.matrix, pre.matrix) &&
    immutable.is(next.cur && next.cur.shape, pre.cur && pre.cur.shape) &&
    immutable.is(next.cur && next.cur.xy, pre.cur && pre.cur.xy)
  )
})

