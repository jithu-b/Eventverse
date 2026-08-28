import { ExicomMember } from '../types';

export const initialExicomMembers: ExicomMember[] = [
  {
    id: 1,
    number: '01',
    name: 'Aria Chen',
    role: 'Campus Lead',
    class: 'S5 CSE',
    department: 'Computer Science & Engineering',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop',
    hoverCaption: 'Leading the Annual Hackathon Keynote',
    description: 'Spearheading campus-wide technological innovation, student mentoring pipelines, and national hackathon delegations with a focus on open-source advocacy.',
    quote: 'Technology thrives when empathy and curiosity take center stage in how we build together.',
    keyInitiatives: [
      'Founded the 48-hour Flagship HackFest with 800+ participants',
      'Launched Campus Open-Source Guild & Mentorship Circles',
      'Secured 5 industry partnerships for student tech fellowships'
    ],
    skills: ['Strategic Leadership', 'Distributed Systems', 'Community Building', 'Public Speaking'],
    social: {
      instagram: 'https://instagram.com/aria.chen.tech',
      github: 'https://github.com/ariachen',
      linkedin: 'https://linkedin.com/in/ariachen-lead',
      email: 'aria.lead@techcommunity.org'
    }
  },
  {
    id: 2,
    number: '02',
    name: 'Rohan Verma',
    role: 'BIT Lead',
    class: 'S5 ECE',
    department: 'Electronics & Communication',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop',
    hoverCaption: 'Live Demo at Robotics & IoT Hardware Jam',
    description: 'Architecting embedded systems workshops, IoT innovation labs, and bridging software engineering with physical computing solutions.',
    quote: 'The frontier of engineering is where silicon hardware whispers directly to intelligent software.',
    keyInitiatives: [
      'Architected the Smart Campus Sensor Network prototype',
      'Led 12+ Hands-on Microcontroller & ESP32 Bootcamps',
      'Mentored 14 student research papers in embedded edge AI'
    ],
    skills: ['IoT Architecture', 'C/C++ Embedded', 'FPGA Design', 'Product Prototyping'],
    social: {
      instagram: 'https://instagram.com/rohan.bit',
      github: 'https://github.com/rohanverma-dev',
      linkedin: 'https://linkedin.com/in/rohanverma-bit',
      email: 'rohan.bit@techcommunity.org'
    }
  },
  {
    id: 3,
    number: '03',
    name: 'Meera Nair',
    role: 'Learning Coordinator',
    class: 'S5 CSE',
    department: 'Computer Science & Engineering',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    hoverCaption: 'Conducting Full-Stack Mastery Bootcamp',
    description: 'Curating cutting-edge learning roadmaps, peer-to-peer coding bootcamps, masterclasses, and technical writing circles for hundreds of aspiring engineers.',
    quote: 'True learning happens when complex ideas are demystified through playful, hands-on experimentation.',
    keyInitiatives: [
      'Authored the 100-Day Web3 & AI Developer Roadmap',
      'Orchestrated 24 weekly live code labs across 4 domains',
      'Pioneered the Peer-Code Review mentorship network'
    ],
    skills: ['Curriculum Design', 'Full-Stack TypeScript', 'Interactive Pedagogy', 'DevRel'],
    social: {
      instagram: 'https://instagram.com/meera.nair.dev',
      github: 'https://github.com/meeranair',
      linkedin: 'https://linkedin.com/in/meeranair-learn',
      email: 'meera.learn@techcommunity.org'
    }
  },
  {
    id: 4,
    number: '04',
    name: 'Kavya Patel',
    role: 'Head Coordinator',
    class: 'S5 AI & DS',
    department: 'Artificial Intelligence & Data Science',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
    hoverCaption: 'Organizing Tech Symposium Track Stages',
    description: 'Directing overarching event logistics, speaker curation for tech summits, and cross-functional synchronization between design, tech, and operations teams.',
    quote: 'Flawless execution is an invisible art that turns ambitious technical visions into unforgettable experiences.',
    keyInitiatives: [
      'Directed operations for the 3-day National Tech Summit',
      'Standardized community agile workflows and operational playbooks',
      'Managed a cross-discipline volunteer corps of 60+ leads'
    ],
    skills: ['Operations Strategy', 'Agile Program Mgmt', 'Event Architecture', 'Team Dynamics'],
    social: {
      instagram: 'https://instagram.com/kavya.patel.lead',
      github: 'https://github.com/kavyapatel',
      linkedin: 'https://linkedin.com/in/kavyapatel-coord',
      email: 'kavya.coord@techcommunity.org'
    }
  },
  {
    id: 5,
    number: '05',
    name: 'Devansh Rao',
    role: 'Head Coordinator',
    class: 'S5 IT',
    department: 'Information Technology',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop',
    hoverCaption: 'Team Brainstorming for Innovation Sprint',
    description: 'Powering technical infrastructure, competition judging platforms, sponsorship pipelines, and ensuring seamless execution across community initiatives.',
    quote: 'Behind every vibrant community lies a robust foundation of passion, discipline, and execution.',
    keyInitiatives: [
      'Engineered real-time automated hackathon judging portal',
      'Secured grants and tech cloud credits worth $25,000+',
      'Optimized budget allocation and vendor partnerships'
    ],
    skills: ['Cloud Architecture', 'DevOps & CI/CD', 'Strategic Sourcing', 'System Security'],
    social: {
      instagram: 'https://instagram.com/devansh.rao',
      github: 'https://github.com/devanshrao',
      linkedin: 'https://linkedin.com/in/devanshrao-coord',
      email: 'devansh.coord@techcommunity.org'
    }
  },
  {
    id: 6,
    number: '06',
    name: 'Ananya Joshi',
    role: 'Outreach Lead',
    class: 'S5 CSE',
    department: 'Computer Science & Engineering',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop',
    hoverCaption: 'Inter-College Tech Alliance Meetup',
    description: 'Expanding community horizons through inter-collegiate collaborations, global developer network alliances, branding narratives, and public relations.',
    quote: 'Stories connect us, but shared enthusiasm for creation is what unites curious minds across boundaries.',
    keyInitiatives: [
      'Expanded outreach across 35+ universities nationally',
      'Spearheaded the Women in Tech speaker series with 12 global leaders',
      'Grew active community engagement by 180% year-over-year'
    ],
    skills: ['Brand Storytelling', 'Public Relations', 'Alliance Building', 'Community Growth'],
    social: {
      instagram: 'https://instagram.com/ananya.outreach',
      github: 'https://github.com/ananyajoshi',
      linkedin: 'https://linkedin.com/in/ananyajoshi-outreach',
      email: 'ananya.outreach@techcommunity.org'
    }
  }
];
