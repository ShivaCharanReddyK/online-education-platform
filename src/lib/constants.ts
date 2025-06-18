
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
    aiHint: 'marketing analytics',
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
    aiHint: 'data charts',
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
    aiHint: 'security shield',
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
  {
    id: 'prog-5',
    title: 'UX/UI Design Professional Certificate',
    description: 'Master user-centered design principles, wireframing, prototyping, and user testing.',
    category: 'Creative Arts',
    duration: '5 Months',
    startDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'design prototype',
    features: ['Figma, Adobe XD', 'Portfolio projects', 'Design thinking workshops'],
    tuitionFee: 4500,
    longDescription: 'This program focuses on creating intuitive and engaging digital experiences. You will learn the entire UX/UI design process, from user research and persona creation to wireframing, prototyping, and usability testing. Build a strong portfolio with real-world projects.',
    learningOutcomes: [
      'Conduct user research and create user personas.',
      'Design wireframes and interactive prototypes using Figma/Adobe XD.',
      'Apply visual design principles to create appealing interfaces.',
      'Conduct usability testing and iterate on designs.',
      'Understand accessibility best practices in UI design.'
    ],
    modules: [
      { title: 'Module 1: UX Fundamentals & User Research', description: 'Design thinking, personas, journey mapping.' },
      { title: 'Module 2: Wireframing & Prototyping', description: 'Low-fidelity and high-fidelity designs, Figma basics.' },
      { title: 'Module 3: UI Design Principles', description: 'Visual hierarchy, color theory, typography.' },
      { title: 'Module 4: Usability Testing & Iteration', description: 'Test planning, execution, and analysis.' },
      { title: 'Module 5: Portfolio Project & Career Prep', description: 'Develop a capstone project and prepare for job interviews.' },
    ]
  },
  {
    id: 'prog-6',
    title: 'Cloud Computing & DevOps Engineering',
    description: 'Learn AWS, Azure, Docker, Kubernetes, and CI/CD pipelines for scalable infrastructure.',
    category: 'Technology',
    duration: '8 Months',
    startDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'cloud servers',
    features: ['AWS & Azure certified instructors', 'Hands-on labs with Docker & K8s', 'Infrastructure as Code (IaC)'],
    tuitionFee: 6800,
    longDescription: 'Become proficient in cloud platforms and DevOps practices. This program covers major cloud providers like AWS and Azure, containerization with Docker, orchestration with Kubernetes, and implementing CI/CD pipelines for automated software delivery.',
    learningOutcomes: [
      'Deploy and manage applications on AWS and Azure.',
      'Containerize applications using Docker.',
      'Orchestrate containers with Kubernetes.',
      'Implement CI/CD pipelines for automated testing and deployment.',
      'Manage infrastructure as code using tools like Terraform.'
    ],
    modules: [
      { title: 'Module 1: Cloud Computing Fundamentals (AWS & Azure)', description: 'Core services, IAM, networking.' },
      { title: 'Module 2: Containerization with Docker', description: 'Dockerfile, image management, Docker Compose.' },
      { title: 'Module 3: Orchestration with Kubernetes', description: 'Pods, services, deployments, Helm charts.' },
      { title: 'Module 4: CI/CD and DevOps Practices', description: 'Jenkins, GitLab CI, Agile methodologies.' },
      { title: 'Module 5: Infrastructure as Code & Monitoring', description: 'Terraform, CloudWatch, Prometheus.' },
    ]
  },
  {
    id: 'prog-7',
    title: 'Business Analytics Specialization',
    description: 'Leverage data to make informed business decisions. Learn Excel, SQL, and Tableau.',
    category: 'Business',
    duration: '4 Months',
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'business charts',
    features: ['Data-driven decision making', 'Tableau for visualization', 'Real business case studies'],
    tuitionFee: 3500,
    longDescription: 'This specialization equips you with the skills to analyze business data and present actionable insights. You will master essential tools like Excel for data manipulation, SQL for database querying, and Tableau for powerful data visualization.',
    learningOutcomes: [
      'Analyze business problems using data.',
      'Extract and manipulate data using SQL.',
      'Create compelling data visualizations with Tableau.',
      'Perform statistical analysis using Excel.',
      'Communicate data-driven insights effectively to stakeholders.'
    ],
    modules: [
      { title: 'Module 1: Introduction to Business Analytics', description: 'Data types, metrics, analytical thinking.' },
      { title: 'Module 2: Data Analysis with Excel', description: 'Advanced functions, pivot tables, modeling.' },
      { title: 'Module 3: SQL for Data Analysis', description: 'Querying databases, joins, aggregations.' },
      { title: 'Module 4: Data Visualization with Tableau', description: 'Dashboards, storytelling with data.' },
      { title: 'Module 5: Case Studies & Presentation Skills', description: 'Applying skills to real-world scenarios.' },
    ]
  },
  {
    id: 'prog-8',
    title: 'Artificial Intelligence Fundamentals',
    description: 'Explore core AI concepts, machine learning, natural language processing, and computer vision.',
    category: 'Data Science',
    duration: '6 Months',
    startDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'ai brain',
    features: ['Introduction to Python for AI', 'Overview of key AI domains', 'Ethical considerations in AI'],
    tuitionFee: 5200,
    longDescription: 'Dive into the exciting field of Artificial Intelligence. This program provides a foundational understanding of AI, covering machine learning principles, natural language processing (NLP) techniques, computer vision basics, and the ethical implications of AI development.',
    learningOutcomes: [
      'Understand core concepts and history of AI.',
      'Grasp fundamental machine learning algorithms.',
      'Learn about Natural Language Processing techniques.',
      'Explore basic principles of Computer Vision.',
      'Discuss ethical challenges and societal impact of AI.'
    ],
    modules: [
      { title: 'Module 1: What is AI?', description: 'History, types of AI, applications.' },
      { title: 'Module 2: Machine Learning Basics', description: 'Supervised, unsupervised learning, model evaluation.' },
      { title: 'Module 3: Natural Language Processing (NLP)', description: 'Text processing, sentiment analysis, chatbots.' },
      { title: 'Module 4: Computer Vision Fundamentals', description: 'Image processing, object detection basics.' },
      { title: 'Module 5: AI Ethics and Future Trends', description: 'Bias, fairness, future of AI.' },
    ]
  },
  {
    id: 'prog-9',
    title: 'Graphic Design Masterclass',
    description: 'Unleash your creativity with Adobe Photoshop, Illustrator, and InDesign. For print and web.',
    category: 'Creative Arts',
    duration: '4 Months',
    startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'design tools',
    features: ['Adobe Creative Suite mastery', 'Portfolio development', 'Typography & color theory'],
    tuitionFee: 3800,
    longDescription: 'This masterclass covers the essential tools and principles of graphic design. Learn to create stunning visuals for both print and digital media using Adobe Photoshop, Illustrator, and InDesign. Develop a strong portfolio showcasing your skills in branding, layout, and illustration.',
    learningOutcomes: [
      'Master Adobe Photoshop, Illustrator, and InDesign.',
      'Understand principles of design, typography, and color theory.',
      'Create logos, brochures, web graphics, and other design assets.',
      'Develop a professional graphic design portfolio.',
      'Prepare files for print and web production.'
    ],
    modules: [
      { title: 'Module 1: Design Fundamentals & Illustrator', description: 'Principles, vector graphics, logo design.' },
      { title: 'Module 2: Image Manipulation with Photoshop', description: 'Photo editing, compositing, digital painting.' },
      { title: 'Module 3: Layout & Publishing with InDesign', description: 'Brochures, magazines, interactive PDFs.' },
      { title: 'Module 4: Branding & Portfolio Development', description: 'Brand identity, capstone project.' },
    ]
  },
  {
    id: 'prog-10',
    title: 'Project Management Professional (PMP) Prep',
    description: 'Prepare for the PMP certification exam. Covers Agile, Scrum, and traditional project management.',
    category: 'Business',
    duration: '2 Months',
    startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'team meeting',
    features: ['PMBOK Guide alignment', 'Practice exams', 'Experienced PMP instructors'],
    tuitionFee: 2500,
    longDescription: 'This intensive PMP exam preparation course is designed to help you pass the Project Management Professional certification on your first try. It covers all knowledge areas of the PMBOK Guide, along with Agile and hybrid approaches. Includes extensive practice questions and exam-taking strategies.',
    learningOutcomes: [
      'Understand and apply the PMP exam content outline.',
      'Master project management processes, tools, and techniques.',
      'Learn about Agile, Scrum, and hybrid project methodologies.',
      'Develop effective exam-taking strategies.',
      'Feel confident to sit for the PMP certification exam.'
    ],
    modules: [
      { title: 'Module 1: Project Management Framework & Initiating', description: 'PMBOK, project charter, stakeholders.' },
      { title: 'Module 2: Planning & Executing', description: 'Scope, schedule, cost, quality, resources, risk.' },
      { title: 'Module 3: Monitoring, Controlling & Closing', description: 'Change control, performance reporting, lessons learned.' },
      { title: 'Module 4: Agile Practices & Exam Review', description: 'Scrum, Kanban, practice exams.' },
    ]
  },
  {
    id: 'prog-11',
    title: 'Mobile App Development (iOS & Android)',
    description: 'Learn to build native mobile apps using Swift for iOS and Kotlin for Android.',
    category: 'Technology',
    duration: '10 Months',
    startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'mobile apps',
    features: ['Swift & Kotlin', 'Xcode & Android Studio', 'API integration', 'App store deployment'],
    tuitionFee: 8000,
    longDescription: 'Become a mobile app developer capable of building apps for both iOS and Android platforms. This program covers native development using Swift and Xcode for iOS, and Kotlin and Android Studio for Android. You will learn UI design, data persistence, API integration, and app store submission processes.',
    learningOutcomes: [
      'Develop native iOS applications using Swift and Xcode.',
      'Develop native Android applications using Kotlin and Android Studio.',
      'Design and implement user interfaces for mobile devices.',
      'Integrate with backend APIs and manage local data.',
      'Publish apps to the Apple App Store and Google Play Store.'
    ],
    modules: [
      { title: 'Module 1: Introduction to Mobile Development', description: 'Mobile landscape, platform differences.' },
      { title: 'Module 2: iOS Development with Swift', description: 'Swift basics, UIKit/SwiftUI, Core Data.' },
      { title: 'Module 3: Android Development with Kotlin', description: 'Kotlin basics, XML/Jetpack Compose, Room DB.' },
      { title: 'Module 4: Advanced Mobile Concepts', description: 'Networking, background tasks, notifications.' },
      { title: 'Module 5: Cross-Platform Considerations & Deployment', description: 'React Native/Flutter overview (optional), app store submission.' },
    ]
  },
  {
    id: 'prog-12',
    title: 'Content Writing & SEO Strategy',
    description: 'Create compelling content that ranks. Learn keyword research, on-page SEO, and content promotion.',
    category: 'Marketing',
    duration: '2 Months',
    startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'writing keyboard',
    features: ['SEO tools (Ahrefs, SEMrush basics)', 'Blog writing, copywriting', 'Content calendar planning'],
    tuitionFee: 1800,
    longDescription: 'Master the art and science of content writing combined with effective SEO strategies. This program teaches you how to research keywords, write engaging and optimized content for various platforms, and promote your content to reach a wider audience.',
    learningOutcomes: [
      'Conduct effective keyword research and competitor analysis.',
      'Write high-quality, SEO-friendly content for blogs, websites, and social media.',
      'Understand on-page and off-page SEO techniques.',
      'Develop a content strategy and editorial calendar.',
      'Measure content performance using analytics.'
    ],
    modules: [
      { title: 'Module 1: Foundations of Content & SEO', description: 'Content types, SEO basics, target audience.' },
      { title: 'Module 2: Keyword Research & On-Page Optimization', description: 'Tools, techniques, writing for search engines.' },
      { title: 'Module 3: Content Creation & Promotion', description: 'Blogging, copywriting, link building basics.' },
      { title: 'Module 4: Content Strategy & Analytics', description: 'Content calendar, performance tracking.' },
    ]
  },
  {
    id: 'prog-13',
    title: 'Blockchain Technology Fundamentals',
    description: 'Understand the core concepts of blockchain, cryptocurrencies, smart contracts, and DApps.',
    category: 'Technology',
    duration: '3 Months',
    startDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'blockchain network',
    features: ['Bitcoin & Ethereum explained', 'Solidity basics for smart contracts', 'Use cases of blockchain'],
    tuitionFee: 3200,
    longDescription: 'Explore the revolutionary world of blockchain technology. This program covers the fundamental principles of distributed ledger technology, cryptocurrencies like Bitcoin and Ethereum, the basics of smart contract development with Solidity, and various applications of blockchain beyond finance.',
    learningOutcomes: [
      'Explain core concepts of blockchain and distributed ledger technology.',
      'Understand the workings of major cryptocurrencies.',
      'Grasp the fundamentals of smart contracts and their development.',
      'Identify various use cases for blockchain technology.',
      'Discuss security and scalability challenges in blockchain.'
    ],
    modules: [
      { title: 'Module 1: Introduction to Blockchain', description: 'History, cryptography, consensus mechanisms.' },
      { title: 'Module 2: Cryptocurrencies', description: 'Bitcoin, Ethereum, altcoins, wallets.' },
      { title: 'Module 3: Smart Contracts & DApps', description: 'Solidity basics, decentralized applications.' },
      { title: 'Module 4: Blockchain Use Cases & Future', description: 'Supply chain, healthcare, NFTs, DAOs.' },
    ]
  },
  {
    id: 'prog-14',
    title: 'Photography Masterclass: From Novice to Pro',
    description: 'Learn camera settings, composition, lighting, and post-processing techniques.',
    category: 'Creative Arts',
    duration: '6 Weeks',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'camera photography',
    features: ['DSLR/Mirrorless camera operation', 'Adobe Lightroom & Photoshop for editing', 'Genre exploration (portrait, landscape)'],
    tuitionFee: 1500,
    longDescription: 'This comprehensive photography masterclass is designed for aspiring photographers of all levels. You will learn how to master your camera, understand the principles of composition and lighting, and edit your photos like a professional using Adobe Lightroom and Photoshop.',
    learningOutcomes: [
      'Confidently operate a DSLR or mirrorless camera in manual mode.',
      'Apply principles of composition and lighting to create impactful images.',
      'Edit photos effectively using Adobe Lightroom and Photoshop.',
      'Understand different photography genres and techniques.',
      'Develop a personal photographic style.'
    ],
    modules: [
      { title: 'Week 1-2: Camera & Exposure Mastery', description: 'Aperture, shutter speed, ISO, lenses.' },
      { title: 'Week 3-4: Composition & Lighting', description: 'Rules of composition, natural and artificial light.' },
      { title: 'Week 5: Post-Processing with Lightroom & Photoshop', description: 'Workflow, editing techniques.' },
      { title: 'Week 6: Genre Exploration & Portfolio Building', description: 'Portrait, landscape, street photography projects.' },
    ]
  }
];

export const DUMMY_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    userId: 'student-1',
    programId: 'prog-1',
    personalDetails: { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '1995-03-15', phone: '555-1234', address: '123 Main St, Anytown USA', email: 'alice.smith@example.com' },
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
    personalDetails: { firstName: 'Bob', lastName: 'Johnson', dateOfBirth: '1998-07-22', phone: '555-5678', address: '456 Oak Ave, Anytown USA', email: 'bob.johnson@example.com' },
    educationalBackground: { highestQualification: 'B.A. Marketing', institution: 'Community College', yearOfCompletion: '2020' },
    statementOfPurpose: 'I want to enhance my marketing skills with digital strategies.',
    status: 'approved',
    referenceNumber: 'LF20240002',
    submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
];

export const PROGRAM_CATEGORIES = ['All', 'Technology', 'Marketing', 'Data Science', 'Business', 'Creative Arts', 'Photography', 'Project Management', 'Cybersecurity', 'Cloud Computing'];
export const PROGRAM_DURATIONS = ['All', 'Under 3 Months', '3-6 Months', '6-9 Months', 'Over 9 Months'];

export function getDurationCategory(duration: string): string {
  const monthsMatch = duration.match(/(\d+)\s*Months?/i);
  const weeksMatch = duration.match(/(\d+)\s*Weeks?/i);

  if (weeksMatch) {
    const numWeeks = parseInt(weeksMatch[1], 10);
    if (numWeeks < 12) return 'Under 3 Months'; // Approx 3 months
  }
  
  if (monthsMatch) {
    const numMonths = parseInt(monthsMatch[1], 10);
    if (numMonths < 3) return 'Under 3 Months';
    if (numMonths <= 6) return '3-6 Months';
    if (numMonths <= 9) return '6-9 Months';
    return 'Over 9 Months';
  }
  return 'Over 9 Months'; // Default for "1 Year" etc. or if no match
}

    