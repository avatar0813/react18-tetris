import { memo, forwardRef } from 'react'
import cn from 'classnames'
import propTypes from 'prop-types'

import style from './index.module.less'
import { transform } from '../../../unit/const'

// eslint-disable-next-line react/display-name
const Button = forwardRef((props, ref) => {
  const { active, color, size, top, left, label, position, arrow } = props
  return (
    <div className={cn({ [style.button]: true, [style[color]]: true, [style[size]]: true })} style={{ top, left }}>
      <i className={cn({ [style.active]: active })} ref={ref} />
      {size === 's1' && (
        <em
          style={{
            [transform]: `${arrow} scale(1,2)`,
          }}
        />
      )}
      <span className={cn({ [style.position]: position })}>{label}</span>
    </div>
  )
})

Button.propTypes = {
  color: propTypes.string.isRequired,
  size: propTypes.string.isRequired,
  top: propTypes.number.isRequired,
  left: propTypes.number.isRequired,
  label: propTypes.string.isRequired,
  position: propTypes.bool,
  arrow: propTypes.string,
  active: propTypes.bool.isRequired,
}

export default memo(Button, function (pre, next) {
  return pre.active === next.active
})

