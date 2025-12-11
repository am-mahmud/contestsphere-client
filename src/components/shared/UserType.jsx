import React from 'react';
import { FaSmile, FaGraduationCap, FaDatabase } from 'react-icons/fa';
import { FiGitBranch, FiTool, FiCode } from 'react-icons/fi';
import { MdWorkspacePremium, MdDatasetLinked } from 'react-icons/md';
import creatorsImg from '../../assets/images/creators.svg'
import developersImg from '../../assets/images/developers.svg'
import researchersImg from '../../assets/images/researchers.svg'
import innovatorsImg from '../../assets/images/innovators.svg'

const UserTypesSection = () => {
    
  const userTypes = [
    {
      title: 'Creators',
      description: 'Showcase your talents in design, writing, and creative fields.',
      image: creatorsImg,  
      features: [
        { icon: <FaSmile size={20} />, text: 'Beginner-friendly contests' },
        { icon: <FaGraduationCap size={20} />, text: 'Build your portfolio' },
        { icon: <FaDatabase size={20} />, text: 'Win prizes & recognition' },
      ],
    },
    {
      title: 'Developers',
      description: 'Build projects, solve challenges, and grow your skills.',
      image: developersImg, 
      features: [
        { icon: <FiCode size={20} />, text: 'Coding competitions' },
        { icon: <FiTool size={20} />, text: 'Technical challenges' },
        { icon: <FiGitBranch size={20} />, text: 'Collaborate with peers' },
      ],
    },
    {
      title: 'Researchers',
      description: 'Advance your knowledge and compete with experts.',
      image: researchersImg,  
      features: [
        { icon: <MdWorkspacePremium size={20} />, text: 'Research competitions' },
        { icon: <MdDatasetLinked size={20} />, text: 'Access datasets' },
        { icon: <FaDatabase size={20} />, text: 'Open-source models' },
      ],
    },
    {
      title: 'Innovators',
      description: 'Transform ideas into reality through competitions.',
      image: innovatorsImg,  
      features: [
        { icon: <MdWorkspacePremium size={20} />, text: 'Innovation contests' },
        { icon: <FiTool size={20} />, text: 'Resource sharing' },
        { icon: <FaDatabase size={20} />, text: 'Community support' },
      ],
    },
  ];

  return (
    <div className='container mx-auto mb-10 px-4 lg:px-8 py-16'>
      <div className='container mx-auto'>
        <div className='mb-16'>
          <h2 className='text-4xl lg:text-5xl font-bold '>Who's on Contest Sphere?</h2>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
          {userTypes.map((user, index) => (
            <div key={index}>
  
              <div className='mb-8 h-40 flex items-center justify-center overflow-hidden'>
                <img 
                  src={user.image} 
                  alt={user.title} 
                  className='w-full h-full object-contain'
                />
              </div>

              <h3 className='text-2xl font-bold  mb-2'>{user.title}</h3>
              <p className=' text-sm mb-8'>{user.description}</p>

              <div className='mb-6'>
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4'>Key Features</p>
                <div className='space-y-4'>
                  {user.features.map((feature, idx) => (
                    <div key={idx} className='flex items-center gap-3'>
                      <span className='text-[#20beff]'>{feature.icon}</span>
                      <span className=' text-sm'>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTypesSection;