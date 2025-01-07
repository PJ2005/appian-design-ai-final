import { Sparkles } from 'lucide-react'

export default function Demonstration() {
  return (
    <section id="demo" className="py-24 bg-muted">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">See It in Action</h2>
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/OvUAO3f61O4"
            title="Design AI Demonstration"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  )
}