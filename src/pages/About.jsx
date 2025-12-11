import { FaLightbulb, FaHeart, FaUsers } from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';


export default function About() {
  const values = [
    {
      icon: <FiTarget className="text-3xl text-blue-500" />,
      title: 'Our Mission',
      description: 'To empower creative and technical talents worldwide by providing a platform where they can showcase their skills and earn recognition.'
    },
    {
      icon: <FaLightbulb className="text-3xl text-yellow-500" />,
      title: 'Innovation',
      description: 'We continuously improve our platform to provide the best experience for creators and participants across all contest categories.'
    },
    {
      icon: <FaHeart className="text-3xl text-red-500" />,
      title: 'Community',
      description: 'We believe in building a supportive community where talented individuals can connect, compete fairly, and grow together.'
    },
    {
      icon: <FaUsers className="text-3xl text-green-500" />,
      title: 'Accessibility',
      description: 'Our platform is open to everyone. Whether you are a beginner or an expert, ContestSphere has opportunities for you.'
    },
  ];

  const stats = [
    { number: '500+', label: 'Active Contests' },
    { number: '10K+', label: 'Community Members' },
    { number: '$1M+', label: 'Prizes Distributed' },
    { number: '50+', label: 'Countries' },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">About ContestSphere</h1>
          <p className="text-lg opacity-90">Your Gateway to Creative Excellence</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          ContestSphere was founded with a simple vision: to create a global platform where talented individuals can showcase their skills, compete with peers, and earn recognition for their work. Whether you're a programmer, writer, designer, or entrepreneur, our platform provides the opportunity to challenge yourself and win prizes.
        </p>
        <p className="text-gray-700 leading-relaxed">
          We believe that everyone deserves a fair chance to compete and showcase their talents. That's why we've built a transparent, secure, and inclusive platform trusted by thousands of creators and participants from around the world.
        </p>
      </div>

      <div className=" py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

   
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">By The Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-6 border border-gray-200 rounded-lg hover:bg-blue-50 transition">
              <div className="text-3xl font-bold text-[#20beff]">{stat.number}</div>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>


      <div className=" py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-600 mb-8">Have questions? We'd love to hear from you. Reach out to our team anytime.</p>
          <div className="space-y-3">
            <p className="text-lg"><strong>Email:</strong> support@contestsphere.com</p>
            <p className="text-lg"><strong>Address:</strong> Dhaka, Bangladesh</p>
          </div>
          <div className="mt-8">
            <a href="/" className="btn bg-[#20beff] text-white rounded-full px-8 py-3">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}