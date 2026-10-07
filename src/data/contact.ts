export const contactHero = {
  eyebrow: 'Contact · Start A Project',
  title: 'Tell Me What\nYou’re Building.',
  lead: 'A Few Sentences Is Enough: What The Product Does, Who It’s For And When You Want To Launch. I’ll Reply Within 24 Hours With Questions, Then A Fixed Quote.',
  reassurance: ['Reply Within 24 Hours', 'Free 30-Min Call', 'NDA On Request'],
  availability: 'Accepting Projects · 2 Slots For November',
};

export const buildOptions = [
  { value: 'landing-page', title: 'A Landing Page', text: 'Launch, Waitlist Or Raise · From $1,499', icon: 'browser' },
  { value: 'mvp', title: 'An MVP', text: 'Your First Working Product · From $3,499', icon: 'dashboard' },
  { value: 'both', title: 'Both', text: 'The Product And The Page That Launches It', icon: 'stack' },
  { value: 'not-sure', title: 'Not Sure Yet', text: 'I’ll Help You Decide', icon: 'question' },
] as const;

export const stages = [
  { value: 'idea', title: 'An Idea Or A Prototype', text: 'A Notebook, A Prompt Chain Or A Napkin Sketch. All Fine.' },
  { value: 'designs', title: 'I Have Designs Or A Spec', text: 'Figma Files, A PRD Or A Loom Walkthrough.' },
  { value: 'existing', title: 'I Have A Product That Needs Work', text: 'Redesign, New Features Or A Rescue.' },
];

export const prompts = ['Who Is It For?', 'What Does The Model Or Agent Do?', 'Products You Like The Feel Of', 'Launch Date Or Deadline'];
export const budgets = ['$1,499 – $3,499', '$3,499 – $8K', '$8K+', 'Not Sure Yet'];
export const timelines = ['As Soon As Possible', 'Within A Month', '1 – 3 Months', 'I’m Flexible'];
export const contactMethods = ['Email', 'Phone Call', 'WhatsApp'];

export const promises = ['You Own 100% Of The Code & Designs', 'Fixed Price, No Surprise Invoices', 'Weekly Demos On A Live URL', 'Your Idea Stays Confidential'];

export const nextSteps = [
  { when: 'Day 0', title: 'I Reply', text: 'I Read Every Brief Myself And Reply Within 24 Hours, Usually Much Sooner.', youDo: 'Nothing' },
  { when: 'Day 1', title: 'Scope Call', text: '30 Minutes On Your Product, Your Users And Your Launch Date. I Ask, You Talk.', youDo: 'Just Show Up' },
  { when: 'Day 3', title: 'Fixed Quote', text: 'Scope, Deliverables, A Fixed Price And A Timeline, On A Single Page.', youDo: 'Review & Ask' },
  { when: 'Week 1', title: 'Kick-Off', text: 'A Shared Board And A Live Preview URL That Updates Every Time I Ship.', youDo: 'Say Hello' },
];

export const translations = [
  { say: 'We Launch On Product Hunt In Three Weeks And Have No Site.', build: ['Framer Or Astro', 'Waitlist', 'OG Images', 'Analytics'], weeks: '≈ 1–2 Weeks', from: 'From $1,499' },
  { say: 'Developers Don’t Get What Our Agent SDK Does.', build: ['Landing Page', 'Positioning', 'Code Samples', 'Docs Links'], weeks: '≈ 2 Weeks', from: 'From $1,499' },
  { say: 'Investors Want To See The Agent Actually Work.', build: ['MVP', 'Agent Workflow', 'Auth', 'Live Demo URL'], weeks: '≈ 4–6 Weeks', from: 'From $3,499', featured: true },
  { say: 'My Prompt Chain Works In A Notebook. Now I Need Users.', build: ['MVP', 'RAG Pipeline', 'Billing', 'Dashboard'], weeks: '≈ 5–6 Weeks', from: 'From $3,499' },
];

export const glossary = [
  { term: 'Astro', aka: 'Landing Pages', icon: 'mvp', definition: 'Ships Plain HTML With No Framework Overhead, So Your Page Loads Instantly And Ranks Well.' },
  { term: 'Next.js', aka: 'MVP Frontend', icon: 'frontend', definition: 'React With Server Rendering And API Routes: One Codebase For Your UI And Backend Logic.' },
  { term: 'Postgres', aka: 'Your Data', icon: 'backend', definition: 'One Reliable Database For Users And Billing, And With pgvector, Your Embeddings Too.' },
  { term: 'LangGraph', aka: 'Agent Workflows', icon: 'api', definition: 'Stateful Agent Graphs With Tools, Memory And Human-In-The-Loop Steps You Can Inspect.' },
  { term: 'Vercel', aka: 'Hosting', icon: 'cloud', definition: 'Edge Hosting With A Preview URL For Every Change, So You Review Real Builds, Not Screenshots.', featured: true },
  { term: 'Evals', aka: 'Quality Checks', icon: 'gear', definition: 'A Small Test Set Of Real Prompts, So A Model Or Prompt Change Never Silently Breaks Your Product.' },
];

export const contactFaqs = [
  { q: 'Do You Work With Technical Founders?', a: 'Mostly, Yes. Many AI Founders Can Code But Would Rather Spend Their Time On The Model, Research Or Sales. I Take The Product Surface And Infrastructure Off Your Plate, And We Agree On Conventions Up Front.' },
  { q: 'How Much Does It Cost?', a: 'Landing Pages Start At $1,499 And MVPs Start At $3,499. After A Free Call You Get A Fixed Price For Your Exact Scope, Never An Open-Ended Hourly Bill.' },
  { q: 'Can You Build Around Our Existing Model Or API?', a: 'Yes. I Build Around Whatever You Already Have: Your Own Model Endpoint, OpenAI Or Anthropic APIs, An Existing Python Backend Or A Vector Store You Already Use.' },
  { q: 'Will I Own The Code And The Product?', a: 'Yes. You Own 100% Of The Code, Designs And Accounts From Day One, And This Is Written Into Every Contract.' },
  { q: 'What If The Scope Changes Halfway Through?', a: 'That’s Normal For AI Products. I Work In Weekly Releases, So You Can Change Priorities Any Week. Any Scope Or Price Change Is Agreed In Writing First.' },
  { q: 'What Happens After Launch?', a: 'Every Launch Includes 30 Days Of Free Support. After That I Can Keep Building With You, Or Hand Everything Over To Your Own Engineers.' },
];
