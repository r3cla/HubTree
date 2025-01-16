import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

let activeTooltipId: string | null = null
const tooltipIdCounter = { current: 0 }

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  onShow?: () => Promise<void> | void
}

export const Tooltip = ({
  children,
  content,
  onShow,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const tooltipId = React.useRef(`tooltip-${tooltipIdCounter.current++}`)

  const hideTooltip = () => {
    if (activeTooltipId === tooltipId.current) {
      setIsVisible(false)
      activeTooltipId = null
    }
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent click handlers
    
    // Hide any existing tooltips
    if (activeTooltipId && activeTooltipId !== tooltipId.current) {
      const event = new CustomEvent('hideAllTooltips', {
        detail: { except: tooltipId.current }
      })
      window.dispatchEvent(event)
    }
    
    setPosition({ x: e.clientX, y: e.clientY })
    
    if (onShow) {
      await onShow()
    }
    
    activeTooltipId = tooltipId.current
    setIsVisible(true)
  }

  React.useEffect(() => {
    const handleHideAll = (e: CustomEvent<{ except: string }>) => {
      if (e.detail.except !== tooltipId.current) {
        setIsVisible(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(`[data-tooltip-id="${tooltipId.current}"]`)) {
        hideTooltip()
      }
    }

    window.addEventListener('hideAllTooltips', handleHideAll as EventListener)
    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('hideAllTooltips', handleHideAll as EventListener)
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div
      data-tooltip-id={tooltipId.current}
      onClick={handleClick}
      className="relative inline-block"
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: position.x + 10,
              top: position.y + 10,
              zIndex: 50,
            }}
            className="px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div>{content}</div>
              <button 
                onClick={hideTooltip}
                className="p-1 hover:bg-gray-800 rounded-sm"
                title="Close tooltip"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}