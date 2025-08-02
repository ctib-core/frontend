"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageCircle, Mail, Phone, HelpCircle, Search, Send, Clock, CheckCircle, AlertCircle, FileText, ExternalLink } from 'lucide-react'
import React from 'react'

// Mock FAQ data
const FAQ_CATEGORIES = [
  {
    id: 'trading',
    title: 'Trading',
    icon: '📈',
    faqs: [
      {
        question: 'How do I place my first trade?',
        answer: 'To place your first trade, navigate to the Trading page, select your preferred token, choose Buy or Sell, set your lot size, configure Take Profit and Stop Loss, then click the trade button.'
      },
      {
        question: 'What are the minimum lot sizes?',
        answer: 'We support Micro (0.01), Mini (0.1), and Standard (1.0) lot sizes. You can also enter custom lot sizes based on your risk tolerance.'
      },
      {
        question: 'How do I manage my positions?',
        answer: 'All your open positions are displayed on the Trading page. You can close positions manually or they will be automatically closed when Take Profit or Stop Loss levels are reached.'
      }
    ]
  },
  {
    id: 'wallet',
    title: 'Wallet',
    icon: '💳',
    faqs: [
      {
        question: 'How do I connect my wallet?',
        answer: 'Click the "Connect Wallet" button in the sidebar. We support MetaMask, WalletConnect, and other popular wallets through Particle Network integration.'
      },
      {
        question: 'Is my wallet secure?',
        answer: 'Yes, we use industry-standard security practices. We never store your private keys and all transactions are signed locally on your device.'
      },
      {
        question: 'Can I use multiple wallets?',
        answer: 'Currently, you can only connect one wallet at a time. You can disconnect and reconnect different wallets as needed.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical',
    icon: '🔧',
    faqs: [
      {
        question: 'Why are my charts not loading?',
        answer: 'Charts require a stable internet connection. If charts are not loading, try refreshing the page or check your internet connection.'
      },
      {
        question: 'How do I report a bug?',
        answer: 'You can report bugs through our support form or by emailing support@predict.com. Please include screenshots and detailed steps to reproduce the issue.'
      },
      {
        question: 'What browsers are supported?',
        answer: 'We support Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Chrome.'
      }
    ]
  }
];

const SUPPORT_CHANNELS = [
  {
    name: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: MessageCircle,
    status: 'online',
    responseTime: '< 5 minutes',
    color: 'text-green-500'
  },
  {
    name: 'Email Support',
    description: 'Send us a detailed message',
    icon: Mail,
    status: 'available',
    responseTime: '< 24 hours',
    color: 'text-blue-500'
  },
  {
    name: 'Phone Support',
    description: 'Call us for urgent issues',
    icon: Phone,
    status: 'limited',
    responseTime: '< 2 hours',
    color: 'text-purple-500'
  }
];

const Page = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('trading');
  const [expandedFaq, setExpandedFaq] = React.useState<string | null>(null);
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const filteredFaqs = FAQ_CATEGORIES.flatMap(category => 
    category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const selectedCategoryData = FAQ_CATEGORIES.find(cat => cat.id === selectedCategory);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Support</h1>
          <Button>
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Live Chat
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Support Channels */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Get Help</h3>
            <div className="space-y-4">
              {SUPPORT_CHANNELS.map((channel) => {
                const Icon = channel.icon;
                return (
                  <div key={channel.name} className="p-4 bg-background rounded-lg border border-crypto-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${channel.color}`} />
                        <div>
                          <div className="font-medium">{channel.name}</div>
                          <div className="text-sm text-muted-foreground">{channel.description}</div>
                        </div>
                      </div>
                      <Badge variant={channel.status === 'online' ? 'default' : 'secondary'}>
                        {channel.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Response time: {channel.responseTime}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Contact {channel.name}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-crypto-card border-crypto-border p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex space-x-2 mb-4">
              {FAQ_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.title}
                </Button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {selectedCategoryData?.faqs.map((faq, index) => (
                <div key={index} className="border border-crypto-border rounded-lg">
                  <button
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-crypto-card transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === `${selectedCategory}-${index}` ? null : `${selectedCategory}-${index}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{faq.question}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                      expandedFaq === `${selectedCategory}-${index}` ? 'rotate-90' : ''
                    }`} />
                  </button>
                  {expandedFaq === `${selectedCategory}-${index}` && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
          <form onSubmit={handleSubmitContact} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </form>
        </Card>

        {/* Help Resources */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Help Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg border border-crypto-border">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium">Documentation</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Complete guides and tutorials for all platform features
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Docs
              </Button>
            </div>
            <div className="p-4 bg-background rounded-lg border border-crypto-border">
              <div className="flex items-center space-x-3 mb-2">
                <HelpCircle className="w-5 h-5 text-green-500" />
                <h4 className="font-medium">Video Tutorials</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Step-by-step video guides for beginners
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch Videos
              </Button>
            </div>
            <div className="p-4 bg-background rounded-lg border border-crypto-border">
              <div className="flex items-center space-x-3 mb-2">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                <h4 className="font-medium">Community</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Join our Discord community for discussions
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join Discord
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page; 