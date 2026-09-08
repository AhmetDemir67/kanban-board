import { useEffect } from 'react'

function Toast({ message, type, onExpire }) {
  // 2 saniye sonra otomatik olarak onExpire'ı çağırıp toast'ın kapanmasını sağlar
  useEffect(() => {
    const timer = setTimeout(onExpire, 2000)
    return () => clearTimeout(timer)
  }, [onExpire])

  // Türe göre ekstra bir class ekler; ne "error" ne "warning" ise "success" stiline düşer
  const className =
    type === 'error' ? 'toast toast-error' : type === 'warning' ? 'toast toast-warning' : 'toast toast-success'

  return <div className={className}>{message}</div>
}

export default Toast
