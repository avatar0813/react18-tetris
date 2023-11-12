import { useState, useEffect, memo } from 'react'
import  immutable, { List } from 'immutable'
import classnames from 'classnames'
import propTypes from 'prop-types'

import style from './index.module.less'
import { isClear } from '../../unit'
import { fillLine, blankLine } from '../../unit/const'
import states from '../../control/states'

const t = setTimeout


const Matrix = (props) => {

  const [state, setState] = useState({
    clearLines: false,
    animateColor: 2,
    isOver: false,
    overState: null,
  })

  const [matrix, setMatrix] = useState(props.matrix || null)


  useEffect(() => {
    const clears = isClear(props.matrix)
    const overs = props.reset
    setState((info) => {
      return {
        ...info,
        clearLines: clears,
        isOver: overs,
      }
    })
    // 清除动画
    if (clears && !state.clearLines) {
      clearAnimate(clears)
    }
    if (!clears && overs && !state.isOver) {
      matrixOver(props)
    }
  }, [props])


  // 修改 matrix
  const matrixOver = (curProps) => {
    const cur = curProps.cur
    const shape = cur && cur.shape
    const xy = cur && cur.xy

    let tempMatrix = curProps.matrix
    const clearLines = state.clearLines
    if (clearLines) {
      const animateColor = state.animateColor
      clearLines.forEach(index => {
        tempMatrix = tempMatrix.set(
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
            let line = tempMatrix.get(xy.get(0) + k1)
            let color
            if (line.get(xy.get(1) + k2) === 1 && !clearLines) {
              // 矩阵与方块重合
              color = 2
            } else {
              color = 1
            }
            line = line.set(xy.get(1) + k2, color)
            tempMatrix = tempMatrix.set(xy.get(0) + k1, line)
          }
        })
      )
    }
    setMatrix(() => tempMatrix)
    let overState = tempMatrix
    setState(info => {
      return {
        ...info,
        overState,
      }
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
      setState( info =>{
        return {
          ...info,
          overState,
        }
      })
    }

    for (let i = 0; i <= 40; i++) {
      t(exLine.bind(null, i), 40 * (i + 1))
    }
  }

  // 清空动画
  const clearAnimate = () => {
    const anima = callback => {
      t(() => {
        setState((info) => {
          return {
            ...info,
            animateColor: 0,
          }
        })
        t(() => {
          setState( info => {
            return {
              ...info,
              animateColor: 2,
            }
          })
          if (typeof callback === 'function') {
            callback()
          }
        }, 100)
      }, 100)
    }
    anima(() => {
      anima(() => {
        anima(() => {
          t(() => {
            states.clearLines(props.matrix, state.clearLines)
          }, 100)
        })
      })
    })
  }

  return (
    <div className={style.matrix}>
        {(state.isOver ? state.overState : matrix).map((p, k1) => (
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

const Component = memo(Matrix, (prev, cur) => {
  return !(
    immutable.is(cur.matrix, prev.matrix) &&
    immutable.is(cur.cur && cur.cur.shape, prev.cur && prev.cur.shape) &&
    immutable.is(cur.cur && cur.cur.xy, prev.cur && prev.cur.xy)
  ) || isClear(cur.matrix) || cur.reset
})
export default Component