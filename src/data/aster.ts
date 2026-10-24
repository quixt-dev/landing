/**
 * Aster, a Shopify theme by Quixt: documentation, support policy and FAQ.
 * One source of truth for /themes/aster/docs/ and /themes/aster/support/ (UI, JSON-LD and the support form all read it).
 * Keep the setting names here identical to the labels in the theme editor (Shopify Theme Store TS-21.5).
 */
export const aster = {
  name: 'Aster',
  version: '1.0.0',
  updated: 'October 2026',
  updatedShort: 'Oct 2026',
  platform: 'Shopify Online Store 2.0',
  presets: ['Aster', 'Aster Bone'] as const,
  docsPath: '/themes/aster/docs/',
  supportPath: '/themes/aster/support/',
  supportAction: '/api/theme-support',
  /** Business days we answer within (Shopify Theme Store TS-22.2). */
  responseDays: 2,
  tagline: 'A Calm, Photographic Theme For Small Shopify Stores',
};

export const asterFacts = [
  { label: 'Version', value: aster.version },
  { label: 'Presets', value: '2' },
  { label: 'Platform', value: 'OS 2.0' },
  { label: 'Updated', value: aster.updatedShort },
];

export type Block =
  | { type: 'p'; text: string }
  | { type: 'steps'; items: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'dl'; items: { term: string; text: string }[] }
  | { type: 'note'; title: string; text: string };

export type DocSection = { id: string; title: string; intro?: string; blocks: Block[] };

export const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    intro: 'Five steps from a fresh install to a store that looks like yours.',
    blocks: [
      {
        type: 'steps',
        items: [
          'In your Shopify admin go to Online Store, then Themes. Add Aster and publish it.',
          'Open the theme editor. In Theme settings add your logo, favicon and social sharing image.',
          'Build your menus in Online Store, then Navigation. Use three levels at most. The main menu handle is main-menu and the footer menu handle is footer.',
          'Add your products and collections. Every home page section uses product and collection pickers, so nothing is hard coded.',
          'Read through each section and replace the sample copy. All demo text is placeholder text and yours to change.',
        ],
      },
      { type: 'note', title: 'Before you publish', text: 'Preview your store on a phone as well as a laptop. Every Aster section is built to be edited in the theme editor, so you never need to touch code.' },
    ],
  },
  {
    id: 'presets',
    title: 'Presets',
    intro: 'Aster ships with two presets. Pick one when you add the theme. You can recolor either one afterwards.',
    blocks: [
      {
        type: 'dl',
        items: [
          { term: 'Aster', text: 'Dark moss and sage, photographic story sections, the day dial lineup and the routine builder.' },
          { term: 'Aster Bone', text: 'The same brand in a light colorway with its own pages: an arch hero home page, product, collection, search, cart, journal, article, About, Contact, The Science, Ingredients, 404 and password pages. Every part is a section you can edit.' },
        ],
      },
      { type: 'p', text: 'Both presets share the header, footer and typography. Switching preset in the theme editor replaces the layout of your templates, so choose before you add content.' },
    ],
  },
  {
    id: 'theme-settings',
    title: 'Theme Settings',
    intro: 'Open Theme settings in the editor. These apply to the whole store.',
    blocks: [
      {
        type: 'dl',
        items: [
          { term: 'Colors', text: 'Four color schemes: bone, sage, moss and lime. Each scheme pairs a background with a text color. Choose a scheme per section.' },
          { term: 'Typography', text: 'Heading font, Body font and Data label font all use the Shopify font picker.' },
          { term: 'Layout and cards', text: 'Page width and Card corners (Round, Soft or Sharp).' },
          { term: 'Buttons', text: 'Button corners: Pill or Soft.' },
          { term: 'Product media', text: 'Product image style: studio backdrop for the first image, studio backdrop for all images, or fill the frame.' },
          { term: 'Product cards', text: 'Enable quick view to open any product in a modal from collection pages.' },
          { term: 'Animations', text: 'Use reveal animations on scroll and Use hover effects. Motion is turned off automatically for visitors who ask their device for reduced motion.' },
          { term: 'Cart', text: 'Cart type (Drawer or Page), Show cart note, and the Free shipping threshold.' },
          { term: 'Gift card page', text: 'Design lets you switch the gift card page between the Aster and Bone designs.' },
          { term: 'Search', text: 'Predictive search style: Classic or Clean.' },
          { term: 'Social media, favicon and currency', text: 'Add your social profiles, upload a favicon and a social sharing image, and choose Show currency codes.' },
        ],
      },
    ],
  },
  {
    id: 'header-navigation',
    title: 'Header And Navigation',
    blocks: [
      {
        type: 'list',
        items: [
          'Logo or wordmark, main menu, search, account and bag.',
          'Choose a dropdown or a mega menu. The mega menu shows up to four columns from your menu and can feature an image card for each top-level link (add a Mega menu promo block).',
          'Keep the header visible on scroll, and turn Use transparent header over the home page hero on or off.',
          'The page you are on is underlined in the menu.',
          'Country and language selectors appear automatically when your store sells in more than one market or language.',
          'On phones the menu opens as a full-screen sheet.',
        ],
      },
    ],
  },
  {
    id: 'home-sections',
    title: 'Home Page Sections',
    intro: 'The Aster preset home page is built from these sections. The Aster Bone home page uses its own set, listed under Aster Bone below.',
    blocks: [
      {
        type: 'dl',
        items: [
          { term: 'Hero', text: 'Photographic hero with a product tag and a proof dock. Upload a Background image to change the scene.' },
          { term: 'Lineup', text: 'The day dial. Add one block per formula and pick the product.' },
          { term: 'Inside formula, First sixty days, Soil to seal', text: 'Story sections for ingredients, results over time and sourcing. Every number and sentence is editable text.' },
          { term: 'Routine builder', text: 'A short quiz. Each answer maps to products, and the finished routine goes to the cart in one click.' },
          { term: 'Answers and Final call to action', text: 'A questions section and a closing section with a button.' },
        ],
      },
      { type: 'note', title: 'Aster Bone home page', text: 'Hero, Scrolling text bar, Featured collection tabs, Story, Multicolumn, Collection list, Video, Quotes, Journal, FAQ and Newsletter sign-up. Add, remove or reorder them like any other section.' },
    ],
  },
  {
    id: 'section-library',
    title: 'Section Library',
    intro: 'Add these to any page in the theme editor. Each has color scheme, padding and layout options, and works on phones, tablets and laptops.',
    blocks: [
      {
        type: 'dl',
        items: [
          { term: 'Banners and media', text: 'Image banner, Slideshow, Image with text, Video, Image gallery, Scrolling text, Tabbed showcase.' },
          { term: 'Commerce', text: 'Featured collection, Featured products, Collection list, Comparison table.' },
          { term: 'Content', text: 'Multicolumn, Rich text, Testimonials, Logo list, Newsletter, FAQ, Featured blog, Store info.' },
          { term: 'Advanced', text: 'Custom Liquid for app snippets and custom code.' },
        ],
      },
    ],
  },
  {
    id: 'product-page',
    title: 'Product Page',
    intro: 'Everything on the product page is a block, so you can reorder it.',
    blocks: [
      {
        type: 'list',
        items: [
          'Media gallery with images, video and 3D models.',
          'Title, price (with compare-at and unit price), variant picker with swatches, quantity and buy buttons with accelerated checkout.',
          'Subscription picker, pickup availability, Shop Pay Installments, share buttons and Custom Liquid.',
          'App blocks can be added in the same places.',
          'Other sections on the template cover facts, how to take it, freshness, reviews, the routine builder, FAQ and related products.',
          'Gift card products show a recipient form for the email, name, message and send date.',
          'A product with one text option, such as Size, shows each choice as a card with its price.',
        ],
      },
    ],
  },
  {
    id: 'collections-search',
    title: 'Collections, Search And Filtering',
    blocks: [
      {
        type: 'list',
        items: [
          'Filter by availability, price, product type, vendor and variant options. Filters come from the Shopify Search & Discovery app, so add the ones you want there.',
          'Sort, load more or numbered pages, and a friendly empty state.',
          'Predictive search shows products, articles, pages and suggestions.',
          'Quick view opens any product in a modal with media, variants and add to bag.',
        ],
      },
    ],
  },
  {
    id: 'bone-preset',
    title: 'Aster Bone: Cards, Sets And The Quiz',
    intro: 'Extras for the Aster Bone preset.',
    blocks: [
      {
        type: 'dl',
        items: [
          { term: 'Product card metafields', text: 'All optional, in the namespace aster. code (single line text) shows above the title, for example AS-01. badge (single line text) replaces the automatic Sale and New tags; the value none hides them. scale (decimal) sets the size of the photo on the shelf, 1 is standard. lift (decimal) sets how high the photo stands, in percent of the card height.' },
          { term: 'Product photos', text: 'Use transparent cutouts, cropped to the product, so each product stands on the shelf.' },
          { term: 'Hotspots', text: 'On the product page the hotspot dots snap to the outline of your product photo, so they always sit on the edge of the product.' },
          { term: 'Quiz page', text: 'Create a page called Find your routine with the handle quiz and the template page.quiz. Then set the link of the Take the quiz buttons to that page. The questions, answers and products are blocks of the Routine builder section on that page.' },
        ],
      },
      { type: 'note', title: 'Button links', text: 'Links to your own pages, such as the quiz, are not stored in the theme. After you install it, open each Take the quiz button in the editor and choose your page.' },
    ],
  },
  {
    id: 'cart-checkout',
    title: 'Cart And Checkout',
    blocks: [
      { type: 'p', text: 'Choose a cart drawer or a cart page in Theme settings. Both show line items, selling plans, discounts, notes, tax messages and accelerated checkout buttons. The cart page also has a free shipping progress bar, suggestions and an empty state.' },
      { type: 'p', text: 'The progress bar uses your Free shipping threshold, plus up to two more amounts you set in the section. It shows only real amounts, and nothing is added for you.' },
    ],
  },
  {
    id: 'journal-pages',
    title: 'Journal And Pages',
    blocks: [
      { type: 'p', text: 'Blog and article templates include topic filters, reading time, a table of contents, comments with moderation messages, structured data and related stories. Generic page, contact and about templates are included, and the contact form can route topics to your inbox.' },
    ],
  },
  {
    id: 'special-pages',
    title: 'Gift Cards, 404 And Password Pages',
    blocks: [
      {
        type: 'list',
        items: [
          'The gift card page shows the code, balance, a scannable QR code, an Add to Apple Wallet button when available and a print layout.',
          'The 404 page offers search and shortcuts.',
          'The password page can switch to a Coming soon stage. Its countdown appears only when you set a real launch date.',
        ],
      },
    ],
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    blocks: [{ type: 'p', text: 'Create selling plans with a subscription app. The product page, cart and drawer show your plans automatically. Aster does not depend on a particular app.' }],
  },
  {
    id: 'accessibility-motion',
    title: 'Accessibility And Motion',
    blocks: [
      {
        type: 'list',
        items: [
          'Visible focus states, keyboard support for menus, dialogs, carousels and accordions, labeled forms, and contrast that meets WCAG AA.',
          'Reduced motion is respected everywhere.',
        ],
      },
    ],
  },
  {
    id: 'performance',
    title: 'Performance Tips',
    blocks: [
      {
        type: 'list',
        items: [
          'Upload images at the size shown in each setting.',
          'Keep the first section of every page light, because it is the largest paint.',
          'Avoid adding many apps that inject scripts.',
        ],
      },
    ],
  },
];

export const docsFaqs = [
  { q: 'Why is the header transparent on the home page?', a: 'Turn off “Use transparent header over the home page hero” in the header settings.' },
  { q: 'How do I change the hero image?', a: 'Select the Hero section in the editor and upload a Background image.' },
  { q: 'Where do I add reviews?', a: 'The product reviews section has an app block slot and a manual list, so you can use a reviews app or write them yourself.' },
  { q: 'How do I add a countdown?', a: 'Use the Coming soon stage on the password template and set a launch date. The countdown only appears when a real date is set.' },
  { q: 'Can I use my own fonts?', a: 'Pick any font from the Shopify font picker in Theme settings.' },
  { q: 'Why do some buttons link to the home page after I install the theme?', a: 'Links to your own pages are not stored in the theme. Open the button in the editor and choose a page.' },
  { q: 'Do I need an app to use Aster?', a: 'No. Every feature works without an app. Subscriptions, reviews and filters can use the app you prefer.' },
];

export const supportFaqs = [
  { q: 'How fast will you reply?', a: `We reply within ${aster.responseDays} business days. Business days are Monday to Friday, 10:00 to 19:00 IST.` },
  { q: 'What does support cover?', a: 'Questions about how Aster works, help with theme settings and sections, and fixes for bugs in the theme. Critical bugs are fixed first.' },
  { q: 'What is not included?', a: 'Custom design or development, app setup, store migrations and content writing are paid services. We quote them separately and they are never part of the theme price.' },
  { q: 'What should I include in my message?', a: 'Your store URL, the theme version from Theme settings, what you expected and what happened. A screenshot or a short screen recording helps a lot.' },
  { q: 'Is my store password safe?', a: 'Please do not send your password. If we need access, we will ask you for a collaborator request in your Shopify admin instead.' },
];

export const supportPolicy = [
  { term: 'Reply time', text: `Within ${aster.responseDays} business days.` },
  { term: 'Covered', text: 'Theme questions, setup help and bug fixes.' },
  { term: 'Bugs', text: 'Technical issues are fixed promptly, critical bugs straight away.' },
  { term: 'Not covered', text: 'Custom development, app setup and migrations, quoted separately.' },
];
