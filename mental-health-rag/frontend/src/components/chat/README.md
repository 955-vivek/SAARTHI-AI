# SAARTHI AI - Mental Health Chat Application

A compassionate mental health support chatbot with AI-powered responses, mood tracking, and emergency resources.

## 🏗️ Project Structure

```
├── App.jsx                          # Main app with routing
├── components/
│   ├── ChatInterface.jsx           # Main chat interface container
│   ├── Header.jsx                  # App header with navigation
│   ├── MessageList.jsx             # Message display component
│   ├── InputArea.jsx               # Chat input component
│   ├── MoodTracker.jsx             # Mood selection interface
│   ├── ResourcesPanel.jsx          # Mental health resources
│   ├── SettingsPanel.jsx           # Settings and clear chat
│   ├── NamePromptModal.jsx         # User name input modal
│   ├── PanicButton.jsx             # Floating panic/urgent button
│   └── UrgentHelp.jsx              # Urgent help page (/urgent)
├── utils/
│   ├── constants.js                # Shared constants (moods, resources)
│   └── aiService.js                # AI API integration & crisis detection
└── README.md                       # This file
```

## ✨ Features

### Core Features
- **AI-Powered Chat**: Uses Claude Sonnet 4 for empathetic, context-aware responses
- **Mood Tracking**: Track and display current emotional state
- **Crisis Detection**: Automatic detection of crisis keywords with immediate resource display
- **Indian Context**: Culturally sensitive support with India-specific resources

### UI Components
- **Panic Button**: Floating button to quickly access urgent help resources
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Session Tracking**: Displays session duration
- **Name Personalization**: Optional user name for personalized experience

### Safety Features
- **24/7 Helplines**: Quick access to Tele-MANAS (14416), NIMHANS, iCall, and more
- **Emergency Resources**: Direct links and phone numbers for crisis support
- **Coping Strategies**: Immediate grounding techniques and breathing exercises
- **Clear Disclaimers**: Emphasizes that SAARTHI AI is support, not medical advice

## 🚀 Getting Started

### Prerequisites
- React 18+
- lucide-react for icons

### Installation

1. Copy all files maintaining the directory structure
2. Install dependencies:
```bash
npm install react lucide-react
```

3. Import the main App component:
```jsx
import App from './App';
```

### API Configuration

The app uses the Anthropic API. The API key is handled automatically in Claude.ai artifacts. For external use, you'll need to configure your API key.

## 🎨 Component Details

### App.jsx
- Main routing logic
- Switches between ChatInterface and UrgentHelp pages
- Simple state-based routing (no external router needed)

### ChatInterface.jsx
- Main container for the chat experience
- Manages all state (messages, mood, settings, etc.)
- Coordinates between all child components

### PanicButton.jsx
- Fixed position floating button (bottom-right)
- Pulsing red alert design
- Navigates to /urgent page on click
- Hover tooltip for clarity

### UrgentHelp.jsx
- Full-page urgent support resources
- Emergency contacts (112, 14416)
- All mental health helplines
- Immediate coping strategies
- Navigation back to chat

### MessageList.jsx
- Displays all messages with sender avatars
- Auto-scrolls to latest message
- Shows typing indicators
- Crisis message highlighting with embedded resources

### MoodTracker.jsx
- 6 mood options (Happy, Calm, Sad, Anxious, Angry, Tired)
- Visual emoji-based selection
- Updates conversation context

### ResourcesPanel.jsx
- Expandable panel with mental health resources
- Tele-MANAS, NIMHANS, iCall, Vandrevala Foundation
- Click-to-call and website links

## 🔧 Customization

### Adding New Moods
Edit `utils/constants.js`:
```javascript
export const moods = [
    // ... existing moods
    { emoji: "😊", label: "Excited", value: "excited", color: "from-pink-400 to-rose-500" }
];
```

### Adding New Resources
Edit `utils/constants.js`:
```javascript
export const mentalHealthResources = [
    // ... existing resources
    {
        title: "New Helpline",
        description: "Description here",
        phone: "1234567890",
        url: "https://example.com",
        icon: "🏥"
    }
];
```

### Modifying AI Behavior
Edit the `systemPrompt` in `utils/aiService.js` to change how the AI responds.

## 🎯 Usage Example

```jsx
import App from './App';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

## 🔐 Privacy & Security

- No data is stored persistently
- Conversations reset when chat is cleared
- All API calls are made client-side
- No user data is collected or logged

## ⚠️ Important Disclaimers

- SAARTHI AI provides emotional support, NOT medical advice
- Always encourage users to seek professional help for serious concerns
- Crisis detection is keyword-based and may not catch all scenarios
- Emergency number (14416) is prominently displayed throughout

## 🌐 Supported Resources (India)

1. **Tele-MANAS**: 14416 - National mental health helpline
2. **Emergency Services**: 112
3. **NIMHANS**: 080-46110007 - 24/7 support
4. **iCall**: 9152987821 - Psychosocial helpline
5. **Vandrevala Foundation**: 1860-2662-345

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 768px
- Desktop: > 768px

## 🎨 Design System

### Colors
- Primary: Amber/Orange gradient
- Accent: Red (for urgent/crisis)
- Dark Mode: Gray palette with warm amber accents

### Typography
- System fonts for optimal readability
- Responsive sizing (sm:text-base, text-sm)

## 🤝 Contributing

To extend this application:
1. Add new components in the `/components` directory
2. Add shared utilities in `/utils`
3. Update constants in `utils/constants.js`
4. Maintain the existing component structure

## 📄 License

This project is designed for mental health support and should be used responsibly with appropriate disclaimers.

## 🆘 Support

For technical issues, review the component structure and ensure all dependencies are installed correctly.

For mental health emergencies, always direct users to appropriate helplines:
- **India Emergency**: 112
- **Tele-MANAS**: 14416
