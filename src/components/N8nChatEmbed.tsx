import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

declare global {
  interface Window {
    n8nChatWidget?: any;
  }
}

const N8nChatEmbed = () => {
  useEffect(() => {
    createChat({
      webhookUrl: 'https://rooksandkings.app.n8n.cloud/webhook/13e131e5-970e-45ec-903b-9caefdb7497c/chat',
      initialMessages: [
        "Welcome! 🐾 I can help you query dog data from Asana or create adoption posts.",
        "Try asking: 'How many male dogs are in foster?' or 'Show me pit bulls under 2 years old.'",
        "To create an adoption post, just say 'please create a post about followed by the dog's name or Animal ID (e.g. A005874321)'."
      ],
      i18n: {
        en: {
          title: "Post-a-Pup Pal (DeKalb, Fulton & CAC) 🐾",
          subtitle: "Ask about dogs, get Asana data, or create adoption posts. Note: All conversations are recorded for development purposes.",
          footer: "",
          getStarted: "Start a New Conversation",
          inputPlaceholder: "Type your question about dogs or posts...",
          closeButtonTooltip: "Close chat window",
        },
      },
    });
  }, []);
  return null;
};

export default N8nChatEmbed; 