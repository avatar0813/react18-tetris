import { memo } from 'react'
import cn from 'classnames'
import propTypes from 'prop-types'

import style from './index.module.less'

const Music = props => {
  return (
    <div
      className={cn({
        bg: true,
        [style.music]: true,
        [style.c]: !props.data,
      })}
    />
  )
}

Music.propTypes = {
  data: propTypes.bool.isRequired,
}

export default memo(Music, (pre, next) => {
  return pre.data === next.data
})

