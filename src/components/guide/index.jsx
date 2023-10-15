import { useState, useEffect, memo } from 'react'
import QRCode from 'qrcode'
import style from './index.module.less'
import { transform } from '../../unit/const'
import { isMobile } from '../../unit'

const Guide = () => {
  const [state, setState] = useState({
    isMobile: isMobile(),
    QRCode: '',
  })
  useEffect(() => {
    if (state.isMobile) {
      return
    }
    QRCode.toDataURL(location.href, { margin: 1 }).then(dataUrl => setState({ QRCode: dataUrl }))
  }, [])
  if (state.isMobile) {
    return null
  }
  return (
    <div style={{ display: state.isMobile ? 'none' : 'block' }}>
      <div className={`${style.guide} ${style.right}`}>
        <div className={style.up}>
          <em style={{ [transform]: 'translate(0,-3px) scale(1,2)' }} />
        </div>
        <div className={style.left}>
          <em style={{ [transform]: 'translate(-7px,3px) rotate(-90deg) scale(1,2)' }} />
        </div>
        <div className={style.down}>
          <em style={{ [transform]: 'translate(0,9px) rotate(180deg) scale(1,2)' }} />
        </div>
        <div className={style.right}>
          <em style={{ [transform]: 'translate(7px,3px)rotate(90deg) scale(1,2)' }} />
        </div>
      </div>
    </div>
  )
}

export default memo(Guide)

