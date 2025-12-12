import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Heart, MapPin, Calendar } from 'lucide-react';
import Card from '../components/UI/Card';
import StatsCard from '../components/UI/StatsCard';

const ImpactDashboardPage = () => {
  const impactStats = {
    totalVolunteers: 12847,
    activeRequests: 234,
    requestsResolved: 8934,
    livesImpacted: 50000,
    totalCampaigns: 156,
    partnersJoined: 89
  };

  const monthlyData = [
    { month: 'Jan', volunteers: 1200, requests: 890, impact: 4200 },
    { month: 'Feb', volunteers: 1450, requests: 1100, impact: 5100 },
    { month: 'Mar', volunteers: 1600, requests: 1250, impact: 5800 },
    { month: 'Apr', volunteers: 1800, requests: 1400, impact: 6500 },
    { month: 'May', volunteers: 2100, requests: 1650, impact: 7200 },
    { month: 'Jun', volunteers: 2300, requests: 1800, impact: 7900 }
  ];

  const topStates = [
    { name: 'Maharashtra', volunteers: 2156, requests: 1432, percentage: 85 },
    { name: 'Delhi', volunteers: 1934, requests: 1287, percentage: 78 },
    { name: 'Karnataka', volunteers: 1823, requests: 1156, percentage: 82 },
    { name: 'Tamil Nadu', volunteers: 1654, requests: 1089, percentage: 74 },
    { name: 'Gujarat', volunteers: 1432, requests: 987, percentage: 71 }
  ];

  const categoryImpact = [
    { category: 'Education', count: 3245, percentage: 36, color: 'bg-blue-500' },
    { category: 'Healthcare', count: 2156, percentage: 24, color: 'bg-green-500' },
    { category: 'Employment', count: 1876, percentage: 21, color: 'bg-orange-500' },
    { category: 'Counseling', count: 1098, percentage: 12, color: 'bg-purple-500' },
    { category: 'Emergency', count: 559, percentage: 7, color: 'bg-red-500' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
            >
              <span className="text-green-600">Impact</span> Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Real-time insights into the positive change we're creating together across India
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <StatsCard
            icon={Users}
            value={impactStats.totalVolunteers}
            label="Total Volunteers"
            delay={0.1}
          />
          <StatsCard
            icon={Heart}
            value={impactStats.requestsResolved}
            label="Requests Resolved"
            delay={0.2}
          />
          <StatsCard
            icon={TrendingUp}
            value={impactStats.livesImpacted}
            label="Lives Impacted"
            delay={0.3}
          />
          <StatsCard
            icon={BarChart3}
            value={impactStats.activeRequests}
            label="Active Requests"
            delay={0.4}
          />
          <StatsCard
            icon={Calendar}
            value={impactStats.totalCampaigns}
            label="Total Campaigns"
            delay={0.5}
          />
          <StatsCard
            icon={Users}
            value={impactStats.partnersJoined}
            label="Partner Organizations"
            delay={0.6}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Growth Chart */}
            <Card>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Growth Trends</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Metric</span>
                  <div className="flex space-x-8">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                      Volunteers
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                      Requests
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                      Impact
                    </span>
                  </div>
                </div>
                
                {/* Simple Bar Chart Representation */}
                <div className="space-y-3">
                  {monthlyData.map((data, index) => (
                    <motion.div
                      key={data.month}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="grid grid-cols-4 gap-4 items-center"
                    >
                      <div className="font-medium text-gray-700">{data.month}</div>
                      <div className="col-span-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(data.volunteers / 2300) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-12">{data.volunteers}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(data.requests / 1800) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-12">{data.requests}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full" 
                              style={{ width: `${(data.impact / 7900) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-12">{data.impact}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Impact by Category</h2>
              <div className="space-y-4">
                {categoryImpact.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded ${category.color}`}></div>
                      <span className="font-medium text-gray-800">{category.category}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-gray-800">{category.count.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{category.percentage}% of total</div>
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${category.color}`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                <MapPin className="w-5 h-5 inline mr-2" />
                Top Performing States
              </h2>
              <div className="space-y-4">
                {topStates.map((state, index) => (
                  <motion.div
                    key={state.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 pb-3 last:border-b-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{state.name}</span>
                      <span className="text-sm text-green-600">{state.percentage}% success rate</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {state.volunteers} volunteers • {state.requests} requests resolved
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: `${state.percentage}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recent Milestones */}
            <Card>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Milestones</h2>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">50K Lives Impacted</h3>
                      <p className="text-sm text-green-600">Reached this milestone last week</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800">10K+ Volunteers</h3>
                      <p className="text-sm text-blue-600">Active community milestone</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-800">150+ Campaigns</h3>
                      <p className="text-sm text-orange-600">Successful community initiatives</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Insights */}
            <Card>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Insights</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average response time</span>
                  <span className="font-semibold">4.2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success rate</span>
                  <span className="font-semibold text-green-600">92.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volunteer retention</span>
                  <span className="font-semibold text-blue-600">87.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly growth</span>
                  <span className="font-semibold text-orange-600">+15.3%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboardPage;