import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Vote, Scale, FileText, Play, ExternalLink } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const PoliticalAwarenessPage = () => {
  const topics = [
    {
      icon: Vote,
      title: 'Voting Rights & Process',
      description: 'Understanding your fundamental right to vote and how elections work in India',
      articles: 12,
      videos: 8,
      url: 'https://www.eci.gov.in/faq'
    },
    {
      icon: Scale,
      title: 'Constitutional Rights',
      description: 'Know your fundamental rights and duties as outlined in the Indian Constitution',
      articles: 15,
      videos: 6,
      url: 'https://doj.gov.in/'
    },
    {
      icon: Users,
      title: 'Civic Participation',
      description: 'Ways to actively participate in democratic processes beyond voting',
      articles: 10,
      videos: 12,
      url: 'https://nss.gov.in/' 
    },
    {
      icon: FileText,
      title: 'Government Schemes',
      description: 'Understanding government policies and schemes that affect youth',
      articles: 18,
      videos: 9,
      url: 'https://www.india.gov.in/topics/youth-sports'
    }
  ];

  const featuredArticles = [
    {
      title: 'Understanding RTI: Your Right to Information',
      summary: 'A comprehensive guide to filing RTI applications and transparency in governance',
      readTime: '8 min read',
      category: 'Transparency',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://rtionline.gov.in/guidelines.php'
    },
    {
      title: 'Local Elections and Why They Matter',
      summary: 'How panchayat and municipal elections directly impact your daily life',
      readTime: '6 min read',
      category: 'Governance',
      image: 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://en.wikipedia.org/wiki/Local_elections_in_India'
    },
    {
      title: 'Youth in Politics: Making Your Voice Heard',
      summary: 'Inspiring stories of young leaders creating change in Indian politics',
      readTime: '10 min read',
      category: 'Leadership',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://tijer.org/tijer/papers/TIJER2312032.pdf'
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Political <span className="text-blue-600">Awareness</span> Zone
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Empowering Indian youth with knowledge about civic rights, democratic processes,
              and active citizenship. Because informed citizens build stronger democracies.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Key Topics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
            >
              Explore Key Topics
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Comprehensive resources on civic education and political awareness
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <Card key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <topic.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{topic.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {topic.articles} articles
                    </span>
      
                  </div>
                  <a href={topic.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full">
                      Explore Topic
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
            >
              Featured Articles
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              In-depth articles on current political topics and civic education
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <Card key={index} delay={index * 0.1}>
                <div className="relative mb-4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{article.readTime}</span>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" icon={ExternalLink}>
                      Read Article
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Infographics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Interactive Infographics</h2>
                <p className="text-lg text-gray-600">
                  Visual guides to understanding India's political system and processes
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
                  <div className="w-full h-40 bg-white bg-opacity-50 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Scale className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-blue-800">How Laws Are Made</p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Legislative Process</h4>
                  <p className="text-sm text-gray-600">Interactive flowchart showing how bills become laws in Indian Parliament</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg text-center">
                  <div className="w-full h-40 bg-white bg-opacity-50 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Vote className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-orange-800">Election Process</p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Electoral System</h4>
                  <p className="text-sm text-gray-600">Visual guide to India's election process from nomination to result declaration</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
                  <div className="w-full h-40 bg-white bg-opacity-50 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-green-800">Government Structure</p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Three Pillars of Democracy</h4>
                  <p className="text-sm text-gray-600">Understanding the Executive, Legislative, and Judicial branches</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PoliticalAwarenessPage;