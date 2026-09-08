import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface StaggerProps {
  children: ReactNode
  className?: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

function Stagger({ children, className }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
    >
      {children}
    </motion.div>
  )
}

export default Stagger