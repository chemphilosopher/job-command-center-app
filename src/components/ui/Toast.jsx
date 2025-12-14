import { useEffect } from 'react'

/**
 * Toast notification component
 * Auto-dismisses after 3 seconds
 */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`}>
      {message}
    </div>
  )
}

export default Toast
