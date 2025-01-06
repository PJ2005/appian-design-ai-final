'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()  

// Predefined QA pairs with keywords
const QA_DATABASE = [
  {
    keywords: ['what', 'app', 'do', 'purpose'],
    answer: 'This app helps optimize website design by providing AI-powered suggestions for HTML and CSS improvements.'
  },
  {
    keywords: ['how', 'use', 'work'],
    answer: 'Upload your HTML/CSS files, describe desired changes, and review AI-suggested improvements. You can accept or reject each suggestion.'
  },
  {
    keywords: ['features', 'capabilities'],
    answer: 'Features include: AI design suggestions, live previews, code highlighting, responsive design testing, and easy export of improved code.'
  },
  {
    keywords: ['upload', 'file', 'format'],
    answer: 'Upload HTML files with embedded CSS. The app will analyze both structure and styling to suggest improvements.'
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Add auth state listener
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
  
    getSession()
  
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
  
    return () => {
      data?.subscription.unsubscribe()
    }
  }, [])

  const getResponse = (query: string) => {
    const words = query.toLowerCase().split(' ')
    
    // Find best matching QA pair
    let bestMatch = {
      score: 0,
      answer: "I can answer questions about the app's features, usage, and capabilities."
    }

    QA_DATABASE.forEach(qa => {
      const matchScore = qa.keywords.filter(k => 
        words.some(w => w.includes(k))
      ).length / qa.keywords.length
      
      if (matchScore > bestMatch.score) {
        bestMatch = { score: matchScore, answer: qa.answer }
      }
    })

    return bestMatch.answer
  }

  const handleQuerySubmit = () => {
    setIsLoading(true)
    const answer = getResponse(query)
    setResponse(answer)
    setIsLoading(false)
  }

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
        <div className="absolute bottom-16 left-0 bg-background border border-border p-4 rounded-lg shadow-lg w-80 h-80 flex flex-col">
          <p className="text-md text-foreground mb-2">Ask me anything about this application:</p>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
            placeholder="Type your question..."
            onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit()}
          />
          <Button 
            onClick={handleQuerySubmit}
            disabled={isLoading || !query.trim()}
            className="mb-2"
          >
            {isLoading ? 'Processing...' : 'Ask'}
          </Button>
          <div className="text-sm text-foreground mt-2 overflow-y-auto flex-1">
            {response}
          </div>
        </div>
      )}
    </div>
  )
}