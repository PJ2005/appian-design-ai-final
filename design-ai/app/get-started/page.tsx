'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Header from '../components/header';
import Footer from '../components/footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, X, Code, Eye } from 'lucide-react';

const supabase = createClient();

export default function GetStarted() {
  const [files, setFiles] = useState<File[]>([]);
  const [userText, setUserText] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  
  // Code viewing states
  const [originalCode, setOriginalCode] = useState('');
  const [aiCode, setAiCode] = useState('');
  const [showOriginalCode, setShowOriginalCode] = useState(true);
  const [showAICode, setShowAICode] = useState(true);
  const [preview, setPreview] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<{
    id: string;
    original: string;
    suggested: string;
    accepted: boolean;
  }[]>([]);
  const [highlightedSections, setHighlightedSections] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    fetchUser();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
      setShowAlert(false);

      if (!user) {
        console.log('No user available');
        return;
      }

      const uploadedFile = selectedFiles[0];
      if (!uploadedFile) return;

      const aiFileName = `ai-${user.id}_${uploadedFile.name}`;

      const { data: filesInBucket, error: listError } = await supabase
        .storage
        .from('uploaded-files')
        .list('');

      if (listError) {
        console.error('Error fetching files:', listError);
        return;
      }

      const aiFileInBucket = filesInBucket?.find(
        file => file.name.toLowerCase() === aiFileName.toLowerCase()
      );

      if (aiFileInBucket) {
        const { data: aiFileData, error: downloadError } = await supabase
          .storage
          .from('uploaded-files')
          .download(`${aiFileInBucket.name}`);

        if (downloadError) {
          console.error('Download error:', downloadError);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setAiCode(content);
          processAIFile(content);
        };
        reader.readAsText(aiFileData);
      }

      // Process original HTML file
      const htmlFile = selectedFiles.find(file => file.name.endsWith('.html') && !file.name.startsWith('ai-'));
      if (htmlFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setOriginalCode(content);
          setPreview(content);
        };
        reader.readAsText(htmlFile);
      }
    }
  };

  const processAIFile = (content: string) => {
    const parser = new window.DOMParser();
    const dom = parser.parseFromString(content, 'text/html');

    const suggestedElements = Array.from(dom.getElementsByClassName('ai-suggested'));
    const suggestions = suggestedElements.map((element, index) => {
      const originalHTML = element.outerHTML;
      const suggestedHTML = element.innerHTML;

      return {
        id: `suggestion-${index}`,
        original: originalHTML,
        suggested: suggestedHTML,
        accepted: false,
      };
    });

    const highlightedElements = Array.from(dom.getElementsByClassName('ai-highlight'));
    const highlights = highlightedElements.map(element => element.innerHTML);

    setAiSuggestions(suggestions);
    setHighlightedSections(highlights);
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const updatePreview = (currentSuggestions: typeof aiSuggestions) => {
    let newPreview = originalCode;
    
    currentSuggestions.forEach(suggestion => {
      if (suggestion.accepted) {
        const regex = new RegExp(escapeRegExp(suggestion.original), 'g');
        newPreview = newPreview.replace(regex, suggestion.suggested);
      }
    });

    highlightedSections.forEach(highlight => {
      const hasAcceptedSuggestions = currentSuggestions.some(s => s.accepted);
      const highlightClass = hasAcceptedSuggestions ? 'bg-green-200' : 'bg-yellow-200';
      const regex = new RegExp(`<span class="ai-highlight">${escapeRegExp(highlight)}</span>`, 'g');
      newPreview = newPreview.replace(
        regex,
        `<span class="ai-highlight ${highlightClass}">${highlight}</span>`
      );
    });

    setPreview(newPreview);
  };

  const handleSuggestion = (id: string, accepted: boolean) => {
    const updatedSuggestions = aiSuggestions.map(suggestion =>
      suggestion.id === id ? { ...suggestion, accepted } : suggestion
    );
    setAiSuggestions(updatedSuggestions);
    updatePreview(updatedSuggestions);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserText(event.target.value);
    setShowAlert(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Please log in to submit.');
      return;
    }

    if (files.length === 0 || userText.trim() === '') {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    setUploadStatus('Uploading...');

    try {
      const uploadedFiles = [];
      for (const file of files) {
        const fileName = `${user.id}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('uploaded-files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw new Error(`Error uploading ${file.name}: ${uploadError.message}`);
        uploadedFiles.push(fileName);
      }

      const { error: insertError } = await supabase
        .from('user_content')
        .insert({
          user_id: user.id,
          user_text: userText,
          file_list: uploadedFiles,
          original_file_names: files.map(f => f.name)
        });

      if (insertError) throw new Error(`Error saving content: ${insertError.message}`);
      setUploadStatus('Submission successful!');
    } catch (error) {
      console.error('Error:', error);
      setUploadStatus(error instanceof Error ? error.message : 'Error processing submission');
    }
  };

  const handleDone = async () => {
    try {
      if (!user) {
        console.error("No user available.");
        return;
      }

      const finalFile = new File([preview], `final-preview-user-${user.id}.html`, {
        type: "text/html",
      });

      const { error: uploadError } = await supabase.storage
        .from("uploaded-files")
        .upload(`final_previews/${finalFile.name}`, finalFile, { upsert: true });

      if (uploadError) {
        console.error("Error uploading final preview:", uploadError);
        return;
      }

      alert("Final preview uploaded successfully!");
    } catch (error) {
      console.error("Error in handleDone:", error);
      alert("An error occurred while uploading the final preview.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">DesignAI Enhancement</h1>

        {showAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please upload at least one file and add some text before submitting.
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".html,.css,.js,.jsx,.ts,.tsx"
                multiple
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
              >
                Upload Files
              </Button>
              {files.length > 0 && (
                <p className="mt-2">Selected files: {files.map(f => f.name).join(', ')}</p>
              )}
            </div>
            <Textarea
              placeholder="Describe your design ideas..."
              value={userText}
              onChange={handleTextChange}
              className="mb-4"
            />
            <Button onClick={handleSubmit}>Submit</Button>
            {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
          </CardContent>
        </Card>

        {originalCode && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Code View */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Original Design</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowOriginalCode(!showOriginalCode)}
                    >
                      {showOriginalCode ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="border rounded p-4 h-96">
                    {showOriginalCode ? (
                      <pre className="h-full overflow-auto"><code>{originalCode}</code></pre>
                    ) : (
                      <iframe srcDoc={originalCode} className="w-full h-full" sandbox="allow-scripts" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Code View */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">AI Enhanced Design</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAICode(!showAICode)}
                    >
                      {showAICode ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="border rounded p-4 h-96">
                    {showAICode ? (
                      <pre className="h-full overflow-auto"><code>{aiCode}</code></pre>
                    ) : (
                      <iframe srcDoc={aiCode} className="w-full h-full" sandbox="allow-scripts" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions Panel */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
                <div className="space-y-4">
                  {aiSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="border rounded p-4">
                      <pre className="bg-gray-100 p-2 mb-2 rounded text-black"><code>{suggestion.original}</code></pre>
                      <div className="bg-green-50 p-2 mb-2 rounded text-black" dangerouslySetInnerHTML={{ __html: suggestion.suggested }} />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={suggestion.accepted ? "default" : "outline"}
                          onClick={() => handleSuggestion(suggestion.id, true)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant={!suggestion.accepted ? "default" : "outline"}
                          onClick={() => handleSuggestion(suggestion.id, false)}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
                <div className="border rounded p-4 h-96">
                  <iframe srcDoc={preview} className="w-full h-full" sandbox="allow-scripts" />
                </div>
                <Button variant="default" onClick={handleDone} className="mt-4">
                  Done
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}