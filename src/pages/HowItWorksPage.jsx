import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Heart, Star, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const HowItWorksPage = () => {
  const navigate = useNavigate();

  const volunteerSteps = [
    {
      icon: UserPlus,
      title: 'Register as Volunteer',
      description: 'Sign up with your skills, interests, and location preferences.',
      details: [
        'Fill out basic information',
        'Specify your skills and expertise',
        'Choose causes you care about',
        'Upload verification documents'
      ]
    },
    {
      icon: Search,
      title: 'Browse Opportunities',
      description: 'Explore help requests that match your skills and availability.',
      details: [
        'View filtered requests',
        'Check location and urgency',
        'Read detailed descriptions',
        'See video requests when available'
      ]
    },
    {
      icon: Heart,
      title: 'Take Action',
      description: 'Connect with help seekers and provide assistance.',
      details: [
        'Contact the help seeker',
        'Coordinate meeting times',
        'Provide the needed support',
        'Document your impact'
      ]
    },
    {
      icon: Star,
      title: 'Earn Recognition',
      description: 'Build your profile with points, badges, and testimonials.',
      details: [
        'Receive points for completed help',
        'Unlock achievement badges',
        'Get testimonials from beneficiaries',
        'Climb the leaderboard'
      ]
    }
  ];

  const helpSeekerSteps = [
    {
      icon: UserPlus,
      title: 'Create Your Request',
      description: 'Submit your help request with details about what you need.',
      details: [
        'Choose appropriate category',
        'Describe your situation clearly',
        'Set urgency level',
        'Add location information'
      ]
    },
    {
      icon: Search,
      title: 'Get Matched',
      description: 'Our system connects you with suitable volunteers.',
      details: [
        'Automatic matching by skills',
        'Location-based suggestions',
        'Receive volunteer proposals',
        'Review volunteer profiles'
      ]
    },
    {
      icon: Heart,
      title: 'Receive Support',
      description: 'Work with volunteers to address your needs.',
      details: [
        'Connect with matched volunteers',
        'Schedule assistance sessions',
        'Receive the help you need',
        'Maintain communication'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Share Your Story',
      description: 'Document your journey and inspire others.',
      details: [
        'Write about your experience',
        'Rate and review volunteers',
        'Upload before/after content',
        'Inspire the community'
      ]
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              How <span className="text-orange-500">Yuva Savera</span> Works
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed mb-8"
            >
              Simple steps to make a difference - whether you're volunteering your skills 
              or seeking help from our community of changemakers.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Volunteers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
            >
              For <span className="text-blue-600">Volunteers</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Turn your passion into action with these simple steps
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {volunteerSteps.map((step, index) => (
              <Card key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <step.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="text-left text-sm text-gray-500 space-y-1">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" size="lg" onClick={() => navigate("/volunteer-registration")}>
              Start Volunteering Today
            </Button>
          </div>
        </div>
      </section>

      {/* Help Seekers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
            >
              For <span className="text-orange-500">Help Seekers</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Get the support you need from our community of volunteers
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpSeekerSteps.map((step, index) => (
              <Card key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <step.icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="text-left text-sm text-gray-500 space-y-1">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="primary" size="lg" onClick={() => navigate("/submit-help-request")}>
              Request Help Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;