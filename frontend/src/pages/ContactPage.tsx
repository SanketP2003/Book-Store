import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Alert from '../components/Alert';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });

    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => {
      setFormStatus(prev => ({ ...prev, submitted: false }));
    }, 5000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="py-12 mb-12">
        <div className="text-center">
          <motion.h1
            className="page-title mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="section-subtitle max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have questions, suggestions, or just want to say hello? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h2 className="section-title mb-6">Get In Touch</h2>
            <div className="space-y-6" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-start space-x-4">
                <div className="mt-1 text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Visit Us</h3>
                  <p>123 Book Street, Reading Avenue</p>
                  <p>Bookville, BK 12345</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Call Us</h3>
                  <p>(555) 123-4567</p>
                  <p>Customer Service: (555) 765-4321</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Email Us</h3>
                  <p>info@bookstore.com</p>
                  <p>support@bookstore.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 text-accent">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Business Hours</h3>
                  <p>Monday-Friday: 9am - 8pm</p>
                  <p>Saturday-Sunday: 10am - 6pm</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h2 className="section-title mb-6">Send a Message</h2>
            {formStatus.submitted && (
              <Alert type={formStatus.success ? 'success' : 'error'} message={formStatus.message} className="mb-4" />
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">Name</label>
                <input id="name" name="name" type="text" className="form-input" placeholder="Your name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="email" className="form-label">Email</label>
                <input id="email" name="email" type="email" className="form-input" placeholder="Your email" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="subject" className="form-label">Subject</label>
                <input id="subject" name="subject" type="text" className="form-input" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="message" className="form-label">Message</label>
                <textarea id="message" name="message" className="form-input" placeholder="Type your message..." rows={5} value={formData.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2">
                <Send className="w-5 h-5" /> Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mb-16">
        <h2 className="section-title mb-6 text-center">Find Us</h2>
        <div className="rounded-lg overflow-hidden h-[400px] shadow-md" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="w-full h-full flex items-center justify-center">
            <p style={{ color: 'var(--text-muted)' }}>Interactive Map Goes Here</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16 py-10 rounded-lg px-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <h2 className="section-title mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              question: 'What are your shipping rates?',
              answer: 'We offer free shipping on orders over $35. For orders under $35, shipping is a flat rate of $4.99 within the continental US.'
            },
            {
              question: 'How can I track my order?',
              answer: "Once your order ships, you'll receive a tracking number via email. You can also view your order status in your account dashboard."
            },
            {
              question: 'Do you offer international shipping?',
              answer: 'Yes, we ship to select countries worldwide. International shipping rates vary based on destination and order weight.'
            },
            {
              question: 'What is your return policy?',
              answer: 'We accept returns within 30 days of delivery for books in original condition. Please contact our customer service team to initiate a return.'
            }
          ].map((faq, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="card p-4">
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{faq.question}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
