# Website Design Improver
The Website Design Improver is an advanced web application that helps enhance and optimize your website's design by improving HTML and CSS code according to user requirements. Using AI-powered tools, the application processes your website’s code in the backend and provides an improved version with actionable changes in areas such as aesthetics, accessibility, semantics, and responsiveness.

### How to Use?
1. **Upload File:** Upload your HTML/CSS files.
2. **Receive Improved Design:** Get an improved version of your design with suggested changes.
3. **Accept/Reject Change Segments:** Review & accept/reject individual changes—your design is preserved as you customize it.
4. **Save Final Design:** Save the updated design after accepting the changes.

### Key Features
- **Improved Code Generation:** Automatically processes and enhances HTML/CSS based on user requirements.
- **Live Preview & Feedback:** Users can review each suggested change and decide whether to accept or reject it.
- **Categorized Suggestions:** Improvements are provided in key areas like accessibility, aesthetics, semantics, and responsiveness.
- **Version Control:** Manage and track design changes over time, with a full version history stored securely.

### What happens inside the API?
1. Accept a HTML/CSS file [`FastAPI`]
2. Parse the HTML/CSS file [`BeautifulSoup4`]
3. Provide the following input to a fine-tuned LLM [`Codellama-7B, Ollama, Langchain`].
    - Parsed HTML content
    - Requirement context provided by the user [`FastAPI`]
4. The fine-tuned LLM performs the following tasks [`Ollama, YAML`].
    - Validates and scores various aspects of the given HTML content (with respect to the requirements) using evaluation metrics defined in a YAML configuration file.
        
        ```yaml
        Scores = {
          Accessibility: 60%
          Aesthetics: 30%
          Semantics: 70%
          Responsiveness: 40%
          Relevance to requirement: 80%
        }
        ```
        
    - Generates concise suggestions for the defined aspects.
        
        ```yaml
        Suggestions = {
          Aesthetics: ['rounded button corners', 'darker colour palette']
          Accessibility: ['add contact page in navbar', 'improve visibility of Get Started button', 'Gallery View of Available Services']
          Semantics: ['<section> the Available Services segment']
          Responsiveness: ['Make the navbar a flex-box']
          Requirements: ['feature suggestion']
        }
        ```
        
    - Produces updated code incorporating the suggestions.
        - The changes are segmented into categories (e.g., aesthetics, accessibility, semantics, responsiveness) using `data-*` attributes.
        
        ```html
         <div 
        	 class="AI-Suggested" 
        	 data-change-type="aesthetic" data-change-name='rounded button corners'
        	 data-change-accepted="false">
        	 
        	 This is an example of an AI suggested/changed section in the 
        	 HTML Content given by the user.
        	 
         </div>
        ```
        
5. Send the annotated AI-suggested changes for user preview [`React`].
6. Allow the user to accept or reject each annotated change segment [`React`].
7. Apply the accepted changes to the final document [`FastAPI`].
8. Manage changes in the system [`Supabase`].
    - Store the original HTML, applied changes, and metadata.
    - Track changes with unique IDs for acceptance/rejection.
    - Implement a version control system for HTML revisions.
      
![image](https://github.com/user-attachments/assets/434d7b17-c84f-4f7b-b088-69b07d5f1ea0)
