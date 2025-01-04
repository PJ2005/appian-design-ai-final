import { CheckCircle } from 'lucide-react'

const features = [
  "Instant design suggestions based on your HTML and CSS",
  "Live rendering of before and after changes",
  "Highlighted code modifications for easy understanding",
  "Accept or reject suggestions with a single click",
  "Responsive design preview across multiple devices",
  "Export improved code with ease"
]

export default function Features() {
  return (
    <section id="features" className=" pb-24 pt-20 bg-muted">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
              <p className="text-base">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

