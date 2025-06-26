
import type { Program, Application } from '@/types';

// DUMMY_PROGRAMS is now primarily for seeding the database if empty.
// The application will fetch programs from MongoDB.
export const DUMMY_PROGRAMS: Omit<Program, '_id' | 'id'>[] = [
  {
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Become a job-ready web developer. Learn front-end and back-end technologies.',
    category: 'Technology',
    duration: '6 Months',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudHxlbnwwfHx8fDE3MTI4NjU0MzB8MA&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Digital Marketing Specialist Program',
    description: 'Master SEO, SEM, social media marketing, and content strategy.',
    category: 'Marketing',
    duration: '3 Months',
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxkaWdpdGFsJTIwbWFya2V0aW5nfGVufDB8fHx8MTcxMjg2NTQ3N3ww&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Data Science & Machine Learning Certificate',
    description: 'Unlock the power of data with Python, R, and machine learning algorithms.',
    category: 'Data Science',
    duration: '9 Months',
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzfGVufDB8fHx8MTcxMjg2NTUwMHww&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Cybersecurity Analyst Training',
    description: 'Learn to protect systems and data from cyber threats. Covers network security, ethical hacking, and incident response.',
    category: 'Technology',
    duration: '7 Months',
    startDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1662638600476-d563fffbb072?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxDeWJlciUyMHNlY3VyaXR5JTIwYW5hbHlzdHxlbnwwfHx8fDE3NTA5MzExNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    aiHint: 'cyber security',
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
    title: 'UX/UI Design Professional Certificate',
    description: 'Master user-centered design principles, wireframing, prototyping, and user testing.',
    category: 'Creative Arts',
    duration: '5 Months',
    startDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx1eCUyMHVpJTIwZGVzaWdufGVufDB8fHx8MTcxMjg2NTU0Nnww&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Cloud Computing & DevOps Engineering',
    description: 'Learn AWS, Azure, Docker, Kubernetes, and CI/CD pipelines for scalable infrastructure.',
    category: 'Technology',
    duration: '8 Months',
    startDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMHNlcnZlcnN8ZW58MHx8fHwxNzEyODY1NTY4fDA&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Business Analytics Specialization',
    description: 'Leverage data to make informed business decisions. Learn Excel, SQL, and Tableau.',
    category: 'Business',
    duration: '4 Months',
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljc3xlbnwwfHx8fDE3MTI4NjU1OTB8MA&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Artificial Intelligence Fundamentals',
    description: 'Explore core AI concepts, machine learning, natural language processing, and computer vision.',
    category: 'Data Science',
    duration: '6 Months',
    startDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8fHx8MTcxMjg2NTYxMnww&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'ai robot',
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
    title: 'Graphic Design Masterclass',
    description: 'Unleash your creativity with Adobe Photoshop, Illustrator, and InDesign. For print and web.',
    category: 'Creative Arts',
    duration: '4 Months',
    startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWdufGVufDB8fHx8MTcxMjg2NTYzNXww&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Project Management Professional (PMP) Prep',
    description: 'Prepare for the PMP certification exam. Covers Agile, Scrum, and traditional project management.',
    category: 'Business',
    duration: '2 Months',
    startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwbWFuYWdlbWVudHxlbnwwfHx8fDE3MTI4NjU2NTh8MA&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Mobile App Development (iOS & Android)',
    description: 'Learn to build native mobile apps using Swift for iOS and Kotlin for Android.',
    category: 'Technology',
    duration: '10 Months',
    startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXZlbG9wbWVudHxlbnwwfHx8fDE3MTI4NjU2ODB8MA&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Content Writing & SEO Strategy',
    description: 'Create compelling content that ranks. Learn keyword research, on-page SEO, and content promotion.',
    category: 'Marketing',
    duration: '2 Months',
    startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwd3JpdGluZ3xlbnwwfHx8fDE3MTI4NjU3MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Blockchain Technology Fundamentals',
    description: 'Understand the core concepts of blockchain, cryptocurrencies, smart contracts, and DApps.',
    category: 'Technology',
    duration: '3 Months',
    startDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWlufGVufDB8fHx8MTcxMjg2NTcyNHww&ixlib=rb-4.0.3&q=80&w=1080',
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
    title: 'Photography Masterclass: From Novice to Pro',
    description: 'Learn camera settings, composition, lighting, and post-processing techniques.',
    category: 'Creative Arts',
    duration: '6 Weeks',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MTI4NjU3NDd8MA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'camera lens',
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
  },
  // Added 10 new programs
  {
    title: 'Sustainable Energy Engineering',
    description: 'Explore renewable energy sources, energy efficiency, and sustainable system design.',
    category: 'Engineering',
    duration: '12 Months',
    startDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1668097613572-40b7c11c8727?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxTdXN0YWluYWJsZSUyMEVuZXJneXxlbnwwfHx8fDE3NTA5MzE3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    aiHint: 'wind turbine',
    features: ['Solar, Wind, Geothermal energy', 'Energy policy and economics', 'System modeling'],
    tuitionFee: 9000,
    longDescription: 'This program delves into the principles and practices of sustainable energy engineering. Students will learn about various renewable energy technologies, energy storage solutions, and the design of efficient energy systems. It also covers the economic and policy aspects of sustainable energy.',
    learningOutcomes: [
      'Analyze and design renewable energy systems.',
      'Understand energy conversion and storage technologies.',
      'Evaluate the environmental and economic impact of energy projects.',
      'Apply system modeling tools for energy analysis.',
      'Understand sustainable energy policies and regulations.'
    ],
    modules: [
      { title: 'Module 1: Introduction to Sustainable Energy', description: 'Global energy landscape, climate change.'},
      { title: 'Module 2: Renewable Energy Technologies', description: 'Solar PV, wind turbines, biomass, geothermal.'},
      { title: 'Module 3: Energy Efficiency and Management', description: 'Building energy systems, industrial efficiency.'},
      { title: 'Module 4: Energy Storage and Grid Integration', description: 'Batteries, pumped hydro, smart grids.'},
      { title: 'Module 5: Policy, Economics, and Capstone Project', description: 'Regulations, market analysis, final project.'},
    ]
  },
  {
    title: 'Culinary Arts: Professional Chef Program',
    description: 'Master essential cooking techniques, international cuisines, and kitchen management.',
    category: 'Culinary Arts',
    duration: '9 Months',
    startDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZ3xlbnwwfHx8fDE3MTI4NjU3OTB8MA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'chef cooking',
    features: ['Hands-on kitchen training', 'Menu development', 'Food safety and sanitation'],
    tuitionFee: 12000,
    longDescription: 'Embark on a journey to become a professional chef. This program offers intensive hands-on training in classical and contemporary cooking techniques, Garde Manger, baking, and pastry. Students will also learn about menu planning, cost control, and kitchen operations.',
    learningOutcomes: [
      'Master a wide range of cooking techniques.',
      'Prepare dishes from various international cuisines.',
      'Understand principles of food science and nutrition.',
      'Manage kitchen operations, including inventory and cost control.',
      'Adhere to food safety and sanitation standards.'
    ],
    modules: [
      { title: 'Module 1: Culinary Fundamentals & Knife Skills', description: 'Basic cuts, stocks, sauces.'},
      { title: 'Module 2: International Cuisines', description: 'French, Italian, Asian, Latin American techniques.'},
      { title: 'Module 3: Baking and Pastry Arts', description: 'Breads, cakes, desserts, chocolate work.'},
      { title: 'Module 4: Garde Manger & Charcuterie', description: 'Cold kitchen preparations, pates, sausages.'},
      { title: 'Module 5: Kitchen Management & Capstone Dinner', description: 'Menu planning, costing, final practical exam.'},
    ]
  },
  {
    title: 'Game Development with Unity',
    description: 'Learn to create 2D and 3D games using the Unity engine and C# programming.',
    category: 'Technology',
    duration: '7 Months',
    startDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnYW1lJTIwZGV2ZWxvcG1lbnR8ZW58MHx8fHwxNzEyODY1ODExfDA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'game controller',
    features: ['Unity Engine, C# scripting', 'Game physics and AI basics', 'Asset integration'],
    tuitionFee: 6500,
    longDescription: 'This program provides a comprehensive introduction to game development using the powerful Unity engine. Students will learn C# programming for game logic, level design, character animation, UI implementation, and game physics. The course culminates in developing and publishing a playable game.',
    learningOutcomes: [
      'Develop 2D and 3D games using Unity.',
      'Program game mechanics and logic using C#.',
      'Design game levels and environments.',
      'Implement character animations and AI behaviors.',
      'Optimize and publish games for various platforms.'
    ],
    modules: [
      { title: 'Module 1: Unity & C# Fundamentals', description: 'Unity interface, scripting basics.'},
      { title: 'Module 2: 2D Game Development', description: 'Sprites, tilemaps, 2D physics.'},
      { title: 'Module 3: 3D Game Development', description: '3D models, terrain, lighting, 3D physics.'},
      { title: 'Module 4: Game AI & UI', description: 'Pathfinding, behavior trees, UI elements.'},
      { title: 'Module 5: Optimization & Publishing', description: 'Performance tuning, build process.'},
    ]
  },
  {
    title: 'Ethical Hacking & Penetration Testing Pro',
    description: 'Advanced techniques in ethical hacking, vulnerability assessment, and exploit development.',
    category: 'Cybersecurity',
    duration: '5 Months',
    startDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1593642532400-2682810df593?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoYWNrZXJ8ZW58MHx8fHwxNzEyODY1ODQwfDA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'hacker code',
    features: ['Advanced Kali Linux tools', 'Web app & network penetration testing', 'Reporting and mitigation'],
    tuitionFee: 7000,
    longDescription: 'Dive deeper into the world of offensive security. This advanced program focuses on practical penetration testing methodologies for web applications, networks, and systems. Learn to use sophisticated tools, develop custom exploits, and provide comprehensive reports with mitigation strategies.',
    learningOutcomes: [
      'Conduct comprehensive penetration tests on various systems.',
      'Identify and exploit complex vulnerabilities.',
      'Understand advanced attack vectors and defense evasion techniques.',
      'Develop custom scripts and tools for ethical hacking.',
      'Write professional penetration testing reports.'
    ],
    modules: [
      { title: 'Module 1: Advanced Reconnaissance & Enumeration', description: 'Footprinting, scanning techniques.'},
      { title: 'Module 2: Web Application Penetration Testing', description: 'OWASP Top 10, SQL injection, XSS.'},
      { title: 'Module 3: Network & Infrastructure Hacking', description: 'Exploiting services, pivoting, post-exploitation.'},
      { title: 'Module 4: Wireless & Mobile Security Testing', description: 'Wi-Fi hacking, mobile app vulnerabilities.'},
      { title: 'Module 5: Exploit Development & Reporting', description: 'Buffer overflows, custom exploits, professional reporting.'},
    ]
  },
  {
    title: 'Interior Design Fundamentals',
    description: 'Learn principles of space planning, color theory, materials, and furniture selection.',
    category: 'Creative Arts',
    duration: '4 Months',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbnxlbnwwfHx8fDE3MTI4NjU4NjN8MA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'modern interior',
    features: ['SketchUp for 3D modeling', 'Client presentation skills', 'Sustainable design practices'],
    tuitionFee: 4200,
    longDescription: 'This program introduces the core concepts of interior design. Students will learn about space planning, ergonomics, color psychology, material selection, lighting design, and creating cohesive design schemes. The course includes an introduction to 3D modeling software and focuses on developing a strong design portfolio.',
    learningOutcomes: [
      'Apply principles of space planning and layout.',
      'Understand color theory and its application in interiors.',
      'Select appropriate materials, finishes, and furniture.',
      'Create basic 3D models and design presentations.',
      'Develop a foundational understanding of interior design styles.'
    ],
    modules: [
      { title: 'Module 1: Introduction to Interior Design', description: 'History, styles, design process.'},
      { title: 'Module 2: Space Planning & Ergonomics', description: 'Layouts, circulation, human factors.'},
      { title: 'Module 3: Color, Materials & Lighting', description: 'Color schemes, textiles, lighting techniques.'},
      { title: 'Module 4: 3D Modeling & Presentation', description: 'SketchUp basics, mood boards, client communication.'},
    ]
  },
  {
    title: 'Personal Finance & Wealth Management',
    description: 'Master budgeting, investing, retirement planning, and strategies for financial independence.',
    category: 'Business',
    duration: '3 Months',
    startDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1579621970795-87f55d90727f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGZpbmFuY2V8ZW58MHx8fHwxNzEyODY1ODg2fDA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'money growth',
    features: ['Investment strategies (stocks, bonds, real estate)', 'Tax planning basics', 'Risk management'],
    tuitionFee: 2800,
    longDescription: 'Take control of your financial future with this comprehensive program on personal finance and wealth management. Learn how to create effective budgets, understand different investment vehicles, plan for retirement, manage debt, and make informed financial decisions.',
    learningOutcomes: [
      'Create and manage a personal budget effectively.',
      'Understand different investment options and strategies.',
      'Develop a long-term financial plan for retirement.',
      'Learn about risk management and insurance.',
      'Make informed decisions about debt and credit.'
    ],
    modules: [
      { title: 'Module 1: Budgeting & Financial Goal Setting', description: 'Tracking expenses, saving strategies.'},
      { title: 'Module 2: Investing Fundamentals', description: 'Stocks, bonds, mutual funds, ETFs, risk tolerance.'},
      { title: 'Module 3: Retirement & Estate Planning', description: '401(k)s, IRAs, wills, trusts basics.'},
      { title: 'Module 4: Debt Management & Tax Strategies', description: 'Credit scores, loan management, tax efficiency.'},
    ]
  },
  {
    title: 'Creative Writing: Fiction & Non-Fiction',
    description: 'Develop your writing skills in various genres, from short stories and novels to essays and memoirs.',
    category: 'Creative Arts',
    duration: '5 Months',
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwd3JpdGluZ3xlbnwwfHx8fDE3MTI4NjU3MDJ8MA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'writing notebook',
    features: ['Workshops and critiques', 'Character development, plot structure', 'Publishing industry insights'],
    tuitionFee: 3300,
    longDescription: 'Unleash your inner author with this creative writing program. Explore techniques for crafting compelling narratives in both fiction and non-fiction. The course covers character development, plot construction, point of view, dialogue, and a_lot_more. Includes workshops for peer feedback and guidance on navigating the publishing world.',
    learningOutcomes: [
      'Develop compelling characters and engaging plots.',
      'Master techniques of narrative structure and point of view.',
      'Write effective dialogue and vivid descriptions.',
      'Provide and receive constructive criticism in a workshop setting.',
      'Understand the basics of the publishing process.'
    ],
    modules: [
      { title: 'Module 1: Elements of Storytelling', description: 'Plot, character, setting, theme, conflict.'},
      { title: 'Module 2: Fiction Workshop', description: 'Short stories, novel excerpts, genre writing.'},
      { title: 'Module 3: Non-Fiction Workshop', description: 'Essays, memoir, feature writing.'},
      { title: 'Module 4: Advanced Techniques & Revision', description: 'Voice, style, editing strategies.'},
      { title: 'Module 5: The Writer\'s Life & Publishing', description: 'Submission process, literary agents.'},
    ]
  },
  {
    title: 'Foreign Language Intensive: Spanish',
    description: 'Achieve conversational fluency in Spanish through immersive learning and practice.',
    category: 'Languages',
    duration: '6 Months',
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcGFpbnxlbnwwfHx8fDE3MTI4NjU5NDF8MA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'spain culture',
    features: ['Native-speaking instructors', 'Cultural immersion activities', 'Focus on speaking and listening'],
    tuitionFee: 4000,
    longDescription: 'This intensive Spanish language program is designed to take students from beginner or intermediate levels to conversational fluency. The curriculum emphasizes practical communication skills, grammar, vocabulary, and cultural understanding. Taught by native speakers, the course includes interactive exercises and real-world scenarios.',
    learningOutcomes: [
      'Communicate effectively in Spanish in everyday situations.',
      'Understand spoken Spanish from native speakers.',
      'Read and write basic to intermediate Spanish texts.',
      'Develop a strong foundation in Spanish grammar and vocabulary.',
      'Gain insights into Spanish-speaking cultures.'
    ],
    modules: [
      { title: 'Module 1-2: Beginner Spanish (A1-A2)', description: 'Greetings, basic grammar, everyday vocabulary.'},
      { title: 'Module 3-4: Intermediate Spanish (B1)', description: 'Complex sentences, past tenses, expressing opinions.'},
      { title: 'Module 5-6: Upper Intermediate Spanish (B2)', description: 'Advanced grammar, nuanced conversation, cultural topics.'},
    ]
  },
  {
    title: 'Music Production with Ableton Live',
    description: 'Learn to compose, record, mix, and master music using Ableton Live software.',
    category: 'Music Production',
    duration: '4 Months',
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y3Rpb258ZW58MHx8fHwxNzEyODY1OTY1fDA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'music production',
    features: ['Ableton Live software proficiency', 'MIDI and audio recording', 'Sound design basics'],
    tuitionFee: 3600,
    longDescription: 'Dive into the world of music production with Ableton Live. This program covers everything from setting up your first session to advanced mixing and mastering techniques. Learn MIDI programming, audio recording, synthesis, sampling, and effects processing to create professional-sounding tracks.',
    learningOutcomes: [
      'Navigate and operate Ableton Live efficiently.',
      'Record and edit MIDI and audio.',
      'Understand principles of synthesis and sound design.',
      'Mix and master tracks for various playback systems.',
      'Compose original music in a chosen genre.'
    ],
    modules: [
      { title: 'Module 1: Ableton Live Interface & Workflow', description: 'Session/Arrangement view, MIDI clips, audio clips.'},
      { title: 'Module 2: Recording & Sound Design', description: 'Microphones, audio interfaces, synthesis, sampling.'},
      { title: 'Module 3: Arranging & Composition', description: 'Song structure, automation, effects processing.'},
      { title: 'Module 4: Mixing & Mastering', description: 'Levels, EQ, compression, mastering chain.'},
    ]
  },
  {
    title: 'Health & Wellness Coaching Certification',
    description: 'Become a certified health coach. Learn motivational interviewing, nutrition basics, and behavior change strategies.',
    category: 'Health & Wellness',
    duration: '8 Months',
    startDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjB3ZWxsbmVzc3xlbnwwfHx8fDE3MTI4NjU5ODl8MA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'healthy lifestyle',
    features: ['Evidence-based coaching techniques', 'Client assessment skills', 'Ethics and professional standards'],
    tuitionFee: 5500,
    longDescription: 'This certification program prepares individuals to become effective health and wellness coaches. Students will learn coaching methodologies, including motivational interviewing, goal setting, and behavior change theories. The curriculum also covers foundational knowledge in nutrition, fitness, stress management, and chronic disease prevention.',
    learningOutcomes: [
      'Apply effective coaching skills to support client behavior change.',
      'Understand foundational principles of nutrition and physical activity.',
      'Conduct client assessments and develop personalized wellness plans.',
      'Utilize motivational interviewing techniques.',
      'Adhere to ethical guidelines and professional standards for health coaching.'
    ],
    modules: [
      { title: 'Module 1: Foundations of Health Coaching', description: 'Coaching models, ethics, scope of practice.'},
      { title: 'Module 2: Nutrition & Physical Activity Science', description: 'Macronutrients, exercise guidelines.'},
      { title: 'Module 3: Behavior Change & Motivational Interviewing', description: 'Stages of change, communication skills.'},
      { title: 'Module 4: Stress Management & Wellbeing', description: 'Mindfulness, sleep hygiene, holistic wellness.'},
      { title: 'Module 5: Coaching Practicum & Business Development', description: 'Supervised coaching, marketing your practice.'},
    ]
  }
];

// DUMMY_APPLICATIONS: This data will now be managed in MongoDB.
// This array can be removed or used for one-time seeding if necessary.
export const DUMMY_APPLICATIONS: Application[] = [
  // {
  //   id: 'app-1', // Will be _id from MongoDB
  //   userId: 'student-1-db-id', // Reference to User _id
  //   programId: 'prog-1-db-id', // Reference to Program _id
  //   personalDetails: { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '1995-03-15', phone: '555-1234', address: '123 Main St, Anytown USA' },
  //   educationalBackground: { highestQualification: 'B.Sc. Computer Science', institution: 'State University', yearOfCompletion: '2017' },
  //   statementOfPurpose: 'I am passionate about web development and wish to transition my career into this field.',
  //   status: 'pending',
  //   referenceNumber: 'LF20240001',
  //   submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  // },
  // {
  //   id: 'app-2',
  //   userId: 'student-2-db-id',
  //   programId: 'prog-2-db-id',
  //   personalDetails: { firstName: 'Bob', lastName: 'Johnson', dateOfBirth: '1998-07-22', phone: '555-5678', address: '456 Oak Ave, Anytown USA' },
  //   educationalBackground: { highestQualification: 'B.A. Marketing', institution: 'Community College', yearOfCompletion: '2020' },
  //   statementOfPurpose: 'I want to enhance my marketing skills with digital strategies.',
  //   status: 'approved',
  //   referenceNumber: 'LF20240002',
  //   submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  // },
];

export const PROGRAM_CATEGORIES = ['All', 'Technology', 'Marketing', 'Data Science', 'Business', 'Creative Arts', 'Cybersecurity', 'Cloud Computing', 'Engineering', 'Culinary Arts', 'Languages', 'Music Production', 'Health & Wellness'];
export const PROGRAM_DURATIONS = ['All', 'Under 3 Months', '3-6 Months', '6-9 Months', 'Over 9 Months'];

export function getDurationCategory(duration: string): string {
  const monthsMatch = duration.match(/(\d+)\s*Months?/i);
  const weeksMatch = duration.match(/(\d+)\s*Weeks?/i);

  if (weeksMatch) {
    const numWeeks = parseInt(weeksMatch[1], 10);
    if (numWeeks < 12) return 'Under 3 Months'; // Approx 3 months
    if (numWeeks < 24) return '3-6 Months'; // Approx 6 months
    // Add more week categories if needed or map to month categories
  }
  
  if (monthsMatch) {
    const numMonths = parseInt(monthsMatch[1], 10);
    if (numMonths < 3) return 'Under 3 Months';
    if (numMonths <= 6) return '3-6 Months';
    if (numMonths <= 9) return '6-9 Months';
    return 'Over 9 Months';
  }
  // Default for durations like "1 Year" or if no match
  if (duration.toLowerCase().includes('year')) return 'Over 9 Months';
  return 'All'; 
}
