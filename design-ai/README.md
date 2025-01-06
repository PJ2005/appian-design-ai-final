# AI-Powered Website Design Enhancement Tool

An advanced web application that leverages AI to optimize and enhance your website's HTML and CSS code. With intelligent suggestions, live previews, and real-time customization options, this tool simplifies website design for developers and designers.

---

## 🚀 Features

### Core Functionalities
- **AI-Powered Design Suggestions**:
  - Automatically analyzes and enhances HTML/CSS code.
  - Provides actionable improvements in aesthetics, accessibility, semantics, and responsiveness.
- **Live Preview**:
  - Real-time visualization of original and optimized designs.
  - Side-by-side comparisons for easier decision-making.
- **Interactive Changes**:
  - Accept/reject individual AI suggestions with immediate feedback.
  - Customized designs while preserving the original structure.
- **Version Control**:
  - Track and manage design changes with a secure history of revisions.
- **Categorized Suggestions**:
  - Recommendations segmented into categories like aesthetics, accessibility, semantics, and responsiveness.

### Technical Features
- **File Processing**:
  - Upload HTML/CSS files for automatic processing and optimization.
- **Real-Time Chat Support**:
  - Integrated chatbot for instant help and guidance.
- **Cloud Storage**:
  - Store original files, applied changes, and metadata securely.
- **Secure Authentication**:
  - Powered by Supabase for robust user management.
- **API-Powered Backend**:
  - FastAPI and fine-tuned LLMs for intelligent processing.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TailwindCSS, shadcn/ui
- **Backend**: FastAPI, Supabase, Codellama-7B, Ollama, Langchain
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Parsing**: BeautifulSoup4
- **AI Models**: Fine-tuned LLMs

---

## 📋 Prerequisites

- Node.js 18+ 
- npm or Yarn
- Supabase account

---

## 🚀 Getting Started

1. **Clone the Repository**:
   ```bash
   git clone [repository-url]
   cd design-ai
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment**:
   - Create a `.env.local` file with necessary credentials.
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

---

## 💡 How to Use

1. **Upload Design Files**:
   - Click the "Upload Files" button.
   - Select HTML/CSS files and provide design requirements.
2. **Review Suggestions**:
   - View AI-suggested changes categorized by accessibility, aesthetics, semantics, and responsiveness.
   - Accept or reject changes with real-time previews.
3. **Preview and Export**:
   - Save the updated design.
   - Download enhanced files or export the final code.

---

## 💻 What Happens Inside?

1. **File Input**: Upload HTML/CSS files via the frontend.
2. **Parsing**: Files are parsed using `BeautifulSoup4`.
3. **AI Suggestions**:
   - The LLM analyzes the code for accessibility, aesthetics, semantics, and responsiveness.
   - Generates actionable suggestions with scores and annotated changes.
4. **User Interaction**:
   - Changes are previewed with options to accept/reject.
   - Accepted changes are applied to the final design.
5. **Version Control**:
   - Original and updated files are stored in Supabase with revision history.

---

## 🤝 Contributing

Contributions are welcome! Submit a pull request or report issues.

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with Next.js
- Powered by Supabase
- Supported by FastAPI and fine-tuned LLMs
- UI components from shadcn/ui
