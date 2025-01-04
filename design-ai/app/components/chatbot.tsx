'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-background border border-border p-4 rounded-lg shadow-lg w-64 h-36 flex items-center justify-center">
          <p className="text-md text-foreground">
            We are developing it to make the experience of this website better
          </p>
        </div>
      )}
    </div>
  )
}

