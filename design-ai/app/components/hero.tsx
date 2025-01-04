'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Hero() {
  const router = useRouter()

  return (
    <section className="bg-gradient-to-b from-background to-muted py-24 text-center">
      <div className="container px-4 md:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Transform Your HTML & CSS with{' '}
          <span className={cn(
            "bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent",
            "animate-gradient-x"
          )}>
            AI-Powered
          </span>{' '}
          Design Suggestions
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          Upload your files, get instant design improvements, and see the magic happen in real-time.
        </p>
        <div className="mt-10 flex justify-center">
          <Button onClick={() => router.push('/get-started')} size="lg" className=' text-xl font-bold px-32 py-8'>
            Get Started
          </Button>
        </div>
      </div>
    </section>
  )
}

