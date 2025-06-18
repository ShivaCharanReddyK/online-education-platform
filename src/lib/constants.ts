
import type { Program, Application } from '@/types';

export const DUMMY_PROGRAMS: Program[] = [
  {
    id: 'prog-1',
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Become a job-ready web developer. Learn front-end and back-end technologies.',
    category: 'Technology',
    duration: '6 Months',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Approx 1 month from now
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'laptop code',
    features: ['JavaScript, React, Node.js', 'Real-world projects', 'Career support'],
    tuitionFee: 5000,
    longDescription: 'Our Full-Stack Web Development Bootcamp is an intensive program designed to equip you with the skills needed to build modern web applications. You will master both front-end and back-end development, working with popular technologies like React, Node.js, Express, and MongoDB. The curriculum includes hands-on projects, collaborative coding sessions, and mentorship from industry experts.',
    learningOutcomes: [
      'Build responsive user interfaces with React.',
      'Develop server-side applications with Node.js and Express.',
      'Design and manage databases with MongoDB.',
      'Deploy full-stack applications to the cloud.',
      'Collaborate effectively in a development team.'
    ],
    modules: [
      { title: 'Module 1: Web Fundamentals', description: 'HTML, CSS, JavaScript basics.'},
      { title: 'Module 2: Front-End Development with React', description: 'Components, state, props, hooks, routing.'},
      { title: 'Module 3: Back-End Development with Node.js', description: 'Express.js, APIs, authentication.'},
      { title: 'Module 4: Databases with MongoDB', description: 'Schema design, CRUD operations, Mongoose.'},
      { title: 'Module 5: Full-Stack Project & Deployment', description: 'Building and deploying a complete application.'},
    ]
  },
  {
    id: 'prog-2',
    title: 'Digital Marketing Specialist Program',
    description: 'Master SEO, SEM, social media marketing, and content strategy.',
    category: 'Marketing',
    duration: '3 Months',
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // Approx 2 months from now
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'dashboard marketing',
    features: ['Google Ads & Analytics certified', 'Hands-on campaigns', 'Industry case studies'],
    tuitionFee: 3000,
    longDescription: 'The Digital Marketing Specialist Program offers a comprehensive dive into the world of online marketing. Learn to create effective strategies, run successful campaigns, and analyze performance using cutting-edge tools and techniques. This program covers SEO, SEM, social media marketing, email marketing, content creation, and analytics.',
    learningOutcomes: [
      'Develop and implement comprehensive digital marketing strategies.',
      'Optimize websites for search engines (SEO).',
      'Manage and optimize paid advertising campaigns (SEM).',
      'Create engaging content for various digital platforms.',
      'Analyze marketing data to measure ROI and inform decisions.'
    ],
     modules: [
      { title: 'Module 1: Introduction to Digital Marketing', description: 'Overview, strategy, and planning.'},
      { title: 'Module 2: SEO and Content Marketing', description: 'Keywords, on-page/off-page SEO, content creation.'},
      { title: 'Module 3: Paid Advertising (SEM & Social)', description: 'Google Ads, Facebook Ads, campaign management.'},
      { title: 'Module 4: Social Media & Email Marketing', description: 'Platform strategies, automation, list building.'},
      { title: 'Module 5: Analytics and Reporting', description: 'Google Analytics, KPIs, data interpretation.'},
    ]
  },
  {
    id: 'prog-3',
    title: 'Data Science & Machine Learning Certificate',
    description: 'Unlock the power of data with Python, R, and machine learning algorithms.',
    category: 'Data Science',
    duration: '9 Months',
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // Approx 1.5 months from now
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'network visualization',
    features: ['Python, R, TensorFlow, Scikit-learn', 'Capstone project', 'Expert instructors'],
    tuitionFee: 7500,
    longDescription: 'This certificate program in Data Science & Machine Learning provides a rigorous foundation in statistical analysis, data visualization, and machine learning techniques. Students will learn to use Python and R to manipulate data, build predictive models, and derive insights from complex datasets. The program culminates in a capstone project where students apply their skills to a real-world problem.',
    learningOutcomes: [
      'Clean, process, and analyze large datasets.',
      'Build and evaluate machine learning models.',
      'Visualize data effectively to communicate insights.',
      'Apply statistical methods to solve business problems.',
      'Utilize Python and R for data science tasks.'
    ],
     modules: [
      { title: 'Module 1: Data Science Fundamentals', description: 'Python, R, statistics, data wrangling.'},
      { title: 'Module 2: Data Visualization', description: 'Matplotlib, Seaborn, ggplot2, interactive charts.'},
      { title: 'Module 3: Machine Learning Algorithms', description: 'Regression, classification, clustering, dimensionality reduction.'},
      { title: 'Module 4: Advanced Topics & Deep Learning', description: 'Neural networks, TensorFlow, Keras.'},
      { title: 'Module 5: Capstone Project', description: 'End-to-end data science project.'},
    ]
  },
   {
    id: 'prog-4',
    title: 'Cybersecurity Analyst Training',
    description: 'Learn to protect systems and data from cyber threats. Covers network security, ethical hacking, and incident response.',
    category: 'Technology',
    duration: '7 Months',
    startDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(), // Approx 2.5 months from now
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'server security',
    features: ['Hands-on labs', 'Industry-recognized tools', 'Preparation for CompTIA Security+'],
    tuitionFee: 6000,
    longDescription: 'Our Cybersecurity Analyst Training program prepares you for a career in the fast-growing field of cybersecurity. You will gain practical skills in threat detection, vulnerability assessment, network security, ethical hacking, and incident response. The curriculum is aligned with industry best practices and prepares you for certifications like CompTIA Security+.',
    learningOutcomes: [
      'Identify and mitigate security vulnerabilities.',
      'Monitor networks for suspicious activity and respond to incidents.',
      'Implement security controls and best practices.',
      'Understand common attack vectors and defense mechanisms.',
      'Perform ethical hacking techniques for testing purposes.'
    ],
    modules: [
      { title: 'Module 1: Introduction to Cybersecurity', description: 'Threat landscape, security principles.'},
      { title: 'Module 2: Network Security', description: 'Firewalls, IDS/IPS, VPNs, secure network design.'},
      { title: 'Module 3: Ethical Hacking & Penetration Testing', description: 'Techniques, tools, reporting.'},
      { title: 'Module 4: Incident Response & Forensics', description: 'Handling breaches, data recovery, investigation.'},
      { title: 'Module 5: Security Auditing & Compliance', description: 'Frameworks, policies, risk management.'},
    ]
  },
];

export const DUMMY_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    userId: 'student-1',
    programId: 'prog-1',
    personalDetails: { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '1995-03-15', phone: '555-1234', address: '123 Main St, Anytown USA' },
    educationalBackground: { highestQualification: 'B.Sc. Computer Science', institution: 'State University', yearOfCompletion: '2017' },
    statementOfPurpose: 'I am passionate about web development and wish to transition my career into this field.',
    status: 'pending',
    referenceNumber: 'LF20240001',
    submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 'app-2',
    userId: 'student-2',
    programId: 'prog-2',
    personalDetails: { firstName: 'Bob', lastName: 'Johnson', dateOfBirth: '1998-07-22', phone: '555-5678', address: '456 Oak Ave, Anytown USA' },
    educationalBackground: { highestQualification: 'B.A. Marketing', institution: 'Community College', yearOfCompletion: '2020' },
    statementOfPurpose: 'I want to enhance my marketing skills with digital strategies.',
    status: 'approved',
    referenceNumber: 'LF20240002',
    submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
];

export const PROGRAM_CATEGORIES = ['All', 'Technology', 'Marketing', 'Data Science', 'Business', 'Creative Arts'];
export const PROGRAM_DURATIONS = ['All', 'Under 3 Months', '3-6 Months', '6-9 Months', 'Over 9 Months'];

export function getDurationCategory(duration: string): string {
  const monthsMatch = duration.match(/(\d+)\s*Months?/i);
  if (monthsMatch) {
    const numMonths = parseInt(monthsMatch[1], 10);
    if (numMonths < 3) return 'Under 3 Months';
    if (numMonths <= 6) return '3-6 Months';
    if (numMonths <= 9) return '6-9 Months';
    return 'Over 9 Months';
  }
  return 'Over 9 Months'; // Default for "1 Year" etc.
}

