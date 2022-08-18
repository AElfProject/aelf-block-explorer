import { useEffect, useState } from 'react'
import { isPhoneCheck } from '../utils/deviceCheck'

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(isPhoneCheck())
  }, [navigator])
  return isMobile
}
