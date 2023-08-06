import { useEffect, memo, useRef } from 'react'
import Immutable from 'immutable'
import propTypes from 'prop-types'

import style from './index.module.less'
import Button from './button'
import store from '../../store'
import todo from '../../control/todo'
import { i18n, lan } from '../../unit/const'

const Keyboard = props => {
  const refMap = useRef({})
  useEffect(() => {
    const touchEventCatch = {} // 对于手机操作, 触发了touchstart, 将作出记录, 不再触发后面的mouse事件

    // 在鼠标触发mousedown时, 移除元素时可以不触发mouseup, 这里做一个兼容, 以mouseout模拟mouseup
    const mouseDownEventCatch = {}
    document.addEventListener(
      'touchstart',
      e => {
        if (e.preventDefault) {
          e.preventDefault()
        }
      },
      true
    )

    // 解决issue: https://github.com/chvin/react-tetris/issues/24
    document.addEventListener(
      'touchend',
      e => {
        if (e.preventDefault) {
          e.preventDefault()
        }
      },
      true
    )

    // 阻止双指放大
    document.addEventListener('gesturestart', e => {
      if (e.preventDefault) {
        event.preventDefault()
      }
    })

    document.addEventListener(
      'mousedown',
      e => {
        if (e.preventDefault) {
          e.preventDefault()
        }
      },
      true
    )

    Object.keys(todo).forEach(key => {
      refMap[`dom_${key}`].addEventListener(
        'mousedown',
        () => {
          if (touchEventCatch[key] === true) {
            return
          }
          todo[key].down(store)
          mouseDownEventCatch[key] = true
        },
        true
      )
      refMap[`dom_${key}`].addEventListener(
        'mouseup',
        () => {
          if (touchEventCatch[key] === true) {
            touchEventCatch[key] = false
            return
          }
          todo[key].up(store)
          mouseDownEventCatch[key] = false
        },
        true
      )
      refMap[`dom_${key}`].addEventListener(
        'mouseout',
        () => {
          if (mouseDownEventCatch[key] === true) {
            todo[key].up(store)
          }
        },
        true
      )
      refMap[`dom_${key}`].addEventListener(
        'touchstart',
        () => {
          touchEventCatch[key] = true
          todo[key].down(store)
        },
        true
      )
      refMap[`dom_${key}`].addEventListener(
        'touchend',
        () => {
          todo[key].up(store)
        },
        true
      )
    })
  }, [])
  const keyboard = props.keyboard
  return (
    <div
      className={style.keyboard}
      style={{
        marginTop: 20 + props.filling,
      }}
    >
      <Button
        color="blue"
        size="s1"
        top={0}
        left={374}
        label={i18n.rotation[lan]}
        arrow="translate(0, 63px)"
        position
        active={keyboard.get('rotate')}
        ref={c => {
          refMap.dom_rotate = c
        }}
      />
      <Button
        color="blue"
        size="s1"
        top={180}
        left={374}
        label={i18n.down[lan]}
        arrow="translate(0,-71px) rotate(180deg)"
        active={keyboard.get('down')}
        ref={c => {
          refMap.dom_down = c
        }}
      />
      <Button
        color="blue"
        size="s1"
        top={90}
        left={284}
        label={i18n.left[lan]}
        arrow="translate(60px, -12px) rotate(270deg)"
        active={keyboard.get('left')}
        ref={c => {
          refMap.dom_left = c
        }}
      />
      <Button
        color="blue"
        size="s1"
        top={90}
        left={464}
        label={i18n.right[lan]}
        arrow="translate(-60px, -12px) rotate(90deg)"
        active={keyboard.get('right')}
        ref={c => {
          refMap.dom_right = c
        }}
      />
      <Button
        color="blue"
        size="s0"
        top={100}
        left={52}
        label={`${i18n.drop[lan]} (SPACE)`}
        active={keyboard.get('drop')}
        ref={c => {
          refMap.dom_space = c
        }}
      />
      <Button
        color="red"
        size="s2"
        top={0}
        left={196}
        label={`${i18n.reset[lan]}(R)`}
        active={keyboard.get('reset')}
        ref={c => {
          refMap.dom_r = c
        }}
      />
      <Button
        color="green"
        size="s2"
        top={0}
        left={106}
        label={`${i18n.sound[lan]}(S)`}
        active={keyboard.get('music')}
        ref={c => {
          refMap.dom_s = c
        }}
      />
      <Button
        color="green"
        size="s2"
        top={0}
        left={16}
        label={`${i18n.pause[lan]}(P)`}
        active={keyboard.get('pause')}
        ref={c => {
          refMap.dom_p = c
        }}
      />
    </div>
  )
}

Keyboard.propTypes = {
  filling: propTypes.number.isRequired,
  keyboard: propTypes.object.isRequired,
}

export default memo(Keyboard, function (pre, { keyboard, filling }) {
  return Immutable.is(keyboard, pre.keyboard) && filling === pre.filling
})

