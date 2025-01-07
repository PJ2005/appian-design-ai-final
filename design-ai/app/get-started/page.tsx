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
    originalStyles: string;
    aiStyles: string;
    accepted: boolean;
  }[]>([]);
  const [highlightedSections, setHighlightedSections] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisData = {
      "scores": {
        "aesthetics": 75,
        "accessibility": 85,
        "semantics": 90,
        "responsiveness": 80,
        "relevance_to_requirement": 85
      },
      "analysis": {
        "aesthetics": {
          "issues": [
            "Limited visual hierarchy between different sections of content",
            "Product cards lack visual distinction between different book categories",
            "Button states (hover, focus, active) could be more visually distinctive",
            "Footer content lacks proper spacing and hierarchy",
            "Search and filter sections need better visual integration with main content"
          ]
        },
        "accessibility": {
          "issues": [
            "Form inputs in filter section lack associated ARIA states",
            "Color contrast ratios need verification for all interactive elements",
            "Missing focus trap for potential modal dialogs",
            "Cart functionality lacks error announcements for screen readers",
            "Some interactive elements missing focus visible states"
          ]
        },
        "semantics": {
          "issues": [
            "Aside element could be better positioned in relation to main content",
            "Footer navigation structure could be more semantic",
            "Product grid section lacks proper region labeling",
            "Search landmark needs better semantic structure",
            "Filter controls could use more semantic grouping"
          ]
        },
        "responsiveness": {
          "issues": [
            "Limited breakpoint variety for different device sizes",
            "Filter section layout not optimized for mobile view",
            "Product grid could use more adaptive layouts",
            "Navigation menu collapse mechanism not implemented",
            "Footer content stack order needs optimization"
          ]
        },
        "relevance_to_requirement": {
          "issues": [
            "Missing advanced search functionality",
            "Limited filtering options for book categories",
            "Cart preview functionality not implemented",
            "No user account/profile features",
            "Missing book details view"
          ]
        }
      },
      "suggestions": {
        "aesthetics": [
          {
            "description": "Implement a more distinguished visual hierarchy using varied card styles for different book categories",
            "priority": "high",
            "impact": "Improved content scanability and user orientation within the interface"
          },
          {
            "description": "Add micro-interactions and transitions for interactive elements",
            "priority": "medium",
            "impact": "Enhanced user engagement and feedback for actions"
          },
          {
            "description": "Refine spacing system with more consistent vertical rhythm",
            "priority": "medium",
            "impact": "Better visual flow and content organization"
          }
        ],
        "accessibility": [
          {
            "description": "Implement ARIA live regions for dynamic content updates",
            "priority": "high",
            "impact": "Improved screen reader announcement of cart updates and search results"
          },
          {
            "description": "Add keyboard shortcuts for common actions with visible indicators",
            "priority": "medium",
            "impact": "Enhanced keyboard navigation and power user efficiency"
          },
          {
            "description": "Implement focus management system for modal dialogs and overlays",
            "priority": "high",
            "impact": "Better keyboard trap management and navigation flow"
          }
        ],
        "semantics": [
          {
            "description": "Restructure product grid using proper list semantics with article elements",
            "priority": "high",
            "impact": "Improved content structure and screen reader navigation"
          },
          {
            "description": "Implement proper heading hierarchy within product cards",
            "priority": "medium",
            "impact": "Better document outline and content organization"
          },
          {
            "description": "Add complementary landmarks for secondary content areas",
            "priority": "low",
            "impact": "Enhanced navigation between different page sections"
          }
        ],
        "responsiveness": [
          {
            "description": "Implement progressive enhancement for filter controls on mobile",
            "priority": "high",
            "impact": "Better mobile user experience for search and filtering"
          },
          {
            "description": "Add intermediate breakpoints for tablet and larger mobile devices",
            "priority": "medium",
            "impact": "More fluid responsive behavior across device sizes"
          },
          {
            "description": "Optimize touch targets and spacing for mobile interfaces",
            "priority": "high",
            "impact": "Improved mobile interaction and usability"
          }
        ],
        "relevance_to_requirement": [
          {
            "description": "Add advanced search with filters for genre, author, and price range",
            "priority": "high",
            "impact": "Enhanced product discovery and user satisfaction"
          },
          {
            "description": "Implement quick view functionality for book details",
            "priority": "medium",
            "impact": "Faster product information access without page navigation"
          },
          {
            "description": "Add wishlist functionality and social sharing features",
            "priority": "low",
            "impact": "Increased user engagement and social proof"
          }
        ]
      }
  }

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
          setOriginalCode(assignUniqueIds(content));
          setPreview(assignUniqueIds(content));
        };
        reader.readAsText(htmlFile);
      }
    }
  };

  const assignUniqueIds = (content: string) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(content, 'text/html');
    
    // Add IDs to all elements in body
    const elements = dom.body.querySelectorAll('*');
    elements.forEach((element, index) => {
      element.setAttribute('data-id', `section-${index}`);
    });
  
    // Create complete HTML document string
    const doctype = '<!DOCTYPE html>';
    const htmlContent = `
      <html>
        <head>
          ${dom.head.innerHTML}
        </head>
        <body>
          ${dom.body.innerHTML}
        </body>
      </html>
    `;
  
    return doctype + htmlContent;
  };

  // Add function to extract CSS
  const extractStyleContent = (html: string) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    const styles = dom.getElementsByTagName('style');
    const links = dom.getElementsByTagName('link');
    
    let styleContent = '';
  
    // Get inline styles
    Array.from(styles).forEach(style => {
      styleContent += style.innerHTML + '\n';
    });
  
    // Get linked stylesheets
    Array.from(links).forEach(link => {
      if (link.rel === 'stylesheet') {
        styleContent += `@import url("${link.href}");\n`;
      }
    });
  
    return styleContent;
  };
  
  const processAIFile = (content: string) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(content, 'text/html');
    
    const aiStyleContent = extractStyleContent(content);
    const originalStyleContent = extractStyleContent(originalCode);
    
    const suggestedElements = Array.from(dom.body.querySelectorAll('.ai-suggested'));
    
    const suggestions = suggestedElements.map((element, index) => {
      const originalId = element.getAttribute('data-id')?.replace('ai-', '');
      const originalElement = document.querySelector(`[data-id="section-${originalId}"]`);
  
      return {
        id: originalId || `suggestion-${index}`,
        original: originalElement?.outerHTML || '',
        suggested: element.outerHTML,
        originalStyles: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                ${originalStyleContent}
                .preview-container { padding: 1rem; }
              </style>
            </head>
            <body>
              <div class="preview-container"></div>
            </body>
          </html>
        `,
        aiStyles: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                ${aiStyleContent}
                .preview-container { padding: 1rem; }
              </style>
            </head>
            <body>
              <div class="preview-container"></div>
            </body>
          </html>
        `,
        accepted: false,
      };
    });
  
    setAiSuggestions(suggestions);
  };
  

  const updatePreview = (currentSuggestions: typeof aiSuggestions) => {
    try {
      const parser = new DOMParser();
      const previewDOM = parser.parseFromString(aiCode, 'text/html');
  
      currentSuggestions.forEach(suggestion => {
        if (suggestion.accepted) {
          const suggestedDOM = parser.parseFromString(suggestion.suggested, 'text/html');
          const suggestedElement = suggestedDOM.body.firstElementChild;
  
          if (suggestedElement) {
            const originalId = suggestion.id;
            const elementToReplace = previewDOM.querySelector(`[data-id="${originalId}"]`);
  
            if (elementToReplace) {
              elementToReplace.replaceWith(suggestedElement);
            }
          }
        }
      });
  
      // Construct complete HTML document
      const doctype = '<!DOCTYPE html>';
      const finalHTML = `
        <html>
          <head>
            ${previewDOM.head.innerHTML}
          </head>
          <body>
            ${previewDOM.body.innerHTML}
          </body>
        </html>
      `;
  
      setPreview(doctype + finalHTML);
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  };
  
  const handleSuggestion = (id: string, accepted: boolean) => {
    const updatedSuggestions = aiSuggestions.map(suggestion =>
      suggestion.id === id ? { ...suggestion, accepted } : suggestion
    );
    setAiSuggestions(updatedSuggestions);
    updatePreview(updatedSuggestions);
  };
  
  
  const escapeRegExp = (string: string) => {
    if (!string || typeof string !== 'string') return '';
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    setIsLoading(true); // Start loading
    setShowContent(false); // Hide content
    setUploadStatus('Uploading...');
  
    try {
      console.log('Design Analysis:', analysisData);
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
      setUploadStatus('Processing your design...');
  
      // Random delay between 30-40 seconds
      const delay = Math.floor(Math.random() * 11000) + 30000; 
      setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, delay);
  
    } catch (error) {
      console.error('Error:', error);
      setUploadStatus(error instanceof Error ? error.message : 'Error processing submission');
      setIsLoading(false);
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

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-lg">{uploadStatus}</p>
          </div>
        )}

        {showContent && originalCode && (
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
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Original Version */}
                      <div className="border p-2 rounded">
                        <h3 className="text-sm font-medium mb-2">Original</h3>
                        <div className="bg-white rounded p-2">
                          <iframe
                            srcDoc={`
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  ${suggestion.originalStyles}
                                </head>
                                <body>
                                  <div class="preview-container">
                                    ${suggestion.original}
                                  </div>
                                </body>
                              </html>
                            `}
                            className="w-full h-40"
                            sandbox="allow-scripts"
                          />
                        </div>
                      </div>

                      {/* AI Version */}
                      <div className="border p-2 rounded">
                        <h3 className="text-sm font-medium mb-2">AI Enhanced</h3>
                        <div className="bg-white rounded p-2">
                          <iframe
                            srcDoc={`
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  ${suggestion.aiStyles}
                                </head>
                                <body>
                                  <div class="preview-container">
                                    ${suggestion.suggested}
                                  </div>
                                </body>
                              </html>
                            `}
                            className="w-full h-40"
                            sandbox="allow-scripts"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleSuggestion(suggestion.id, true)}>
                        Accept
                      </Button>
                      <Button onClick={() => handleSuggestion(suggestion.id, false)}>
                        Reject
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