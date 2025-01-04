'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Header from '../components/header'
import Footer from '../components/footer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

const supabase = createClient()

export default function GetStarted() {
  const [files, setFiles] = useState<File[]>([])
  const [userText, setUserText] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [livePreview, setLivePreview] = useState('')
  const [user, setUser] = useState<any>(null)
  const [showAlert, setShowAlert] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user ?? null)
    }
    fetchUser()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files))
    }
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserText(event.target.value)
  }

  // const handleSubmit = async () => {
  //   if (!user) {
  //     alert('Please log in to submit.')
  //     return
  //   }

  //   if (files.length === 0 || userText.trim() === '') {
  //     setShowAlert(true)
  //     return
  //   }

  //   setShowAlert(false)
  //   setUploadStatus('Uploading...')

  //   for (const file of files) {
  //     const fileName = `${user.id}_${file.name}`
  //     const { error } = await supabase.storage
  //       .from('uploaded-files')
  //       .upload(fileName, file)

  //     if (error) {
  //       console.error('Error uploading file:', error)
  //       setUploadStatus(`Error uploading ${file.name}`)
  //       return
  //     }
  //   }

  //   try {
  //     await supabase.from('user_content').insert({
  //       user_id: user.id,
  //       user_text: userText,
  //       file_list: files.map(f => `${user.id}_${f.name}`),
  //       original_file_names: files.map(f => f.name),
  //     })

  //     setUploadStatus('Submission successful!')
  //     updateLivePreview()
  //   } catch (error) {
  //     console.error('Error submitting data:', error)
  //     setUploadStatus('Error submitting data')
  //   }
  // }

  const handleSubmit = async () => {
    if (!user) {
      alert('Please log in to submit.')
      return
    }
  
    if (files.length === 0 || userText.trim() === '') {
      setShowAlert(true)
      return
    }
  
    setShowAlert(false)
    setUploadStatus('Uploading...')
  
    try {
      // Upload files
      const uploadedFiles = []
      for (const file of files) {
        const fileName = `${user.id}_${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('uploaded-files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })
  
        if (uploadError) {
          throw new Error(`Error uploading ${file.name}: ${uploadError.message}`)
        }
        uploadedFiles.push(fileName)
      }
  
      // Save content reference
      const { error: insertError } = await supabase
        .from('user_content')
        .insert([{
          user_id: user.id,
          user_text: userText,
          file_list: uploadedFiles,
          original_file_names: files.map(f => f.name)
        }])
        .single()
  
      if (insertError) {
        console.error('Insert Error:', insertError)
        throw new Error(`Error saving content: ${insertError.message}`)
      }
  
      setUploadStatus('Submission successful!')
      updateLivePreview()
  
    } catch (error) {
      console.error('Error:', error)
      setUploadStatus(error instanceof Error ? error.message : 'Error processing submission')
    }
  }

  const updateLivePreview = () => {
    // This is a placeholder for the actual live preview functionality
    // In a real implementation, you would process the files and generate HTML here
    const previewHTML = `
      <html>
        <body>
          <h1>Live Preview</h1>
          <p>User text: ${userText}</p>
          <p>Uploaded files: ${files.map(f => f.name).join(', ')}</p>
        </body>
      </html>
    `
    setLivePreview(previewHTML)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-24 px-10">
        <h1 className="text-4xl font-bold mb-8">Get Started with DesignAI</h1>
        {user && showAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please upload at least one file and add some text before submitting.
            </AlertDescription>
          </Alert>
        )}
        <Card className="p-6">
          <CardContent>
            <div className="mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".html,.css,.js,.jsx,.ts,.tsx"
                multiple
                className="hidden"
              />
              <Button onClick={() => {
                fileInputRef.current?.click()
                setShowAlert(false)
              }}>
                Upload Files
              </Button>
              {files.length > 0 && (
                <p className="mt-2">Selected files: {files.map(f => f.name).join(', ')}</p>
              )}
            </div>
            <Textarea
              placeholder="Describe your design ideas..."
              value={userText}
              onChange={(e) => {
                handleTextChange(e)
                setShowAlert(false)
              }}
              className="mb-4"
            />
            <Button onClick={handleSubmit}>Submit</Button>
            {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
          </CardContent>
        </Card>
        <Card className="mt-8 p-6">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
            <div className="border p-4 rounded">
              <iframe
                srcDoc={livePreview}
                title="Live Preview"
                className="w-full h-64 border-0"
                sandbox="allow-scripts"
              />
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

