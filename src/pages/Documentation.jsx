import { useState } from 'react';
import { FaBook, FaUsers, FaTrophy, FaPaypal, FaCheckCircle } from 'react-icons/fa';

export default function Documentation() {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 1,
      title: 'Getting Started',
      icon: <FaBook className="text-2xl text-blue-500" />,
      content: 'Create an account to begin participating in contests. Sign up with your email and set up your profile with a profile picture and bio. Once registered, you can browse all available contests and start competing.'
    },
    {
      id: 2,
      title: 'Finding Contests',
      icon: <FaUsers className="text-2xl text-green-500" />,
      content: 'Visit the "All Contests" page to explore contests by category. Use the search bar to find specific contests. Filter by contest type (Programming, Article Writing, Retro Gaming, Business Ideas) and sort by popularity or deadline.'
    },
    {
      id: 3,
      title: 'Joining a Contest',
      icon: <FaPaypal className="text-2xl text-yellow-500" />,
      content: 'Select a contest and click "Join". Complete the payment using Stripe. You can use test card number 4242 4242 4242 4242 with any future expiry date and any CVC for testing. After successful payment, you will be registered.'
    },
    {
      id: 4,
      title: 'Submitting Your Work',
      icon: <FaCheckCircle className="text-2xl text-purple-500" />,
      content: 'After joining, upload your submission through the contest page. Make sure your work meets the contest requirements and is submitted before the deadline. You can view your submission status in your dashboard.'
    },
    {
      id: 5,
      title: 'Winning & Leaderboard',
      icon: <FaTrophy className="text-2xl text-red-500" />,
      content: 'Winners are selected by contest creators. Check the leaderboard to see top performers. Your ranking is based on contest wins and participation. Visit your dashboard to track your progress and achievements.'
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">How To Use ContestSphere</h1>
          <p className="text-lg text-gray-600">Step-by-step guide to get started with our platform</p>
        </div>

     
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 transition"
              >
                <div>{section.icon}</div>
                <h2 className="text-xl font-semibold text-left flex-1">{section.title}</h2>
                <span className={`text-2xl transition ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {expandedSection === section.id && (
                <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I join multiple contests?</h3>
              <p className="text-gray-700">Yes, you can join as many contests as you want. Each contest requires a separate registration and payment.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-700">We accept all major credit cards and payment methods through Stripe (Visa, Mastercard, American Express, etc.)</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I withdraw from a contest?</h3>
              <p className="text-gray-700">You can withdraw before the deadline. Contact support for refund requests.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How are winners selected?</h3>
              <p className="text-gray-700">Winners are selected by contest creators based on the contest criteria and submission quality.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a href="/allcontests" className="btn bg-[#20beff] text-white rounded-full px-8 py-3 text-lg">
            Start Competing Now
          </a>
        </div>
      </div>
    </div>
  );
}