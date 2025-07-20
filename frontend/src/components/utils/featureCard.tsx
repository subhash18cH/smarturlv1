import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode,
  title: string,
  description: string
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="p-6 shadow-md rounded-lg">

      <div className="flex items-center gap-5 mb-2 ">
        <span className="text-blue-600 ">{icon}</span>
        <span className="text-xl font-semibold text-gray-900">{title}</span>
      </div>

      <p className="text-gray-600">{description}</p>

    </div>
  )
}

export default FeatureCard