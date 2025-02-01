import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  tags: string[]
  image: string
  description: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, name, tags, image, description, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-gray-900 cursor-pointer mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl relative",
        className
      )}
      style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      {...props}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative p-6 pt-24">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.slice(0, 5).map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 text-xs font-semibold rounded-full px-2 py-1">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </div>
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 py-4", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight text-white", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-white opacity-80", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("py-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
