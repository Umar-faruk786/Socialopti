import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`card ${hover ? 'card-hover' : ''} p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
