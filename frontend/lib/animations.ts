import { type Variants, type Transition } from "framer-motion"

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

export const springStiff: Transition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
}

export const springGentle: Transition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
}

export const springBouncy: Transition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 10,
}

export const pulseSpring: Transition = {
  type: "spring" as const,
  stiffness: 80,
  damping: 10,
  repeat: Infinity,
}
