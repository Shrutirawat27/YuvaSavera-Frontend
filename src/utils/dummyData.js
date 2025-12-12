export const dummyStats = {
  volunteers: 12847,
  requestsSolved: 8934,
  campaignsRun: 156,
  impactReached: 50000
};

export const dummyHelpRequests = [
  {
    id: '1',
    title: 'Need help with job interview preparation',
    description: 'Recently graduated student needs guidance for upcoming job interviews in IT sector.',
    category: 'Employment',
    location: 'Mumbai, Maharashtra',
    urgencyLevel: 'Medium',
    status: 'Open',
    submittedBy: 'Rahul Kumar',
    createdAt: '2025-01-09',
    anonymous: false,
    videoThumbnail: 'https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Educational support for underprivileged children',
    description: 'Looking for volunteers to teach basic mathematics and English to children in slum areas.',
    category: 'Education',
    location: 'Delhi, Delhi',
    urgencyLevel: 'High',
    status: 'Open',
    submittedBy: 'Anonymous',
    createdAt: '2025-01-08',
    anonymous: true,
    videoThumbnail: 'https://images.pexels.com/photos/8197528/pexels-photo-8197528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Mental health counseling needed',
    description: 'Young professional facing workplace stress and anxiety, seeking counseling support.',
    category: 'Counseling',
    location: 'Bangalore, Karnataka',
    urgencyLevel: 'High',
    status: 'In Progress',
    submittedBy: 'Priya Sharma',
    assignedVolunteer: 'Dr. Anjali Verma',
    createdAt: '2025-01-07',
    anonymous: false,
    videoThumbnail: 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const dummyStories = [
  {
    id: '1',
    title: 'From Dropout to Engineer',
    description: 'With the help of our education volunteers, Ramesh completed his 12th grade and is now pursuing engineering.',
    beforeImage: 'https://images.pexels.com/photos/8197469/pexels-photo-8197469.jpeg?auto=compress&cs=tinysrgb&w=400',
    afterImage: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=400',
    volunteerName: 'Meera Joshi',
    helpSeekerName: 'Ramesh Kumar',
    category: 'Education',
    impactMetrics: '100% improvement in grades',
    date: '2024-12-15'
  },
  {
    id: '2',
    title: 'Mental Health Recovery Journey',
    description: 'Through consistent counseling support, Anita overcame her depression and started her own small business.',
    beforeImage: 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=400',
    afterImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    volunteerName: 'Dr. Rajesh Gupta',
    helpSeekerName: 'Anita Singh',
    category: 'Counseling',
    impactMetrics: 'Complete recovery and economic independence',
    date: '2024-11-20'
  }
];

export const dummyCampaigns = [
  {
    id: '1',
    title: 'Digital Literacy Drive 2025',
    description: 'Teaching digital skills to rural youth across 10 villages in Uttar Pradesh.',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    location: 'Uttar Pradesh',
    participantsCount: 245,
    image: 'https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'Active'
  },
  {
    id: '2',
    title: 'Youth Leadership Summit',
    description: 'Annual summit bringing together young leaders from across India to discuss social issues.',
    startDate: '2025-02-20',
    endDate: '2025-02-22',
    location: 'New Delhi',
    participantsCount: 500,
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'Upcoming'
  }
];

export const dummyPartners = [
  {
    id: '1',
    name: 'Teach for India',
    type: 'NGO',
    logo: 'https://images.pexels.com/photos/8197528/pexels-photo-8197528.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Working to end educational inequity in India',
    focusArea: ['Education', 'Youth Development'],
    location: 'Pan India'
  },
  {
    id: '2',
    name: 'Infosys Foundation',
    type: 'Corporate',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Corporate social responsibility initiatives',
    focusArea: ['Education', 'Healthcare', 'Arts & Culture'],
    location: 'Karnataka'
  }
];

export const dummyVolunteer = {
  id: '1',
  name: 'Arjun Patel',
  email: 'arjun.patel@example.com',
  phone: '+91-9876543210',
  role: 'volunteer',
  location: 'Mumbai, Maharashtra',
  skills: ['Teaching', 'Counseling', 'Web Development'],
  causesOfInterest: ['Education', 'Mental Health', 'Employment'],
  points: 1250,
  badges: ['First Help', 'Education Champion', 'Community Leader'],
  contributionHistory: [
    {
      id: '1',
      date: '2025-01-05',
      type: 'Help Request Resolved',
      description: 'Helped Rahul with job interview preparation',
      points: 100
    },
    {
      id: '2',
      date: '2024-12-28',
      type: 'Campaign Participation',
      description: 'Participated in Digital Literacy Drive',
      points: 150
    }
  ]
};