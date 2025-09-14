import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AIChatbot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your AI assistant. How can I help you with your appointment booking today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const responses = {
    greeting: [
      "Hello! How can I assist you today?",
      "Hi there! What can I help you with?",
      "Welcome! I'm here to help with your booking needs."
    ],
    booking: [
      "To book an appointment, please visit our services page and select your preferred service. You can then choose a date and time that works for you.",
      "I can help you book an appointment! First, let me know which service you're interested in.",
      "Booking is easy! Just go to our services page, pick a service, and select your preferred time slot."
    ],
    services: [
      "We offer various services including haircuts, hair coloring, manicures, facial treatments, and massage therapy. Each service has different durations and prices.",
      "Our services include professional haircuts, hair coloring, nail care, facial treatments, and relaxing massages. Would you like to know more about any specific service?",
      "We have a range of beauty and wellness services. You can view all available services on our main page with detailed descriptions and pricing."
    ],
    pricing: [
      "Our service prices vary depending on the treatment. You can see detailed pricing for each service on our services page.",
      "Pricing starts from $25 for basic services and goes up based on the complexity and duration of the treatment.",
      "Each service has its own pricing. Please check our services page for the most current rates."
    ],
    cancellation: [
      "You can cancel your appointment by logging into your account and going to 'My Bookings'. From there, you can cancel any upcoming appointments.",
      "To cancel, visit your booking dashboard and click the cancel button next to your appointment. You'll receive a confirmation email.",
      "Cancellations can be done through your account dashboard or by contacting us directly."
    ],
    hours: [
      "We're open Monday to Saturday from 9 AM to 6 PM. We're closed on Sundays.",
      "Our business hours are 9:00 AM to 6:00 PM, Monday through Saturday. We're closed on Sundays.",
      "We operate Monday to Saturday, 9 AM to 6 PM. Sunday is our day off."
    ],
    contact: [
      "You can reach us at our phone number or email. You can also visit our location during business hours.",
      "For immediate assistance, please call us or visit our salon. You can also email us for non-urgent inquiries.",
      "We're available by phone, email, or in-person during our business hours. Check our contact information on the website."
    ],
    default: [
      "I'm not sure I understand. Could you please rephrase your question?",
      "I'm still learning! Could you ask me about booking, services, pricing, or our hours?",
      "I'd be happy to help! Try asking about our services, booking process, or business hours."
    ]
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (message.includes('book') || message.includes('appointment') || message.includes('schedule')) {
      return responses.booking[Math.floor(Math.random() * responses.booking.length)];
    } else if (message.includes('service') || message.includes('treatment') || message.includes('what do you offer')) {
      return responses.services[Math.floor(Math.random() * responses.services.length)];
    } else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return responses.pricing[Math.floor(Math.random() * responses.pricing.length)];
    } else if (message.includes('cancel') || message.includes('reschedule')) {
      return responses.cancellation[Math.floor(Math.random() * responses.cancellation.length)];
    } else if (message.includes('hour') || message.includes('open') || message.includes('time')) {
      return responses.hours[Math.floor(Math.random() * responses.hours.length)];
    } else if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return responses.contact[Math.floor(Math.random() * responses.contact.length)];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: getBotResponse(inputText),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
      >
        <div className="relative">
          <svg className="w-8 h-8 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md h-96 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">AI Assistant</h3>
                    <p className="text-blue-100 text-sm">Online now</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;

