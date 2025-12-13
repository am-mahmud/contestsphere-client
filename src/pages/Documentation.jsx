import 'react';

export default function Documentation() {
  
  return (
    <>
    <title>Documentation</title>
      <div className="min-h-screen bg-base-100 py-12 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">How To Use ContestSphere</h1>
            <p className="text-lg ">Step-by-step guide to get started with our platform</p>
          </div>

            <div className="mt-12 rounded-lg ">
            <h2 className="text-2xl font-bold mb-6">Know Before Start</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
                <p >Create an account to begin participating in contests. Sign up with your email and set up your profile with a profile picture and bio. Once registered, you can browse all available contests and start competing.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Finding Contests</h3>
                <p >Visit the "All Contests" page to explore contests by category. Use the search bar to find specific contests. Filter by contest type (Programming, Article Writing, Retro Gaming, Business Ideas) and sort by popularity or deadline.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Joining a Contest</h3>
                <p >Select a contest and click "Join". Complete the payment using Stripe. You can use test card number 4242 4242 4242 4242 with any future expiry date and any CVC for testing. After successful payment, you will be registered.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Submitting Your Work</h3>
                <p>After joining, upload your submission through the contest page. Make sure your work meets the contest requirements and is submitted before the deadline. You can view your submission status in your dashboard.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Winning & Leaderboard</h3>
                <p>Winners are selected by contest creators. Check the leaderboard to see top performers. Your ranking is based on contest wins and participation. Visit your dashboard to track your progress and achievements.</p>
              </div>
            </div>
          </div>
          


          <div className="mt-12 rounded-lg ">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I join multiple contests?</h3>
                <p >Yes, you can join as many contests as you want. Each contest requires a separate registration and payment.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p >We accept all major credit cards and payment methods through Stripe (Visa, Mastercard, American Express, etc.)</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I withdraw from a contest?</h3>
                <p >You can withdraw before the deadline. Contact support for refund requests.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">How are winners selected?</h3>
                <p>Winners are selected by contest creators based on the contest criteria and submission quality.</p>
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
    </>
  );
}