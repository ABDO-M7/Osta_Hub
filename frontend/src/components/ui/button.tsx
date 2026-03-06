import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-green-500 text-black font-semibold hover:bg-green-400 shadow-lg shadow-green-500/20 hover:shadow-green-400/30",
                destructive: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20",
                outline: "border border-[#2a2a3a] bg-transparent text-gray-300 hover:bg-[#1a1a2e] hover:text-white hover:border-green-500/50",
                secondary: "bg-[#1e1e2e] text-gray-300 hover:bg-[#2a2a3a] hover:text-white",
                ghost: "text-gray-400 hover:bg-[#1a1a2e] hover:text-white",
                link: "text-green-400 underline-offset-4 hover:underline hover:text-green-300",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-lg px-3",
                lg: "h-11 rounded-lg px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
