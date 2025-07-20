import type { ReactNode } from "react"

interface FeatureListItemProps {
  icon: ReactNode,
  title: string,
  desc: string
}

const FeatureListItem = ({ icon, title, desc }: FeatureListItemProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-blue-600">{icon}</div>
      <div>
        <span className="font-medium text-gray-900">{title}</span>
        <p className="text-gray-600">{desc}</p>
      </div>
    </div>
  )
}

export default FeatureListItem