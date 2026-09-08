import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

function MotionButton({
  children,
  className = '',
  onClick,
  type = 'button',
}: MotionButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      whileHover={{
        y: -2,
      }}
      whileTap={{
        scale: 0.97,
      }}
      transition={{
        duration: 0.18,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.button>
  )
}

export default MotionButton