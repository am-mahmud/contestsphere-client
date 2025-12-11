import { useState } from 'react';
import { MdEmail, MdCheckCircle, MdNewspaper, MdOutlineError } from 'react-icons/md';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
      
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-16 lg:py-20 px-4 lg:px-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MdNewspaper className="text-6xl opacity-90 animate-bounce" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Stay Updated
          </h2>
          
          <p className="text-xl opacity-90 mb-2">
            Get notified about new contests, winners, and exclusive opportunities
          </p>
          
          <p className="text-lg opacity-80">
            Join 5,000+ subscribers receiving weekly updates
          </p>
        </div>

       
        <div className=" rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200">
          <div className="space-y-4">
        
            <div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSubscribed}
                className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-[#20beff] transition-colors duration-300 text-lg"
              />
            </div>

    
            {error && (
              <div className="text-red-500 text-sm font-semibold flex items-center gap-2">
                <span><MdOutlineError /></span> {error}
              </div>
            )}

            {isSubscribed && (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-3 rounded-xl flex items-center gap-3 font-semibold">
                <MdCheckCircle className="text-2xl" />
                Successfully subscribed! Check your email for confirmation.
              </div>
            )}

          
            <button
              onClick={handleSubscribe}
              disabled={isLoading || isSubscribed}
              className="w-full bg-linear-to-r bg-gray-900 hover:bg-[#20beff] text-white border-gray-900 hover:border-[#20beff] py-3 px-6 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Subscribing...
                </span>
              ) : isSubscribed ? (
                '✓ Subscribed'
              ) : (
                'Subscribe Now'
              )}
            </button>
          </div>

       
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>

       
      </div>
    </div>
  );
}