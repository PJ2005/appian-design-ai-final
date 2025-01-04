import { Sparkles } from 'lucide-react'

export default function Demonstration() {
  return (
    <section id="demo" className="py-24 bg-muted">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">See It in Action</h2>
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl bg-background flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground">Great stuff coming soon!</p>
            <p className="text-muted-foreground mt-2">
              We're working on something amazing. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

