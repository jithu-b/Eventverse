import { EventItem, Quiz, LeaderboardEntry, Certificate, TeamMember, ActivityItem, NotificationItem, UserProfile } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'ai-innovation-workshop-2026',
    title: 'AI Innovation Workshop',
    subtitle: 'Explore practical AI tools, LLMs & build your first agentic prototype',
    description: 'Explore practical AI tools, prompt engineering workflows, and build your first full-stack AI project directly on campus.',
    detailedAbout: 'Step into the future of autonomous systems and multimodal intelligence. In this intensive hands-on workshop led by industry engineers and TinkerHub mentors, participants will explore the latest generative frameworks, prompt chaining techniques, and API orchestrations. Every participant builds, tests, and deploys a live AI project before the day ends.',
    category: 'Workshops',
    status: 'Upcoming',
    date: '31 AUG 2026',
    rawDate: '2026-08-31',
    time: '10:00 AM · 04:30 PM',
    location: 'SBCE Main Seminar Hall',
    locationDetails: 'TinkerSpace Lab & Seminar Hall 1, Main Block, Sri Buddha College of Engineering',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    totalSpots: 150,
    registeredCount: 92,
    registrationOpen: true,
    featured: true,
    quizId: 'quiz-ai-foundations',
    hasAttendance: true,
    hasCertificate: true,
    entryFee: 'Free',
    organizer: {
      name: 'TinkerHub SBCE Core',
      role: 'Technical Community',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      contactEmail: 'tinkerhub@sbce.ac.in',
    },
    speakers: [
      {
        name: 'Dr. Rahul Chandran',
        role: 'Staff AI Researcher',
        companyOrDept: 'Google Developer Expert & SBCE Alum',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        bio: 'Leading machine learning workflows and open-source tooling across Southeast Asia tech chapters.',
      },
      {
        name: 'Ananya S. Pillai',
        role: 'Full-Stack GenAI Architect',
        companyOrDept: 'TinkerHub Kerala Mentor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        bio: 'Published author on low-latency embeddings and practical agent building for university ecosystems.',
      }
    ],
    whatYouWillLearn: [
      'Mastering LLM inference, embedding pipelines, and token budgeting',
      'Building automated agent workflows with tool calls and validation',
      'Deploying lightweight React + Python micro-services with Cloud Run',
      'Best security practices for securing secret keys and client requests',
    ],
    prerequisites: [
      'Basic familiarity with JavaScript or Python',
      'Laptop with Node.js / Python installed & active Wi-Fi',
      'GitHub account and curiosity to build cool stuff',
    ],
    schedule: [
      {
        time: '10:00 AM - 10:30 AM',
        title: 'Check-in & Keynote Kickoff',
        speakerOrLead: 'TinkerHub Execom',
        description: 'Badge issuance, coffee & opening address on the 2026 tech landscape.'
      },
      {
        time: '10:30 AM - 12:30 PM',
        title: 'Deep-dive: Multimodal Models & Architecture',
        speakerOrLead: 'Dr. Rahul Chandran',
        description: 'Under the hood of attention mechanisms, vector databases, and real-time inference.'
      },
      {
        time: '12:30 PM - 01:30 PM',
        title: 'Networking Lunch & TinkerHub Hangout',
        description: 'Connect with senior batch developers, faculty mentors, and project teammates.'
      },
      {
        time: '01:30 PM - 03:45 PM',
        title: 'Hands-on Sprint: Building & Deploying Your AI App',
        speakerOrLead: 'Ananya S. Pillai',
        description: 'Guided coding lab where every attendee ships a working application live.'
      },
      {
        time: '03:45 PM - 04:30 PM',
        title: 'Live Blitz Quiz & Certificate Showcase',
        speakerOrLead: 'EventVerse System',
        description: 'Real-time leaderboard quiz, distribution of digital credentials & wrap-up.'
      },
    ],
    tags: ['Artificial Intelligence', 'LLMs', 'Hands-on', 'Python', 'React', 'TinkerHub']
  },
  {
    id: 'hacksprint-sbce-2026',
    title: 'SBCE HackSprint 2026',
    subtitle: '24-hour campus hackathon solving regional sustainability & campus tech',
    description: 'Form teams of up to 4, brainstorm innovative solutions, and code through the night with pizza, mentorship, and ₹50,000 in cash bounties.',
    detailedAbout: 'HackSprint 2026 is TinkerHub SBCE’s flagship 24-hour hackathon bringing together over 200 builders from across Kerala. Tracks include Smart Campus Systems, Climate & Agri-Tech, Web3 Decentralized Identity, and Open Innovation.',
    category: 'Hackathons',
    status: 'Upcoming',
    date: '12 SEP 2026',
    rawDate: '2026-09-12',
    time: '09:00 AM (24 Hours)',
    location: 'SBCE Innovation Arena & CS Block',
    locationDetails: 'Computer Science Department Labs 1-4 & Central Quadrangle',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
    totalSpots: 200,
    registeredCount: 168,
    registrationOpen: true,
    featured: true,
    quizId: 'quiz-hacksprint-trivia',
    hasAttendance: true,
    hasCertificate: true,
    entryFee: 'Free',
    organizer: {
      name: 'TinkerHub SBCE Hackathon Wing',
      role: 'Hackathon Committee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      contactEmail: 'hacksprint@sbce.ac.in',
    },
    speakers: [
      {
        name: 'Vivek Mohan',
        role: 'VP of Engineering',
        companyOrDept: 'Kerala Startup Mission Mentor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bio: 'Startup accelerator judge with over 15 funded portfolio startups in southern India.',
      }
    ],
    whatYouWillLearn: [
      'Rapid prototype design from problem statement to functional MVP in 24 hours',
      'Pitching to venture capitalists, angel scouts, and senior architects',
      'Git collaboration with team branch merges and continuous deployment',
      'Hardware-software integration with IoT sensors and microcontrollers',
    ],
    prerequisites: ['Team of 2-4 students (solo registrants can match on Discord/in-person)', 'Student ID Card'],
    schedule: [
      { time: '09:00 AM', title: 'Opening Ceremony & Track Announcement', description: 'Problem statements unlocked.' },
      { time: '11:00 AM', title: 'Hacking Begins', description: 'Mentors circulate for architecture validation.' },
      { time: '07:00 PM', title: 'Round 1 Checkpoint', description: 'Progress review with industry leads.' },
      { time: '09:00 AM (Next Day)', title: 'Final Pitching & Expo', description: 'Live demos on stage.' }
    ],
    tags: ['Hackathon', 'Cash Prize', '24-Hours', 'Innovation', 'Teamwork']
  },
  {
    id: 'cloud-devops-bootcamp-2026',
    title: 'Cloud Native & DevOps Bootcamp',
    subtitle: 'Containerization, Kubernetes, CI/CD pipelines & Infrastructure as Code',
    description: 'Learn Docker, GitHub Actions, and Kubernetes clusters in a weekend crash course designed for aspiring cloud architects.',
    detailedAbout: 'Master modern cloud infrastructure! From setting up robust automated deployment pipelines to orchestrating Docker containers at scale, this bootcamp covers everything needed to take your apps from localhost to global production.',
    category: 'Workshops',
    status: 'Upcoming',
    date: '19 SEP 2026',
    rawDate: '2026-09-19',
    time: '01:30 PM · 05:30 PM',
    location: 'Cloud Computing Lab (Lab 3)',
    locationDetails: 'CS Block, 2nd Floor, Sri Buddha College of Engineering',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    totalSpots: 80,
    registeredCount: 74,
    registrationOpen: true,
    featured: false,
    quizId: 'quiz-devops-mastery',
    hasAttendance: true,
    hasCertificate: true,
    entryFee: 'Free',
    organizer: {
      name: 'TinkerHub SBCE DevOps Chapter',
      role: 'Cloud Group',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      contactEmail: 'cloud@sbce.ac.in',
    },
    speakers: [
      {
        name: 'Kiran Kurian',
        role: 'Lead Cloud Architect',
        companyOrDept: 'Red Hat Certified Engineer',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      }
    ],
    whatYouWillLearn: [
      'Writing production-ready Dockerfiles with multi-stage builds',
      'Automating tests and deployments using GitHub Actions workflows',
      'Managing secrets, environment variables, and cloud load balancing',
    ],
    prerequisites: ['Basic Linux terminal commands', 'GitHub account'],
    schedule: [
      { time: '01:30 PM', title: 'Containers vs Virtual Machines', description: 'Understanding Linux namespaces.' },
      { time: '02:45 PM', title: 'Hands-on: Dockerizing Web Services', description: 'Build and tag your images.' },
      { time: '04:15 PM', title: 'CI/CD Pipelines with GitHub Actions', description: 'Auto-deploy to cloud.' }
    ],
    tags: ['DevOps', 'Docker', 'Cloud', 'Kubernetes', 'CI/CD']
  },
  {
    id: 'cybersec-ctf-championship',
    title: 'CyberSec CTF 2026: Campus Defense',
    subtitle: 'Capture the Flag competition featuring web exploit, cryptography & forensics',
    description: 'Put your ethical hacking and cybersecurity problem-solving skills to the test in this gamified campus CTF tournament.',
    detailedAbout: 'Engage in ethical hacking challenges tailored for all skill levels from beginners to advanced penetration testers. Find hidden flags in vulnerable web servers, reverse-engineer obfuscated binaries, and crack cryptographic ciphers.',
    category: 'Competitions',
    status: 'Upcoming',
    date: '26 SEP 2026',
    rawDate: '2026-09-26',
    time: '11:00 AM · 04:00 PM',
    location: 'Cyber Defense Lab & Virtual Arena',
    locationDetails: 'Online portal + SBCE Lab 2 for live spectators and competitors',
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
    totalSpots: 120,
    registeredCount: 88,
    registrationOpen: true,
    featured: false,
    quizId: 'quiz-cybersec-trivia',
    hasAttendance: true,
    hasCertificate: true,
    entryFee: 'Free',
    organizer: {
      name: 'TinkerHub Cyber Security Club',
      role: 'Security Chapter',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      contactEmail: 'security@sbce.ac.in',
    },
    speakers: [
      {
        name: 'Gautam N.',
        role: 'Bug Bounty Hunter & Cyber Consultant',
        companyOrDept: 'Kerala Police CyberDome Fellow',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      }
    ],
    whatYouWillLearn: [
      'SQL injection, XSS vulnerabilities, and web application firewalls',
      'Wireshark packet sniffing and forensic analysis of PCAP files',
      'Modern cryptography, hashing algorithms, and RSA key mechanics',
    ],
    prerequisites: ['Basic networking knowledge', 'Kali Linux (VM or live USB recommended)'],
    schedule: [
      { time: '11:00 AM', title: 'Rules & Target Environment Walkthrough', description: 'Platform unlocks.' },
      { time: '11:30 AM', title: 'CTF Live Hacking Round', description: 'Live scoreboard updating in real-time.' },
      { time: '03:30 PM', title: 'Walkthroughs & Vulnerability Debrief', description: 'Solutions explained by top scorers.' }
    ],
    tags: ['Cybersecurity', 'CTF', 'Ethical Hacking', 'Competition', 'Prizes']
  },
  {
    id: 'tinkertalk-scaling-systems',
    title: 'TinkerTalk: Scaling Systems to 1M Users',
    subtitle: 'An intimate fireside talk with senior staff architects and engineers',
    description: 'Learn the architectural patterns behind high-throughput microservices, distributed databases, caching strategies, and load balancing.',
    detailedAbout: 'Ever wondered what happens when millions of users click a button simultaneously? Join us for an exclusive technical fireside session on distributed architectures, Redis caching layers, database sharding, and real-time reliability.',
    category: 'Tech Talks',
    status: 'Upcoming',
    date: '03 OCT 2026',
    rawDate: '2026-10-03',
    time: '04:30 PM · 06:00 PM',
    location: 'Mechanical Auditorium & YouTube Live',
    locationDetails: 'Auditorium 2, Mechanical Block, SBCE',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
    totalSpots: 250,
    registeredCount: 195,
    registrationOpen: true,
    featured: false,
    quizId: 'quiz-sysdesign-trivia',
    hasAttendance: true,
    hasCertificate: true,
    entryFee: 'Free',
    organizer: {
      name: 'TinkerHub SBCE Talks Committee',
      role: 'Speaker Series',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      contactEmail: 'talks@sbce.ac.in',
    },
    speakers: [
      {
        name: 'Rhea Jacob',
        role: 'Principal Engineer',
        companyOrDept: 'Stripe Payments Infrastructure',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      }
    ],
    whatYouWillLearn: [
      'CAP theorem in production: Balancing latency vs consistency',
      'Event-driven architectures using Kafka and RabbitMQ queues',
      'Database connection pooling and zero-downtime database migrations',
    ],
    prerequisites: ['Open to all engineering students across all semesters'],
    schedule: [
      { time: '04:30 PM', title: 'Welcome & Introduction', description: 'TinkerHub community updates.' },
      { time: '04:45 PM', title: 'Fireside Talk: High-Availability Architecture', description: 'System diagrams and code.' },
      { time: '05:35 PM', title: 'Open Q&A with Audience', description: 'Ask anything about careers, tech, and engineering.' }
    ],
    tags: ['System Design', 'Backend', 'Fireside', 'Tech Talk', 'Career']
  },
  {
    id: 'flutter-mobile-next',
    title: 'Flutter & Mobile Next Masterclass',
    subtitle: 'Cross-platform UI design, smooth animations, and Riverpod state management',
    description: 'Build sleek native apps for iOS and Android using Flutter 3.x with declarative state and offline-first SQLite synchronization.',
    detailedAbout: 'Master modern cross-platform mobile development! Learn how to construct buttery smooth 120 FPS animations, manage complex UI state cleanly with Riverpod, and integrate device hardware like camera, GPS, and biometrics.',
    category: 'Workshops',
    status: 'Upcoming',
    date: '10 OCT 2026',
    rawDate: '2026-10-10',
    time: '09:30 AM · 01:30 PM',
    location: 'IoT & Embedded Lab (EC Block)',
    locationDetails: 'Electronics & Communication Block, Ground Floor',
    bannerImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
    totalSpots: 70,
    registeredCount: 65,
    registrationOpen: true,
    featured: false,
    hasAttendance: true,
    hasCertificate: true,
    entryFee: 'Free',
    organizer: {
      name: 'TinkerHub Mobile Guild',
      role: 'App Dev Wing',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      contactEmail: 'mobile@sbce.ac.in',
    },
    speakers: [
      {
        name: 'Arjun S. Nair',
        role: 'Mobile Lead',
        companyOrDept: 'Google Developer Group Trivandrum',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      }
    ],
    whatYouWillLearn: [
      'Custom widget trees and implicit/explicit animation controllers',
      'Clean Architecture with Riverpod & repository patterns',
      'Publishing workflow to Google Play Store & TestFlight',
    ],
    prerequisites: ['Dart basics or object-oriented programming fundamentals'],
    schedule: [
      { time: '09:30 AM', title: 'Flutter Widget Architecture', description: 'Stateless vs Stateful deeper look.' },
      { time: '11:00 AM', title: 'Interactive App Build Lab', description: 'Live coding an Event Discovery Companion.' },
      { time: '01:00 PM', title: 'Showcase & Wrap Up', description: 'App previews and quiz.' }
    ],
    tags: ['Flutter', 'Mobile', 'Dart', 'UI/UX', 'Cross-Platform']
  },
  {
    id: 'open-source-fiesta-2026',
    title: 'Open Source Fiesta & Hacktober Sprint',
    subtitle: 'Demystifying Git, GitHub PRs & making your first open source contribution',
    description: 'Learn how to find beginner-friendly open issues, write clear pull requests, and contribute to global open source projects.',
    detailedAbout: 'Open source powers virtually every software system on earth. This workshop takes beginners through the exact steps of cloning repos, setting up development environments, resolving bugs, and contributing to worldwide repositories with confidence.',
    category: 'Social',
    status: 'Completed',
    date: '18 AUG 2026',
    rawDate: '2026-08-18',
    time: '02:00 PM · 05:00 PM',
    location: 'Central Library Digital Learning Hall',
    locationDetails: 'Central Library, SBCE Campus',
    bannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    totalSpots: 100,
    registeredCount: 100,
    registrationOpen: false,
    featured: false,
    quizId: 'quiz-git-mastery',
    hasAttendance: true,
    hasCertificate: true,
    entryFee: 'Free',
    organizer: {
      name: 'TinkerHub SBCE Open Source Wing',
      role: 'Open Source Community',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      contactEmail: 'opensource@sbce.ac.in',
    },
    speakers: [
      {
        name: 'Devika Menon',
        role: 'Open Source Advocate',
        companyOrDept: 'GitHub Campus Expert',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      }
    ],
    whatYouWillLearn: [
      'Advanced Git commands: rebase, cherry-pick, and interactive stash',
      'Writing clear issue templates and pull request descriptions',
      'Contributing to real open-source repositories during the session',
    ],
    prerequisites: ['GitHub account created'],
    schedule: [
      { time: '02:00 PM', title: 'Open Source Philosophy & Ecosystem', description: 'Why open source matters.' },
      { time: '03:00 PM', title: 'Hands-on Git Masterclass', description: 'Terminal workflows.' },
      { time: '04:15 PM', title: 'Live PR Sprint', description: 'Merging contributions.' }
    ],
    tags: ['Open Source', 'Git', 'GitHub', 'Community', 'Hacktober']
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-ai-foundations',
    eventId: 'ai-innovation-workshop-2026',
    eventTitle: 'AI Innovation Workshop',
    title: 'AI & Neural Foundations Blitz',
    description: 'Test your understanding of modern GenAI concepts, embeddings, temperature, and agentic workflows.',
    timeLimitMinutes: 3,
    totalQuestions: 5,
    passingScore: 3,
    activeStatus: true,
    participantAttemptsCount: 142,
    topScore: 5,
    questions: [
      {
        id: 'q1',
        question: 'What does "Temperature" parameter regulate in Large Language Model sampling?',
        options: [
          'The CPU hardware temperature of the model server',
          'The randomness vs determinism of generated next-token probabilities',
          'The number of tokens the model is allowed to output per second',
          'The maximum context window size of the embedding model'
        ],
        correctIndex: 1,
        explanation: 'Temperature scales the logits before the softmax step. A lower temperature (e.g. 0.2) makes responses focused and deterministic, while higher values (e.g. 0.9) increase creativity and randomness.',
        points: 20
      },
      {
        id: 'q2',
        question: 'In modern Retrieval-Augmented Generation (RAG) pipelines, what is the role of Vector Embeddings?',
        options: [
          'To compress video files into MP4 format',
          'To convert text chunks into high-dimensional numerical coordinates preserving semantic meaning',
          'To encrypt user passwords using SHA-256',
          'To directly execute Python code in the browser'
        ],
        correctIndex: 1,
        explanation: 'Vector embeddings map textual semantic meaning into dense mathematical vectors so similar concepts cluster closely in high-dimensional vector space.',
        points: 20
      },
      {
        id: 'q3',
        question: 'Which mechanism enables Transformer architectures to process entire sequences concurrently rather than step-by-step?',
        options: [
          'Recurrent Hidden States',
          'Multi-Head Self-Attention',
          'Markov Decision Chains',
          'Binary Search Trees'
        ],
        correctIndex: 1,
        explanation: 'Self-Attention computes relationship weights across all positions in the sequence simultaneously, eliminating the sequential bottleneck of legacy RNNs.',
        points: 20
      },
      {
        id: 'q4',
        question: 'What is "Tool Calling" (Function Calling) in modern AI agents?',
        options: [
          'Having the LLM emit structured JSON specifying a function name and arguments for external execution',
          'Translating English into C++ compiler bytecode directly',
          'Calling customer support via voice synthesizer',
          'Restarting the web server automatically on crash'
        ],
        correctIndex: 0,
        explanation: 'Tool Calling enables the model to intelligently choose which tool to execute and structure the exact required parameters as structured schema/JSON.',
        points: 20
      },
      {
        id: 'q5',
        question: 'Which of the following best describes "Hallucination" in generative models?',
        options: [
          'When the user inputs invalid syntax',
          'When the model confidently generates plausible-sounding yet factually inaccurate or fabricated information',
          'When the network connection drops mid-stream',
          'When the model refuses to answer a prompt'
        ],
        correctIndex: 1,
        explanation: 'Hallucination occurs when an LLM produces confident assertions that are not grounded in real training data or retrieved context.',
        points: 20
      }
    ]
  },
  {
    id: 'quiz-hacksprint-trivia',
    eventId: 'hacksprint-sbce-2026',
    eventTitle: 'SBCE HackSprint 2026',
    title: 'HackSprint Tech Trivia',
    description: 'Speed test on web engineering, REST APIs, and database fundamentals.',
    timeLimitMinutes: 2,
    totalQuestions: 4,
    passingScore: 3,
    activeStatus: true,
    participantAttemptsCount: 89,
    topScore: 4,
    questions: [
      {
        id: 'q10',
        question: 'Which HTTP status code signifies that a resource was successfully created?',
        options: ['200 OK', '201 Created', '204 No Content', '304 Not Modified'],
        correctIndex: 1,
        explanation: 'HTTP 201 Created is the standard REST response indicating that the request has succeeded and led to the creation of a new resource.',
        points: 25
      },
      {
        id: 'q11',
        question: 'What is the primary benefit of indexing a database column?',
        options: [
          'Faster query retrieval speeds on search lookups at the cost of slight write overhead',
          'Automatic data compression to save disk space',
          'Enforcing strict encryption on all string values',
          'Allowing unlimited null entries'
        ],
        correctIndex: 0,
        explanation: 'Database indexes create balanced tree (B-Tree) lookups that reduce search time from O(N) to O(log N).',
        points: 25
      },
      {
        id: 'q12',
        question: 'In Git, what does "git stash" perform?',
        options: [
          'Permanently deletes the entire repository',
          'Temporarily shelves uncommitted changes so you can work on another branch with a clean working directory',
          'Uploads code straight to GitHub production branch',
          'Generates release documentation'
        ],
        correctIndex: 1,
        explanation: 'Git stash saves dirty working directory state onto a temporary stack for later re-application.',
        points: 25
      },
      {
        id: 'q13',
        question: 'Which CSS property creates hardware-accelerated fluid GPU animations?',
        options: ['margin-top', 'transform & opacity', 'padding-left', 'border-width'],
        correctIndex: 1,
        explanation: 'Transform and opacity do not trigger browser layout reflows or repaints, allowing the GPU compositor to render them smoothly.',
        points: 25
      }
    ]
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u-1',
    userName: 'Aaditya Nair',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    year: 'S7 (Final Year)',
    points: 2450,
    eventsAttended: 14,
    quizzesWon: 9,
    badges: ['AI Grandmaster', 'HackSprint Champion', 'Campus Polymath', '10x Streak'],
    streak: 12
  },
  {
    rank: 2,
    userId: 'u-2',
    userName: 'Nandana Suresh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Artificial Intelligence & Data Science',
    year: 'S5 (3rd Year)',
    points: 2180,
    eventsAttended: 12,
    quizzesWon: 7,
    badges: ['Fullstack Wizard', 'Top Bug Hunter', 'Code Innovator'],
    streak: 8
  },
  {
    rank: 3,
    userId: 'u-3',
    userName: 'Farhan Mohammed',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    department: 'Electronics & Communication',
    year: 'S5 (3rd Year)',
    points: 1940,
    eventsAttended: 11,
    quizzesWon: 6,
    badges: ['IoT Architect', 'Prompt Engineer', 'Fast Learner'],
    streak: 6
  },
  {
    rank: 4,
    userId: 'u-4',
    userName: 'Meera Krishnan',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    year: 'S3 (2nd Year)',
    points: 1720,
    eventsAttended: 9,
    quizzesWon: 5,
    badges: ['UI/UX Prodigy', 'Workshop Star'],
    streak: 5
  },
  {
    rank: 5,
    userId: 'u-5',
    userName: 'Rohit Varma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Information Technology',
    year: 'S7 (Final Year)',
    points: 1590,
    eventsAttended: 8,
    quizzesWon: 4,
    badges: ['Cloud Pioneer', 'Open Source Fan'],
    streak: 4
  },
  {
    rank: 6,
    userId: 'u-6',
    userName: 'Sneha Thomas',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Robotics & Automation',
    year: 'S3 (2nd Year)',
    points: 1420,
    eventsAttended: 7,
    quizzesWon: 4,
    badges: ['Robotics Core', 'TinkerHub Builder'],
    streak: 3
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-001',
    certificateCode: 'TH-SBCE-2026-AI9921',
    eventTitle: 'AI Innovation Workshop & Hack',
    eventId: 'ai-innovation-workshop-2026',
    recipientName: 'Jithu Biju',
    recipientEmail: 'jithubiju0102@gmail.com',
    issueDate: '31 Aug 2026',
    category: 'Workshops',
    verificationStatus: 'Verified',
    credentialUrl: 'https://eventverse.tinkerhub-sbce.org/verify/TH-SBCE-2026-AI9921',
    gradeOrRank: 'Grade A+ with Distinction'
  },
  {
    id: 'cert-002',
    certificateCode: 'TH-SBCE-2026-OS8812',
    eventTitle: 'Open Source Fiesta & Hacktober Sprint',
    eventId: 'open-source-fiesta-2026',
    recipientName: 'Jithu Biju',
    recipientEmail: 'jithubiju0102@gmail.com',
    issueDate: '18 Aug 2026',
    category: 'Social',
    verificationStatus: 'Verified',
    credentialUrl: 'https://eventverse.tinkerhub-sbce.org/verify/TH-SBCE-2026-OS8812',
    gradeOrRank: 'Active Contributor'
  },
  {
    id: 'cert-003',
    certificateCode: 'TH-SBCE-2026-DEV4419',
    eventTitle: 'Full-Stack React & Node Accelerator',
    eventId: 'react-node-accelerator-2026',
    recipientName: 'Jithu Biju',
    recipientEmail: 'jithubiju0102@gmail.com',
    issueDate: '02 Jul 2026',
    category: 'Workshops',
    verificationStatus: 'Verified',
    credentialUrl: 'https://eventverse.tinkerhub-sbce.org/verify/TH-SBCE-2026-DEV4419',
    gradeOrRank: 'Top 10% Scorer'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'current-user-sbce',
  name: 'Jithu Biju',
  email: 'jithubiju0102@gmail.com',
  role: 'participant',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  department: 'Computer Science & Engineering',
  year: 'S5 (3rd Year)',
  college: 'Sri Buddha College of Engineering, Pattoor',
  bio: 'Full-stack developer, open-source enthusiast, and active TinkerHub SBCE builder.',
  registeredEventIds: ['ai-innovation-workshop-2026', 'hacksprint-sbce-2026'],
  bookmarkedEventIds: ['cloud-devops-bootcamp-2026', 'cybersec-ctf-championship'],
  certificates: INITIAL_CERTIFICATES,
  quizScores: [
    { quizId: 'quiz-ai-foundations', score: 100, maxScore: 100, date: '2026-08-20', passed: true },
    { quizId: 'quiz-hacksprint-trivia', score: 75, maxScore: 100, date: '2026-08-22', passed: true }
  ],
  attendanceRecords: [
    {
      id: 'att-1',
      eventId: 'open-source-fiesta-2026',
      eventTitle: 'Open Source Fiesta & Hacktober Sprint',
      userId: 'current-user-sbce',
      userName: 'Jithu Biju',
      userEmail: 'jithubiju0102@gmail.com',
      timestamp: '2026-08-18 14:05 PM',
      status: 'Present',
      method: 'QR Scan'
    }
  ]
};

export const EXECOM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Prof. Sreekanth R.',
    role: 'Faculty Advisor',
    subRole: 'Head of Innovation & Tech',
    department: 'Department of Computer Science & Engineering',
    year: 'Faculty Lead',
    bio: 'Guiding student tech initiatives, innovation incubators, and campus entrepreneurship at SBCE for over 8 years.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    skills: ['Mentorship', 'Curriculum Innovation', 'Incubation Support'],
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  {
    id: 'team-2',
    name: 'Aaditya Nair',
    role: 'Campus Lead',
    subRole: 'Community Lead, TinkerHub SBCE',
    department: 'Computer Science & Engineering',
    year: 'Final Year (S7)',
    bio: 'Passionate about building inclusive developer communities, organizing hackathons, and empowering peers with modern tech.',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    skills: ['Community Leadership', 'Event Strategy', 'Full-Stack', 'Public Speaking'],
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com'
  },
  {
    id: 'team-3',
    name: 'Nandana Suresh',
    role: 'Technical Lead',
    subRole: 'AI & Web Architecture Lead',
    department: 'Artificial Intelligence & Data Science',
    year: '3rd Year (S5)',
    bio: 'AI builder and open-source contributor orchestrating workshops, bootcamps, and developer labs across campus.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    skills: ['Machine Learning', 'Python', 'React', 'Cloud Native'],
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  {
    id: 'team-4',
    name: 'Farhan Mohammed',
    role: 'Design & Media Lead',
    subRole: 'UI/UX & Brand Creative',
    department: 'Electronics & Communication',
    year: '3rd Year (S5)',
    bio: 'Crafting brand aesthetics, visual identities, design systems, and video stories for TinkerHub SBCE initiatives.',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
    skills: ['Figma', 'Design Systems', 'Brand Strategy', 'Motion Graphics'],
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    id: 'team-5',
    name: 'Meera Krishnan',
    role: 'Women In Tech (WIT) Lead',
    subRole: 'Diversity & Mentorship',
    department: 'Computer Science & Engineering',
    year: '2nd Year (S3)',
    bio: 'Fostering gender diversity in tech through hands-on coding circles, hackathon bootcamps, and mentorship programs.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    skills: ['Diversity Advocacy', 'Web Dev', 'Peer Mentoring', 'Public Speaking'],
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  {
    id: 'team-6',
    name: 'Rohit Varma',
    role: 'Operations & Logistics Lead',
    subRole: 'Event Management & Infrastructure',
    department: 'Information Technology',
    year: 'Final Year (S7)',
    bio: 'Ensuring seamless campus logistics, lab setup, venue coordination, and sponsorship relationships for all major events.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    skills: ['Logistics', 'Sponsorships', 'Auditorium Management', 'Budgeting'],
    linkedin: 'https://linkedin.com'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'g-1',
    title: 'AI Innovation Bootcamp Kickoff',
    event: 'AI Workshop 2026',
    date: 'Aug 2026',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    category: 'Workshops',
    likes: 124
  },
  {
    id: 'g-2',
    title: 'HackSprint Midnight Coding Hour',
    event: 'SBCE HackSprint',
    date: 'Jul 2026',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    category: 'Hackathons',
    likes: 189
  },
  {
    id: 'g-3',
    title: 'Certificate Distribution Ceremony',
    event: 'Cloud DevOps Masterclass',
    date: 'Jun 2026',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    category: 'Ceremony',
    likes: 95
  },
  {
    id: 'g-4',
    title: 'TinkerTalk Fireside Audience',
    event: 'Scaling Distributed Systems',
    date: 'May 2026',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    category: 'Tech Talks',
    likes: 142
  },
  {
    id: 'g-5',
    title: 'Open Source PR Merging Jam',
    event: 'Open Source Fiesta',
    date: 'Apr 2026',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    category: 'Social',
    likes: 210
  },
  {
    id: 'g-6',
    title: 'Women in Tech Mentorship Circle',
    event: 'WIT Connect SBCE',
    date: 'Mar 2026',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    category: 'Community',
    likes: 176
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Spot Confirmed! 🎉',
    message: 'You are registered for AI Innovation Workshop (31 AUG 2026). Check your Event Pass in Dashboard.',
    time: '10m ago',
    read: false,
    type: 'event'
  },
  {
    id: 'n-2',
    title: 'New Timed Quiz Live ⚡',
    message: 'The AI & Neural Foundations Blitz quiz is now active. Compete on the campus leaderboard!',
    time: '1h ago',
    read: false,
    type: 'quiz'
  },
  {
    id: 'n-3',
    title: 'Certificate Issued 📜',
    message: 'Your official certificate for Open Source Fiesta is verified and available for download.',
    time: '2d ago',
    read: true,
    type: 'certificate'
  },
  {
    id: 'n-4',
    title: 'HackSprint 2026 Registrations Open 🚀',
    message: '₹50,000 prize pool announced for 24hr campus hackathon. Limited to 200 builders.',
    time: '3d ago',
    read: true,
    type: 'announcement'
  }
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    user: 'Jithu Biju',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    action: 'registered for',
    target: 'AI Innovation Workshop 2026',
    timestamp: '15 mins ago',
    type: 'registration'
  },
  {
    id: 'act-2',
    user: 'Aaditya Nair',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    action: 'scored 100% on',
    target: 'AI & Neural Foundations Blitz Quiz',
    timestamp: '42 mins ago',
    type: 'quiz'
  },
  {
    id: 'act-3',
    user: 'Nandana Suresh',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    action: 'scanned QR Attendance for',
    target: 'Open Source Fiesta',
    timestamp: '2 hours ago',
    type: 'attendance'
  },
  {
    id: 'act-4',
    user: 'TinkerHub Core',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    action: 'published new event',
    target: 'SBCE HackSprint 2026',
    timestamp: '5 hours ago',
    type: 'event_created'
  }
];
