export const hero = {
  title: 'We Build\nDigital Products\nThat Power Growth',
  lead: 'Quixt Is A Development Agency Crafting High-Performance Websites, Apps, And Software Solutions For Startups And Growing Businesses.',
};

export const about = [
  {
    id: 'agency',
    graphic: 'globe' as const,
    text: 'We Are **World Class Development Agency.** MVPs To Enterprise Platforms, We Help Businesses Transform Ideas Into **Real-World Technology.**',
  },
  {
    id: 'team',
    graphic: 'orbit' as const,
    text: 'We’re A **Team Of Developers** And Digital Strategists Focused On Building Reliable, Scalable, And **Future-Ready Products.**',
  },
];

export type ServiceIcon = 'pen' | 'asterisk' | 'device' | 'sparkle' | 'frame' | 'arcs';
export const servicesIntro = {
  title: 'End-To-End\nDesign & Development',
  lead: 'Whatever You’re Dreaming Of Building, We’ll Help You Get There Faster, With Less Stress And A Product You’re Proud To Show The World.',
};
export const services: { title: string; slug: string; description: string; tags: string[]; icon: ServiceIcon }[] = [
  { title: 'UI/UX & Product Design', slug: 'product-design', icon: 'pen', description: 'See Your Idea Come Alive Before A Single Line Of Code. Figma Designs And Clickable Prototypes For Websites, Apps And Dashboards Your Users Will Love.', tags: ['Figma', 'Design Systems', 'Prototypes', 'Dashboards'] },
  { title: 'Web Development', slug: 'web-development', icon: 'asterisk', description: 'Your Website Is Your First Impression. We Make It Fast, Beautiful And Built To Turn Curious Visitors Into Customers Who Trust You.', tags: ['Next.Js', 'React', 'Webflow', 'Custom CMS'] },
  { title: 'Mobile App Development', slug: 'mobile-app-development', icon: 'device', description: 'Live On Your Customers’ Home Screens. Smooth iOS And Android Apps People Open Every Day, Not The Ones They Delete.', tags: ['Flutter', 'React Native', 'Native Apps'] },
  { title: 'SaaS Product Development', slug: 'saas-product-development', icon: 'sparkle', description: 'Stop Waiting For The Perfect Moment. Go From Idea To Your First Paying Customer With A SaaS Built To Grow As Fast As You Do.', tags: ['Product Architecture', 'MVPs', 'Subscriptions'] },
  { title: 'Custom Software Solutions', slug: 'custom-software', icon: 'frame', description: 'Get Your Evenings Back. Software Shaped Around How Your Business Really Works, So The Busywork Finally Runs Itself.', tags: ['Enterprise Systems', 'CRM', 'ERP'] },
  { title: 'Backend & API Development', slug: 'backend-api-development', icon: 'arcs', description: 'Sleep Well On Launch Day. Rock-Solid Backends That Stay Fast And Secure The Moment Your Big Break Brings The Traffic.', tags: ['Node.Js', 'REST APIs', 'Databases'] },
];

export const process = {
  title: 'How We\nTurn Ideas Into\nScalable Products',
  lead: 'We Follow A Transparent, Collaborative Process That Keeps You Involved At Every Stage, From Concept To Launch And Beyond.',
  steps: [
    { title: 'Discover & Align', text: 'We Start By Understanding Your Goals, Users, And Challenges.' },
    { title: 'Plan & Design', text: 'We Create Clear Design Blueprints Before Development Begins.' },
    { title: 'Build & Testing', text: 'Every Feature Is Tested For Quality, Security, And Usability.' },
    { title: 'Launch & Scale', text: 'We Launch Your Product Confidently And Support Its Growth Over Time.' },
  ],
};

export const pricing = {
  title: 'Simple,\nTransparent Pricing',
  lead: 'Choose A Plan That Fits Your Project Goals, No Hidden Costs, No Surprises.',
  plans: [
    { id: 'starter', name: 'Starter Plan', bestFor: 'Small Businesses & MVPs', price: 899, currency: 'USD', featured: false,
      features: ['Landing Page Or Small Website', 'Responsive Design', 'Basic Backend Setup', 'Performance Optimization', '1 Week Delivery', 'Email Support'] },
    { id: 'growth', name: 'Growth Plan', bestFor: 'Startups & Scaling Products', price: 2999, currency: 'USD', featured: true,
      features: ['Full Website Or Web App', 'Custom UI & UX', 'API & Database Integration', 'Authentication System', 'SEO & Performance Setup', '3 Weeks Delivery'] },
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
  { q: 'What Type Of Projects Do You Work On?', a: 'We Work On Websites, Mobile Apps, SaaS Platforms, Custom Software, And Scalable Backend Systems For Startups And Businesses.' },
  { q: 'How Do We Get Started?', a: 'Share Your Idea Through Our Contact Form Or Book A Free 30-Minute Call. We Reply Within 24 Hours, Then Send A Plain-English Proposal With Scope, A Fixed Price And A Timeline Within Three Days.' },
  { q: 'Do You Provide Design Along With Development?', a: 'Yes. Every Project Includes UX Research, UI Design And A Clickable Prototype Before Development Starts, So You See Your Product Before It Is Built.' },
  { q: 'Will You Provide Support After Launch?', a: 'Yes. Every Launch Includes 30 Days Of Free Support, And We Offer Monthly Maintenance Plans Covering Updates, Monitoring, Fixes And New Features.' },
  { q: 'What Technologies Do You Use?', a: 'We Use Proven, Well-Documented Tools: Next.js, React And Astro For The Web; React Native And Flutter For Mobile; Node.js, PostgreSQL And Redis On The Backend; And AWS For Hosting.' },
];
