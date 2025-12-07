import React from 'react';
import { FaSmile, FaGraduationCap, FaDatabase } from 'react-icons/fa';
import { FiGitBranch, FiTool, FiCode } from 'react-icons/fi';
import { MdWorkspacePremium, MdDatasetLinked } from 'react-icons/md';

const UserTypesSection = () => {
  const userTypes = [
    {
      title: 'Creators',
      description: 'Showcase your talents in design, writing, and creative fields.',
      image: '[Image placeholder]',
      features: [
        { icon: <FaSmile size={20} />, text: 'Beginner-friendly contests' },
        { icon: <FaGraduationCap size={20} />, text: 'Build your portfolio' },
        { icon: <FaDatabase size={20} />, text: 'Win prizes & recognition' },
      ],
    },
    {
      title: 'Developers',
      description: 'Build projects, solve challenges, and grow your skills.',
      image: '[Image placeholder]',
      features: [
        { icon: <FiCode size={20} />, text: 'Coding competitions' },
        { icon: <FiTool size={20} />, text: 'Technical challenges' },
        { icon: <FiGitBranch size={20} />, text: 'Collaborate with peers' },
      ],
    },
    {
      title: 'Researchers',
      description: 'Advance your knowledge and compete with experts.',
      image: '[Image placeholder]',
      features: [
        { icon: <MdWorkspacePremium size={20} />, text: 'Research competitions' },
        { icon: <MdDatasetLinked size={20} />, text: 'Access datasets' },
        { icon: <FaDatabase size={20} />, text: 'Open-source models' },
      ],
    },
    {
      title: 'Innovators',
      description: 'Transform ideas into reality through competitions.',
      image: '[Image placeholder]',
      features: [
        { icon: <MdWorkspacePremium size={20} />, text: 'Innovation contests' },
        { icon: <FiTool size={20} />, text: 'Resource sharing' },
        { icon: <FaDatabase size={20} />, text: 'Community support' },
      ],
    },
  ];

  return (
    <div className='bg-white py-16 px-4 lg:px-8'>
      <div className='container mx-auto'>
        {/* Header */}
        <div className='mb-16'>
          <h2 className='text-4xl lg:text-5xl font-bold text-gray-900'>Who's on Contest Sphere?</h2>
        </div>

        {/* User Types Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
          {userTypes.map((user, index) => (
            <div key={index}>
              {/* Image Placeholder */}
              <div className='mb-8 h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300'>
                <span className='text-gray-500 font-semibold'>{user.image}</span>
              </div>

              {/* Title & Description */}
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>{user.title}</h3>
              <p className='text-gray-600 text-sm mb-8'>{user.description}</p>

              {/* Key Features */}
              <div className='mb-6'>
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4'>Key Features</p>
                <div className='space-y-4'>
                  {user.features.map((feature, idx) => (
                    <div key={idx} className='flex items-center gap-3'>
                      <span className='text-[#20beff]'>{feature.icon}</span>
                      <span className='text-gray-700 text-sm'>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See Less Button */}
        {/* <div className='mt-16'>
          <button className='px-6 py-2 border-2 border-gray-800 text-gray-800 font-semibold rounded-full hover:bg-gray-800 hover:text-white transition-colors'>
            See less
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default UserTypesSection;