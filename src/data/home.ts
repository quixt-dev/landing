export const hero = {
  title: 'Landing Pages\nAnd MVPs For\nAI Startups',
  lead: 'I’m Dhiraj, And Quixt Is My One-Person Studio. I Design And Ship Launch Pages And First Products For AI And Agent-Infra Founders. Fixed Scope, Fixed Price, Code You Own.',
};

/** Studio film behind the hero photo. Hosted on Mux (public playback ID), played in the custom theatre player. */
export const film = {
  /** 16:9 cut: desktops, laptops, tablets and landscape phones. */
  playbackId: 'm6aI1oyPrXtg5sR01tHkHzeSO558ugEX00PaBmckCnz00A',
  /** 9:16 cut: phones held upright (portrait viewport under 768px), so nobody has to rotate. */
  portraitPlaybackId: '00kyvmDNQPD2OztwUiSQh5nm9XGbru9QDKVGx8o6AoGM',
  /** Mux asset ID (for the Mux dashboard / API; playback uses `playbackId`). */
  assetId: '9UpFQAM9CXwW4hy2PECBh4RUgTMtDukUOxh3M00diqTQ',
  label: 'Why Us',
  title: 'Why Quixt',
  eyebrow: '01 · Studio Film',
};

export const about = [
  {
    id: 'solo',
    graphic: 'globe' as const,
    text: '**One Builder, Shipping Worldwide.** No Account Managers And No Hand-Offs. You Work Directly With The Person **Designing And Writing Your Code.**',
  },
  {
    id: 'since-14',
    graphic: 'orbit' as const,
    text: '**Shipping Since 14.** My First Product, A Web Host, Reached **95,000+ Users.** Today I Build **AI Products Of My Own.**',
  },
];

export type ServiceArt = 'landing' | 'mvp' | 'speed' | 'handover';
export const servicesIntro = {
  title: 'Two Services.\nNothing Else.',
  lead: 'I Only Take On Work I Can Do Exceptionally Well: The Page That Launches Your AI Product, And The First Version Of The Product Itself.',
};
export const services: {
  title: string; slug: string; kicker: string; description: string; tags: string[];
  art: ServiceArt; price: number; timeline: string;
}[] = [
  {
    title: 'Landing Page Development', slug: 'landing-page', art: 'landing', price: 1499, timeline: '1–2 Weeks',
    kicker: 'Launches, Waitlists & Fundraises',
    description: 'A Fast Page That Explains Your Model, Agent Or API To Developers And Investors, Then Turns Them Into Sign-Ups.',
    tags: ['Framer', 'Astro', 'Next.js'],
  },
  {
    title: 'MVP Development', slug: 'mvp', art: 'mvp', price: 3499, timeline: '4–6 Weeks',
    kicker: 'Pre-Seed & Seed Teams',
    description: 'The First Real Version Of Your AI Product: One Core Workflow, Built End To End.',
    tags: ['Next.js', 'FastAPI', 'pgvector', 'LangGraph'],
  },
];

/** The two small bento tiles that sit between the services. */
export const serviceExtras: { title: string; kicker: string; icon: 'bolt' | 'branch'; text: string; art: ServiceArt; tags: string[] }[] = [
  { title: 'Fast By Default', kicker: 'Performance', icon: 'bolt', text: 'Static-First Builds That Load Instantly And Rank.', art: 'speed', tags: ['Static HTML', 'Edge CDN', 'Web Vitals'] },
  { title: 'Yours From Day One', kicker: 'Ownership', icon: 'branch', text: 'Your Repo, Your Accounts, A Live Preview Every Week.', art: 'handover', tags: ['GitHub', 'Vercel', 'Docs'] },
];

export const process = {
  title: 'From Idea\nTo Shipped,\nWith One Person',
  lead: 'The Same Person Scopes, Designs And Builds Your Product, So Nothing Gets Lost In A Hand-Off. You See Progress Every Week.',
  steps: [
    { title: 'Scope Call', text: '30 Minutes On Your Product, Users And Launch Date. You Leave With A Fixed Quote.' },
    { title: 'Design', text: 'Copy And Figma Screens For Your Review, Before Any Code Is Written.' },
    { title: 'Build', text: 'Weekly Demos On A Live Preview URL. You Comment, I Iterate.' },
    { title: 'Ship & Hand Over', text: 'Deployed On Your Accounts, With The Repo, Docs And 30 Days Of Support.' },
  ],
};

export const founder = {
  name: 'Dhiraj Hazarika',
  role: 'Founder, Quixt',
  linkedin: 'https://www.linkedin.com/in/dhirajbuilds/',
  title: 'Hi, I’m Dhiraj.\nYou’ll Work\nWith Me.',
  lead: 'With Quixt, I Design And Build Websites And MVPs For AI Startups, From The First Wireframe To The Production Deploy.',
  certs: ['Oracle Certified Generative AI Professional', 'Oracle AI Vector Search Certified'],
  /** Rendered as `git log`; each line is a real milestone from the founder's LinkedIn. */
  log: [
    { year: '2026', type: 'ship', text: 'Tessa, An AI Engine For On-Brand Ad Creatives' },
    { year: '2025', type: 'oss', text: 'Flowgentic, Open-Source Multi-Agent Orchestration' },
    { year: '2024', type: 'init', text: 'MyVakil, AI For Legal Workflows' },
    { year: '2021', type: 'role', text: 'Head Of Growth & Tech, InnovEAT Food Tech' },
    { year: '2020', type: 'init', text: 'Co-Founded myKampus' },
    { year: '2013', type: 'init', text: 'HostKart, Free Web Hosting, 95,000+ Users' },
  ],
};

export const pricing = {
  title: 'Two Packages,\nFixed Prices',
  lead: 'Starting Prices For A Typical Scope. After A Short Call You Get An Exact, Fixed Quote Before Any Work Starts.',
  note: 'Need Both? Start With The MVP And The Landing Page Is Quoted Alongside It.',
  plans: [
    { id: 'landing-page', name: 'Landing Page', bestFor: 'Launches, Waitlists & Fundraising', price: 1499, currency: 'USD', timeline: '1–2 Weeks', featured: false,
      features: ['Positioning & Copy', 'Custom Figma Design', 'Framer, Astro Or Next.js', 'Waitlist Or Demo Form', 'SEO + GEO For AI Search', '30 Days Of Support'] },
    { id: 'mvp', name: 'MVP', bestFor: 'Pre-Seed & Seed AI Startups', price: 3499, currency: 'USD', timeline: '4–6 Weeks', featured: true,
      features: ['One Core Workflow, End To End', 'Product Design In Figma', 'LLM, RAG Or Agent Integration', 'Auth, Database & Billing', 'Weekly Demos On A Live URL', 'Code Handover + 30 Days Support'] },
  ],
};

export const testimonials = [
  { quote: 'The Quixt Team Delivered A Scalable Product That Exceeded Our Expectations. Communication Was Smooth And Timelines Were Respected.', name: 'Jason Miller', role: 'Founder, Finex', avatar: 1 },
  { quote: 'They Helped Us Turn A Complex Idea Into A Clean, User-Friendly Platform. Outstanding Technical Expertise.', name: 'Daniel Khan', role: 'CEO, Growtly', avatar: 3 },
  { quote: 'They Delivered A Fast, Scalable Product With Exceptional Attention To Detail.', name: 'David Laid', role: 'Businessman', avatar: 6 },
  { quote: 'Fast Delivery, Clean Code, And Great Problem-Solving Skills. We’ll Definitely Work With Them Again.', name: 'David Laid', role: 'Businessman', avatar: 6 },
  { quote: 'A Development Team That Truly Understands Business Goals, Not Just Code.', name: 'Jason Miller', role: 'Businessman', avatar: 1 },
  { quote: 'From Backend Architecture To Final Deployment, Everything Was Handled Professionally. Highly Reliable Development Partner.', name: 'Alex Peterson', role: 'Product Manager, Taskflow', avatar: 5 },
];

export const faqs = [
  { q: 'Is Quixt Really Just One Person?', a: 'Yes. Quixt Is Run By Me, Dhiraj Hazarika. You Talk To The Person Designing And Writing Your Code From The First Call To Launch Day, Which Is Also Why I Only Take On A Few Projects At A Time.' },
  { q: 'Why Only AI And Agent-Infra Startups?', a: 'Because It’s What I Build For Myself. I Work With LLM APIs, RAG, Vector Search And Multi-Agent Orchestration Every Day, So I Can Explain Your Product To Developers And Investors, And Build It Without A Learning Curve.' },
  { q: 'What Does The $1,499 Landing Page Include?', a: 'Positioning And Copy, A Custom Design, A Fast Build In Framer (If You Want To Edit It Yourself) Or Astro / Next.js (If Your Engineers Will), A Working Waitlist Or Demo Form, SEO And GEO (So AI Search Engines Cite You), Deployed On Your Domain. Most Pages Take One To Two Weeks. Extra Pages Or Docs Are Quoted Up Front.' },
  { q: 'What Do I Get For $3,499 As An MVP?', a: 'One Core Workflow Built End To End: Auth, A Database, The LLM Or Agent Logic, A Clean UI And Deployment. Most MVPs Take Four To Six Weeks. Bigger Scopes Get A Fixed Quote Before Work Starts, Never An Hourly Bill.' },
  { q: 'Who Owns The Code?', a: 'You Do, 100%, From Day One. Everything Lives In Your GitHub, Your Hosting And Your Accounts, And You Get A Handover Walkthrough At Launch.' },
  { q: 'What Happens After Launch?', a: 'Every Project Includes 30 Days Of Free Support For Fixes And Small Tweaks. After That I Can Keep Building With You, Or Hand Over Cleanly To Your Own Engineers.' },
];
