export const contactHero = {
  eyebrow: 'Contact · Start A Project',
  title: 'Tell Us Your Idea.\nWe’ll Handle\nThe Tech.',
  lead: 'No Specs, Wireframes Or Technical Know-How Needed. Describe It Like You Would To A Friend. We’ll Turn It Into A Clear Plan, A Fixed Price And A Timeline.',
  reassurance: ['Reply Within 24 Hours', 'Free 30-Min Call', 'NDA On Request'],
  availability: 'Accepting Projects · 2 Slots For November',
};

export const buildOptions = [
  { value: 'website', title: 'A Website', text: 'Marketing Site, Landing Page, Online Store', icon: 'browser' },
  { value: 'mobile-app', title: 'A Mobile App', text: 'iPhone & Android Apps', icon: 'phone' },
  { value: 'web-app', title: 'A Web App / SaaS', text: 'Dashboards, Portals, Platforms', icon: 'dashboard' },
  { value: 'not-sure', title: 'Not Sure Yet', text: 'We’ll Help You Decide', icon: 'question' },
] as const;

export const stages = [
  { value: 'idea', title: 'Just An Idea', text: 'Totally Fine. Most Projects Start Here.' },
  { value: 'designs', title: 'I Have Sketches Or Designs', text: 'Napkin Sketches Count Too.' },
  { value: 'existing', title: 'I Have A Product That Needs Work', text: 'Redesign, New Features Or A Rescue.' },
];

export const prompts = ['Who Is It For?', 'What Problem Does It Solve?', 'Apps You Like The Feel Of', 'Must-Have Features'];
export const budgets = ['Under $5K', '$5K – $15K', '$15K – $40K', '$40K+', 'Not Sure? Help Me Estimate'];
export const timelines = ['As Soon As Possible', '1 – 3 Months', '3 – 6 Months', 'I’m Flexible'];
export const contactMethods = ['Email', 'Phone Call', 'WhatsApp'];

export const promises = ['You Own 100% Of The Code & Designs', 'Fixed Price, No Surprise Invoices', 'Weekly Demos, In Plain English', 'Your Idea Stays Confidential'];

export const nextSteps = [
  { when: 'Day 0', title: 'We Reply', text: 'A Real Person Reads Your Brief And Replies Within 24 Hours, Usually Much Sooner.', youDo: 'Nothing' },
  { when: 'Day 1', title: 'Discovery Call', text: 'A Relaxed 30-Min Chat About Your Idea, Your Users And Your Goals. We Ask, You Talk.', youDo: 'Just Show Up' },
  { when: 'Day 3', title: 'Clear Proposal', text: 'Scope, Screens, A Fixed Price And Timeline, Written So Anyone Can Understand It.', youDo: 'Review & Ask' },
  { when: 'Week 1', title: 'Kick-Off', text: 'Meet Your Team, Get A Shared Project Board, And See A First Demo Within Two Weeks.', youDo: 'Say Hello' },
];

export const translations = [
  { say: 'I Want Customers To Book Appointments Online.', build: ['Booking Website', 'Calendar Sync', 'Payments', 'SMS Reminders'], weeks: '≈ 4 Weeks', from: 'From $3K' },
  { say: 'An App Like Uber, But For Dog Walkers.', build: ['Two-Sided Marketplace', 'iOS + Android', 'Live Maps', 'In-App Payments'], weeks: '≈ 12 Weeks', from: 'From $13K', featured: true },
  { say: 'I Track Inventory In Spreadsheets. It’s A Mess.', build: ['Custom Dashboard', 'Database', 'Barcode Scanning', 'Reports'], weeks: '≈ 6 Weeks', from: 'From $5K' },
  { say: 'I Want To Sell Online Courses To My Followers.', build: ['Learning Platform', 'Video Hosting', 'Subscriptions', 'Student Portal'], weeks: '≈ 8 Weeks', from: 'From $8K' },
];

export const glossary = [
  { term: 'MVP', aka: 'Minimum Viable Product', icon: 'mvp', definition: 'The Simplest Version Of Your Product That Real People Can Use. Launch Small, Learn Fast, Then Grow.' },
  { term: 'Frontend', aka: 'What Users See', icon: 'frontend', definition: 'Everything Your Users See And Tap: Screens, Buttons, Menus. Think Of It As The Shop Floor.' },
  { term: 'Backend', aka: 'The Engine Room', icon: 'backend', definition: 'Works Behind The Scenes To Store Data, Run The Logic And Keep Everything Secure.' },
  { term: 'API', aka: 'How Systems Talk', icon: 'api', definition: 'A Messenger Between Systems, Like Your App Asking A Payment Service To Charge A Card.' },
  { term: 'Hosting', aka: 'Where It Lives', icon: 'cloud', definition: 'Renting Reliable Computers On The Internet So Your Product Stays Online 24/7.', featured: true },
  { term: 'Maintenance', aka: 'Care After Launch', icon: 'gear', definition: 'Ongoing Updates, Fixes And Improvements After Launch, Like Servicing A Car.' },
];

export const contactFaqs = [
  { q: 'I Don’t Have A Technical Co-Founder. Is That Okay?', a: 'Absolutely. Most Of Our Clients Don’t. We Act As Your Technical Team From Planning To Launch, And Explain Every Decision In Plain English So You Stay In Control.' },
  { q: 'How Much Does It Cost To Build An App?', a: 'Most First Versions Start Between $3K And $13K: About $3K For A Booking Website, $5K For A Custom Dashboard, $8K For A Course Platform And $13K For A Two-Sided Mobile App. After A Free Call You Get A Fixed Price, Never An Open-Ended Hourly Bill.' },
  { q: 'Do I Need Designs Or A Spec Before Contacting You?', a: 'No. A Few Sentences About The Problem You Want To Solve Is Enough. We Turn Your Idea Into Screens, A Scope And A Plan Together.' },
  { q: 'Will I Own The Code And The Product?', a: 'Yes. You Own 100% Of The Code, Designs And Accounts From Day One, And This Is Written Into Every Contract.' },
  { q: 'What If My Idea Changes Halfway Through?', a: 'That’s Normal. We Work In Weekly Releases, So You Can Change Priorities Any Week. We Always Agree On Any Scope Or Price Change In Writing First.' },
  { q: 'What Happens After Launch?', a: 'Every Launch Includes 30 Days Of Free Support. After That You Can Choose A Monthly Care Plan Or Take Over With Your Own Team. We Hand Over Everything.' },
];
