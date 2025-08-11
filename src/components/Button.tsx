import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button className={`cursor-pointer rounded-md px-4 py-2 transition-colors ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
