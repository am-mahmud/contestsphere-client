import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <div className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-lg opacity-90">Have questions? We'd love to hear from you. Send us a message!</p>
        </div>
      </div>

    
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className=" rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <FaEnvelope className="text-3xl text-[#20beff]" />
              <h3 className="text-xl font-bold">Email</h3>
            </div>
            <p>support@contestsphere.com</p>
            <p>info@contestsphere.com</p>
          </div>

          <div className="rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <FaPhone className="text-3xl text-[#20beff]" />
              <h3 className="text-xl font-bold">Phone</h3>
            </div>
            <p >+880 1234 567890</p>
            <p >+880 1234 567890</p>
          </div>

          <div className=" rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <FaMapMarkerAlt className="text-3xl text-[#20beff]" />
              <h3 className="text-xl font-bold">Location</h3>
            </div>
            <p >Dhaka, Bangladesh</p>
            <p>Open worldwide</p>
          </div>
        </div>

        <div>
          
          <div className=" rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            
            {submitted && (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-xl mb-6 flex items-center gap-2">
                <span>✓</span> Thank you! We'll get back to you soon.
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#20beff] transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#20beff] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#20beff] transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#20beff] transition-colors resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-[#20beff] hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}