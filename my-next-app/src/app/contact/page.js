'use client';

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Shield,
  Zap,
  Users,
  HelpCircle,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Twitter,
  Github,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/contact/sendmessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Contact form submitted successfully:', JSON.stringify(data, null, 2));
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          category: 'general'
        });
      } else {
        throw new Error(data.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', JSON.stringify(error, null, 2));
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@cryptonexus.ai',
      responseTime: 'Usually responds within 24 hours'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our AI assistant',
      contact: 'Available 24/7',
      responseTime: 'Instant responses'
    },
    {
      icon: Shield,
      title: 'Security Issues',
      description: 'Report security vulnerabilities',
      contact: 'security@cryptonexus.ai',
      responseTime: 'Priority response within 4 hours'
    }
  ];

  const departments = [
    {
      icon: Users,
      title: 'Sales & Partnerships',
      email: 'sales@cryptonexus.ai',
      description: 'Business inquiries and partnerships'
    },
    {
      icon: Zap,
      title: 'Technical Support',
      email: 'tech@cryptonexus.ai',
      description: 'API, integrations, and technical issues'
    },
    {
      icon: HelpCircle,
      title: 'General Inquiries',
      email: 'info@cryptonexus.ai',
      description: 'General questions and feedback'
    }
  ];

  const faqs = [
    {
      question: "How quickly do you respond to support requests?",
      answer: "We typically respond to support emails within 24 hours during business days. For urgent security issues, we aim to respond within 4 hours. Live chat provides instant responses for common questions."
    },
    {
      question: "Do you offer phone support?",
      answer: "Currently, we provide support primarily through email and live chat. For enterprise customers, we can arrange phone consultations upon request."
    },
    {
      question: "How can I report a bug or request a feature?",
      answer: "You can report bugs or request features through our contact form by selecting 'Technical Support' as the category, or email us directly at tech@cryptonexus.ai with detailed information."
    },
    {
      question: "Is there a community forum or Discord?",
      answer: "Yes! Join our Discord community for real-time discussions with other users and our team. You can also follow us on Twitter for updates and announcements."
    },
    {
      question: "How do I report a security vulnerability?",
      answer: "Please send security-related concerns to security@cryptonexus.ai. We take security seriously and will respond to verified vulnerabilities within 4 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                CRYPTONEXUS
              </span>
            </Link>

            {/* Back to Home */}
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Get in
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Have questions about CryptoNexus? Need technical support? Want to partner with us? 
            We're here to help you succeed in the crypto market.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Preferred Contact Method</h2>
            <p className="text-gray-400">We're available through multiple channels to assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-gray-400 mb-3">{method.description}</p>
                  <p className="text-purple-400 font-medium mb-2">{method.contact}</p>
                  <p className="text-sm text-gray-500">{method.responseTime}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="partnership">Partnership</option>
                    <option value="security">Security Issue</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    placeholder="Please provide as much detail as possible..."
                  />
                </div>

                {submitStatus && (
                  <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                    submitStatus === 'success' 
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    {submitStatus === 'success' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Message sent successfully! We'll get back to you soon.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        <span>Failed to send message. Please try again or email us directly.</span>
                      </>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Other Ways to Reach Us</h2>
              
              {/* Departments */}
              <div className="space-y-4 mb-8">
                {departments.map((dept, index) => {
                  const Icon = dept.icon;
                  return (
                    <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">{dept.title}</h3>
                          <p className="text-purple-400 text-sm mb-1">{dept.email}</p>
                          <p className="text-gray-400 text-sm">{dept.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Business Hours */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <h3 className="text-white font-semibold">Business Hours</h3>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM (UTC)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM (UTC)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-3">
                    * Live chat and automated support available 24/7
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  Follow us for updates, tips, and community discussions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-900 rounded-lg border border-gray-700">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-white">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 CryptoNexus. All rights reserved. | 
            <Link href="/" className="text-purple-400 hover:text-purple-300 ml-1">
              Back to Home
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}