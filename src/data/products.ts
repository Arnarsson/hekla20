/**
 * Every product, in one place.
 *
 * The front page rail and the individual product pages both read from this
 * file, which is what keeps the card copy, the crumb numbering and the page
 * content from drifting apart. Adding a product means adding one
 * entry here; the rail, the numbering and the page are all derived.
 *
 * A product with `page: null` appears in the rail but has no detail page yet,
 * so its card links straight to the contact section.
 */

import type { ImageMetadata } from 'astro';

import ivanCheremisin from '../assets/photos/ivan-cheremisin-w.jpg';
import janAntoninKolar from '../assets/photos/jan-antonin-kolar-w.jpg';
import jonathanCastaneda from '../assets/photos/jonathan-castaneda-w.jpg';
import julianMora from '../assets/photos/julian-mora-w.jpg';
import purpleChair from '../assets/photos/purple-chair-w.jpg';
import stepHandoverYuriy from '../assets/photos/step-handover-yuriy.jpg';
import tomW from '../assets/photos/tom-w-w.jpg';

/**
 * How the italic H monogram is stamped on this image. Measured, not guessed:
 * `paper` wherever the top-left corner of the photograph is dark enough that
 * a black mark would disappear into it.
 */
export type Monogram = 'ink' | 'paper';

interface MediaBase {
  alt: string;
  monogram?: Monogram;
  /**
   * Tear this image the way the masthead wordmark tears: seven bands, a few
   * pixels apart, for a third of a second every twenty seconds or so. One
   * glitching element per screen is the rule, and the masthead already takes
   * a turn, so at most one image on the site ever sets this.
   */
  tear?: boolean;
}

/** A still photograph, optimised at build time by astro:assets. */
export interface StillMedia extends MediaBase {
  kind: 'image';
  src: ImageMetadata;
}

/**
 * A moving clip. `name` resolves to /media/<name>.mp4, .webm and .jpg, all
 * three produced from the master in media-src/ by `npm run media`.
 */
export interface MotionMedia extends MediaBase {
  kind: 'motion';
  name: string;
}

export type Media = StillMedia | MotionMedia;

export type StatusKind = 'live' | 'new' | 'scoped' | 'internal';

export interface DiagramStep {
  /** The small monospaced timestamp above the node. */
  stamp: string;
  label: string;
  sub: string;
  /** Violet fill. Exactly one step per diagram is the agent. */
  accent?: boolean;
  /** Draw the arrow leading into this step as dashed. Used for handover. */
  dashedIn?: boolean;
}

export interface DiagramBranch {
  /** Index of the step this branch hangs below. */
  fromIndex: number;
  label: string;
  sub: string;
}

export interface Diagram {
  /** Accessible description of the whole flow. */
  summary: string;
  tag: string;
  meta: string;
  /** Show a moss live dot beside the meta text. */
  live?: boolean;
  steps: DiagramStep[];
  branch?: DiagramBranch;
}

export interface ProductPage {
  /** Page <title>, without the brand suffix. */
  title: string;
  metaDescription: string;
  /** Headline. Allows <span class="erupt"> and <br>. */
  headingHtml: string;
  /** Standfirst. Allows <span class="brandname">. */
  leadHtml: string;
  crumb: { href: string; label: string };
  /** Overrides the derived "→ NN / NN" crumb label. UNDO sits outside the rail. */
  crumbLabel?: string;
  hero: Media;
  diagram: Diagram;
  getList: { title: string; note: string }[];
  facts: { term: string; def: string }[];
  priceChip?: string;
  cta: { href: string; label: string };
  /**
   * The line under the call to action. Defaults to the reply promise. Set it
   * to null where the call to action is a purchase rather than an enquiry, so
   * the page does not promise a reply nobody is waiting for.
   */
  factsNote?: string | null;
  /** "How it runs". Omitted where the page does not need it. */
  runSteps?: { title: string; body: string }[];
  /** Overrides the "How it runs" heading above runSteps. */
  runStepsHeading?: string;
  /**
   * Illustrative questions or scenarios, shown as a short list under the
   * flow. They are examples of use, never testimonials, and the note says so.
   */
  examples?: { heading: string; items: string[]; note: string };
  limits: string;
  closing: { heading: string; cta: { href: string; label: string } };
}

export interface Product {
  /** URL slug, and the key everything else is derived from. */
  slug: string;
  name: string;
  /** Render the name in the italic wordmark register rather than as plain type. */
  isWordmark: boolean;
  status: { kind: StatusKind; label: string };
  /** Card copy on the front page rail. */
  oneliner: string;
  bullets: string[];
  /** An honest closing line on the card, where the product needs one. */
  closing?: string;
  /** Card price line, shown as plain text beside the card links. */
  price?: string;
  card: Media;
  /** Products in the rail have a card; only some have a full page. */
  page: ProductPage | null;
  /** Keep out of the front page rail. UNDO is sold on its own site. */
  railHidden?: boolean;
  /**
   * How an enquiry about this product reads in the contact form. `cta` is the
   * card's call to action; `prompt` is the hint under the message field once
   * the product is selected, so the visitor knows what is useful to tell us.
   */
  enquiry?: { cta: string; prompt: string };
  /**
   * Shown as a pair above the rail on the front page, always visible, instead
   * of as one card among many in the carousel.
   */
  featured?: boolean;
  /** The visitor's own words for the problem, shown on the featured card. */
  fitLine?: string;
}

const bookCta = { href: '/#contact', label: '→ Start a conversation' };
const allProductsCrumb = { href: '/#products', label: '← All products' };
const factsNote = 'You will hear back within one working day.';

/**
 * The contact form link for one product. The form reads `?product=` and
 * preselects it, so the visitor does not have to explain which one they mean.
 */
export const enquiryHref = (slug: string) => `/?product=${slug}#contact`;

export const productsFactsNote = factsNote;

export const products: Product[] = [
  {
    slug: 'personal-unit',
    name: 'Personal Unit',
    isWordmark: true,
    featured: true,
    fitLine: 'I need help keeping track of my work, information and relationships.',
    status: { kind: 'scoped', label: 'Configured per person' },
    oneliner:
      'A personal AI assistant set up around one person\u2019s conversations, documents and commitments, so you stop being the one who has to remember everything.',
    bullets: [
      'Ask across the sources you choose to connect',
      'Keeps track of people, projects and promises',
      'Prepares drafts. You decide what gets sent',
    ],
    enquiry: {
      cta: 'Talk about your Personal Unit',
      prompt: 'What do you keep having to remember or chase? Which sources would it involve (email, calendar, documents), and what would a good week with it look like?',
    },
    card: { kind: 'image', src: stepHandoverYuriy, alt: 'Two men reflected in the polished bodywork of a car on a street', monogram: 'paper' },
    page: {
      title: 'Personal Unit, a personal AI assistant',
      metaDescription:
        'Personal Unit is a personal AI assistant configured around your conversations, documents and commitments. Ask across the sources you connect, keep track of what you promised, and get drafts you approve.',
      headingHtml: 'Less <span class="erupt">remembering</span>.<br>More getting things done.',
      leadHtml:
        '<span class="brandname">Personal Unit</span> is a personal AI assistant, set up around one person\u2019s conversations, documents and commitments. It finds what you need, keeps track of what you promised and prepares what comes next, so you stop briefing a chatbot from scratch every time.',
      crumb: allProductsCrumb,
      hero: { kind: 'image', src: stepHandoverYuriy, alt: 'Two men reflected in the polished bodywork of a car on a street', monogram: 'paper' },
      diagram: {
        summary:
          'You choose which sources to connect. Personal Unit finds and remembers what is in them, surfaces what needs your attention and prepares replies, briefs and summaries. Nothing consequential goes out until you approve it.',
        tag: 'Flow \u00b7 Personal Unit',
        meta: 'configured per person',
        steps: [
          { stamp: 'YOU CHOOSE', label: 'Your sources', sub: 'mail \u00b7 calendar \u00b7 docs' },
          { stamp: 'IN CONTEXT', label: 'Personal Unit', sub: 'finds \u00b7 remembers', accent: true },
          { stamp: 'WHAT MATTERS', label: 'Attention', sub: 'needs you \u00b7 can wait' },
          { stamp: 'PREPARED', label: 'Drafts', sub: 'replies \u00b7 briefs' },
          { stamp: 'YOU DECIDE', label: 'Your approval', sub: 'before it goes out', dashedIn: true },
        ],
      },
      examples: {
        heading: 'The questions it is for',
        items: [
          'What did we agree with this client?',
          'Which conversations still need a reply?',
          'Find the document mentioned in that meeting.',
          'Prepare a reply using the context of this conversation.',
        ],
        note: 'Examples of use, not customer quotes. Which sources can be connected is agreed when we set it up.',
      },
      getList: [
        {
          title: 'Ask across what you connect',
          note: 'Plain questions about messages, documents, people and earlier decisions. It shows where an answer came from, and says when a source is not connected.',
        },
        {
          title: 'Continuity around people and projects',
          note: '\u201cWhere did we leave this?\u201d and \u201cWhat did I promise?\u201d answered from the history, not from your memory.',
        },
        {
          title: 'An overview of what needs you',
          note: 'Open questions, follow-ups and commitments, sorted into what needs a decision and what can wait. Not another stream of notifications.',
        },
        {
          title: 'Drafts and briefs, ready when you are',
          note: 'Replies, meeting context and document summaries prepared for you. A draft stays a draft until you send it.',
        },
        {
          title: 'You stay in control',
          note: 'You choose the sources and which actions need your approval. Personal and company information are kept apart, set up per engagement.',
        },
      ],
      facts: [
        { term: 'Who it is for', def: 'Founders, executives, consultants' },
        { term: 'What it is', def: 'Software set up for one person. Not a device' },
        { term: 'Sources', def: 'Only the ones you choose to connect' },
        { term: 'Processing', def: 'Agreed per setup, including any external model provider' },
      ],
      cta: { href: enquiryHref('personal-unit'), label: '\u2192 Talk about your Personal Unit' },
      runStepsHeading: 'What setting it up involves',
      runSteps: [
        { title: 'Map', body: 'We start from your week: which conversations, documents and routines cost you the most remembering.' },
        { title: 'Connect', body: 'We connect the sources you choose, inside boundaries you agree to. Nothing you have not chosen.' },
        { title: 'Check', body: 'We configure it around your work and test it on real days, not a demo, before you rely on it.' },
      ],
      limits:
        'If you want a chatbot for the odd question, buy a subscription and save the money. Personal Unit knows what you connect and does what you approve. It is not omniscient, not a replacement for you, and not a tool for watching employees.',
      closing: { heading: 'What are you still keeping in your head?', cta: { href: enquiryHref('personal-unit'), label: '\u2192 Talk about your Personal Unit' } },
    },
  },

  {
    slug: 'lead-agent',
    name: 'Lead Agent',
    isWordmark: true,
    featured: true,
    fitLine: 'We need help finding and preparing relevant commercial opportunities.',
    status: { kind: 'scoped', label: 'Configured per workflow' },
    oneliner:
      'Finds companies that fit your criteria and have a reason to talk now, researches them and prepares an outreach draft for your team to review.',
    bullets: [
      'Starts from your criteria and signals',
      'Every prospect comes with the evidence',
      'You review every draft before anything goes out',
    ],
    enquiry: {
      cta: 'Discuss your lead workflow',
      prompt: 'Who do you want to reach, and what makes a company worth contacting now (hiring, for example)? How do you find and prepare prospects today?',
    },
    card: { kind: 'motion', name: 'lead-peephole', alt: 'A brass door peephole cover swinging open on a dark wooden door', monogram: 'paper' },
    page: {
      title: 'Lead Agent',
      metaDescription:
        'Lead Agent turns market signals into researched prospects. Tell it who you want to reach; it finds relevant companies, gathers the context and prepares outreach drafts for your team to review.',
      headingHtml: 'Know who to contact.<br>And <span class="erupt">why</span>.',
      leadHtml:
        '<span class="brandname">Lead Agent</span> finds companies that fit your criteria and show a reason to talk now, gathers the context and prepares your next conversation. You get researched prospects with the evidence attached, not a longer list of names.',
      crumb: allProductsCrumb,
      hero: { kind: 'image', src: jonathanCastaneda, alt: 'Two players mid-rally on a squash court, seen through a blurred ring' },
      diagram: {
        summary:
          'You define the companies, roles and signals that matter. Lead Agent finds companies showing those signals, researches and prioritises them, and prepares an outreach draft for each. Your team reviews every draft and decides what happens next.',
        tag: 'Flow \u00b7 Lead Agent',
        meta: 'human review built in',
        steps: [
          { stamp: 'DEFINE', label: 'Your criteria', sub: 'companies \u00b7 roles' },
          { stamp: 'WHY NOW', label: 'Signals', sub: 'e.g. hiring' },
          { stamp: 'RESEARCH', label: 'Lead Agent', sub: 'dedupes \u00b7 ranks', accent: true },
          { stamp: 'PREPARED', label: 'Lead packet', sub: 'evidence \u00b7 draft' },
          { stamp: 'YOU DECIDE', label: 'Your review', sub: 'before it goes out', dashedIn: true },
        ],
      },
      getList: [
        { title: 'Your criteria, written down', note: 'Target companies, roles, market and the signals that matter to you, agreed before anything runs.' },
        { title: 'Signals that say why now', note: 'Companies showing relevant activity. Hiring is where it starts today; other signals are scoped with you.' },
        { title: 'Researched, not just listed', note: 'Prospects deduplicated and prioritised, with company and decision-maker context gathered for each.' },
        { title: 'Warm paths, where the data allows', note: 'Possible warm connections are flagged when suitable connection data is available.' },
        { title: 'A lead packet you can review', note: 'The company, why it is relevant, useful contact context, a draft grounded in the research and a suggested next step.' },
      ],
      facts: [
        { term: 'First audience', def: 'Recruiters and agencies' },
        { term: 'You get', def: 'Reviewable lead packets' },
        { term: 'Sending', def: 'Your team reviews first' },
        { term: 'Other uses', def: 'Configured per engagement' },
      ],
      cta: { href: enquiryHref('lead-agent'), label: '\u2192 Discuss your lead workflow' },
      runSteps: [
        { title: 'Define', body: 'We write down who you want to reach and which signals make a company worth contacting now.' },
        { title: 'Research', body: 'It finds matching companies, removes duplicates, ranks them and gathers the context for each one.' },
        { title: 'Review', body: 'Your team reads each lead packet, edits the draft and decides what happens next.' },
      ],
      limits:
        'If you want a big list of names to message in bulk, this is the wrong product. Lead Agent does not promise meetings, verified email addresses or revenue. It earns its place when a better-prepared conversation is worth more than volume.',
      closing: { heading: 'Who should you be talking to this month?', cta: { href: enquiryHref('lead-agent'), label: '\u2192 Discuss your lead workflow' } },
    },
  },

  {
    slug: 'workshops',
    name: 'Workshops',
    isWordmark: false,
    status: { kind: 'live', label: 'Live' },
    oneliner:
      'A working day with your team, not a lecture. Half understanding what agents actually do and where they break. Half hands-on, building on your own data.',
    bullets: [
      'One day, up to 12 people',
      'Built around your processes, not generic examples',
      'Everyone leaves with something that works',
      'Delivered on site or remote',
    ],
    card: { kind: 'image', src: julianMora, alt: 'A room of people in motion, caught in a long exposure against a red wall' },
    page: {
      title: 'Workshops',
      metaDescription:
        'One day with your team. The morning is how agents actually work and where they break. The afternoon is hands-on on your own data. Up to 12 people, on site or remote.',
      headingHtml: 'A <span class="erupt">working</span> day.<br>Not a lecture.',
      leadHtml:
        'One day with your team. The first half is understanding what agents actually do and where they break. The second half is hands-on, where the team builds something that runs on their own data before they go home.',
      crumb: allProductsCrumb,
      hero: { kind: 'image', src: julianMora, alt: 'A room of people in motion, caught in a long exposure against a red wall' },
      diagram: {
        summary: 'The team arrives at nine, spends the morning understanding where agents break, builds on its own data after lunch, and leaves at five with something running.',
        tag: 'Flow · Workshops',
        meta: '1 day · 12 seats',
        steps: [
          { stamp: '09:00', label: 'Team arrives', sub: 'twelve chairs' },
          { stamp: '09:30', label: 'Morning: understand', sub: 'where agents break' },
          { stamp: '13:00', label: 'Afternoon: build', sub: 'on your own data', accent: true },
          { stamp: '17:00', label: 'Shipped skill', sub: 'keeps running', dashedIn: true },
        ],
      },
      getList: [
        { title: 'The morning: how agents actually work', note: 'What they are good at, where they fail, and how to tell the difference before you spend money.' },
        { title: 'The afternoon: hands-on, on your data', note: 'Not a demo dataset. Your invoices, your emails, your process.' },
        { title: 'Everyone leaves with something that works', note: 'A running agent or automation the team built themselves and can keep using.' },
        { title: 'Built around your processes', note: 'We prepare from your operations, not from generic examples.' },
      ],
      facts: [
        { term: 'Format', def: 'One day, up to 12 people' },
        { term: 'Location', def: 'On site or remote' },
        { term: 'Preparation', def: 'We do it, not you' },
      ],
      cta: { href: '/#contact', label: '→ Start a conversation' },
      limits:
        'If you want a keynote for two hundred people, this is the wrong product. This is sleeves up, twelve chairs, laptops open.',
      closing: { heading: 'One day. Your team leaves with something running.', cta: bookCta },
    },
  },

  {
    slug: 'build-agent',
    name: 'Build Agent',
    isWordmark: true,
    status: { kind: 'new', label: 'New' },
    oneliner:
      "One process, one working agent, in production. We automate the task that eats your team's week and hand you the keys.",
    bullets: ['Fixed scope, fixed price', 'Runs in your infrastructure', 'Full handover, you own the code'],
    card: { kind: 'image', src: ivanCheremisin, alt: 'A lone figure crossing an empty court below a large apartment block', monogram: 'paper' },
    page: {
      title: 'Build Agent',
      metaDescription:
        "Build Agent puts one working agent on the task that eats your team's week, in your own infrastructure. Fixed scope, fixed price, full handover in four weeks.",
      headingHtml: 'One process. One agent.<br>In <span class="erupt">production</span>.',
      leadHtml:
        "<span class=\"brandname\">Build Agent</span> takes the task that eats your team's week and puts a working agent on it, in your environment. Fixed scope, fixed price, full handover. When we leave, it keeps running.",
      crumb: allProductsCrumb,
      hero: { kind: 'image', src: ivanCheremisin, alt: 'A lone figure crossing an empty court below a large apartment block', monogram: 'paper' },
      diagram: {
        summary: 'Week one maps the process as it actually runs, weeks two and three build the agent to a fixed scope, week four puts it into your infrastructure, and the day after that you own it.',
        tag: 'Flow · Build Agent',
        meta: 'from 75.000 kr',
        steps: [
          { stamp: 'WEEK 1', label: 'Process mapped', sub: 'as it actually runs' },
          { stamp: 'WEEK 2 TO 3', label: 'Agent built', sub: 'fixed scope', accent: true },
          { stamp: 'WEEK 4', label: 'Production', sub: 'your infrastructure' },
          { stamp: 'DAY 1 AFTER', label: 'Handover', sub: 'you own it', dashedIn: true },
        ],
      },
      getList: [
        { title: 'Fixed scope, fixed price', note: 'Agreed in writing before we start. No hourly meter running.' },
        { title: 'Runs in your infrastructure', note: 'Your servers, your accounts, your security requirements.' },
        { title: 'Full handover, you own the code', note: 'The code, the documentation and the training to run it without us.' },
        { title: 'One process, done properly', note: 'Not a platform, not a roadmap. One thing that works.' },
      ],
      facts: [
        { term: 'Scope', def: 'Fixed, agreed in the first call' },
        { term: 'Where it runs', def: 'Your infrastructure' },
        { term: 'Ownership', def: 'Yours, full handover' },
      ],
      cta: { href: '/#contact', label: '→ Start a conversation' },
      runSteps: [
        { title: 'Look', body: 'We sit with the people who run the process today and map it as it actually runs.' },
        { title: 'Build', body: 'We ship the smallest thing that works and put it in production, in your environment.' },
        { title: 'Hand over', body: 'You get the code, the documentation and the training. If you never call us again, it still runs.' },
      ],
      limits:
        'If the process changes every week, an agent will spend its life chasing it. We will tell you that in the first call, before you spend anything.',
      closing: { heading: 'Which process costs your team the most hours?', cta: bookCta },
    },
  },

  {
    slug: 'custom',
    name: 'Custom AI',
    isWordmark: false,
    status: { kind: 'scoped', label: 'Scoped per case' },
    oneliner:
      'When the others do not fit. Designed and built around your processes, your data and your security requirements, then handed over.',
    bullets: [
      'Scoped from your actual operations, not a template',
      'Runs in your environment, on your terms',
      'You own the code and the models we configure',
      'From first prototype to running in production',
    ],
    closing: 'We will tell you in the first conversation whether this is worth building. Sometimes the answer is no.',
    price: 'Scoped per engagement',
    card: { kind: 'motion', name: 'custom-formation', alt: 'A boy standing still at the front of a uniformed formation in falling debris' },
    page: {
      title: 'Custom AI for SME and corporate',
      metaDescription:
        'When the standard products do not fit. We design and build around your processes, your data and your security requirements, on premise or air gapped, then hand it over.',
      headingHtml: 'Built around your operations.<br><span class="erupt">Owned</span> by you.',
      leadHtml:
        'When the other products do not fit. We design and build the system around your processes, your data and your security requirements, then hand it over. Full ownership, no lock-in, no license we control.',
      crumb: allProductsCrumb,
      hero: { kind: 'image', src: purpleChair, alt: 'A single violet chair in rows of red banquet chairs', monogram: 'paper' },
      diagram: {
        summary: 'One intake call leads to a scope, or to us saying there is nothing worth building. If there is, we build on your data and your rules, deploy into your environment and hand it over.',
        tag: 'Flow · Custom AI',
        meta: 'scoped per engagement',
        steps: [
          { stamp: 'STEP 1', label: 'Intake', sub: 'first call' },
          { stamp: 'STEP 2', label: 'Scope', sub: 'or we say no' },
          { stamp: 'STEP 3', label: 'Build', sub: 'your data, your rules', accent: true },
          { stamp: 'STEP 4', label: 'Your environment', sub: 'cloud, on prem, air gapped' },
          { stamp: 'STEP 5', label: 'Handover', sub: 'you own it, always', dashedIn: true },
        ],
        branch: { fromIndex: 1, label: 'No build', sub: 'we say so first, before you spend anything' },
      },
      getList: [
        { title: 'Scoped from your actual operations', note: 'Not a template with your logo on it. We start from how your business really runs.' },
        { title: 'Runs in your environment, on your terms', note: 'On premise, in your cloud, or air gapped if your security requires it.' },
        { title: 'You own the code and the models we configure', note: 'No subscription that holds your operations hostage.' },
        { title: 'From first prototype to production', note: 'We stay until it runs, then we hand over and step back.' },
      ],
      facts: [
        { term: 'Engagement', def: 'Scoped per case' },
        { term: 'First step', def: 'One conversation, no slide deck' },
        { term: 'Where it runs', def: 'Your environment' },
        { term: 'Ownership', def: 'Yours, always' },
      ],
      cta: { href: '/#contact', label: '→ Start a conversation' },
      limits:
        'We will tell you in the first conversation whether this is worth building. Sometimes the answer is no, and we will say so before you spend anything.',
      closing: { heading: 'Tell us what the standard products do not cover.', cta: bookCta },
    },
  },

  {
    slug: 'consultancy',
    name: 'Consultancy',
    isWordmark: false,
    status: { kind: 'scoped', label: 'Scoped per engagement' },
    oneliner:
      'Sometimes you do not need us to build. You need someone in the room who has built this before, sitting with your team while you decide.',
    bullets: [
      'Embedded with your team, not reporting from outside',
      'Sprint teams, strategy, second opinions',
      'We say no when a build is the wrong answer',
    ],
    card: { kind: 'image', src: tomW, alt: 'A graffiti covered corner music shop on a wet street', monogram: 'paper' },
    page: null,
  },

  {
    slug: 'agent-audit',
    name: 'Agent audit',
    isWordmark: false,
    status: { kind: 'new', label: 'New' },
    oneliner:
      'A short, paid look at your operations before anyone builds anything. You get a map of where agents pay off and where they do not.',
    bullets: [
      'Two weeks, one written verdict',
      'Ranked by hours saved, not by what is fun to build',
      'Yours to take anywhere, including to someone else',
    ],
    card: { kind: 'image', src: purpleChair, alt: 'A single violet chair in rows of red banquet chairs', monogram: 'paper' },
    page: null,
  },

  {
    slug: 'undo',
    name: 'UNDO',
    isWordmark: true,
    railHidden: true,
    status: { kind: 'live', label: 'Live' },
    oneliner:
      'The EU withdrawal button as one script tag. Paste it into your webshop and the duty under Directive 2023/2673 is covered.',
    bullets: ['One script tag, live in minutes', 'Correct withdrawal deadline per order', 'Legally binding text, kept current'],
    price: '999 kr / year per site',
    card: { kind: 'image', src: janAntoninKolar, alt: 'A spilled takeaway coffee on a pavement as someone walks past', monogram: 'paper' },
    page: {
      title: 'UNDO',
      metaDescription:
        'UNDO is the EU withdrawal button as one script tag. Correct deadline per order, legally binding text kept current, full documentation trail. 999 kr per year per site.',
      headingHtml: 'The EU withdrawal button, as <span class="erupt">one</span> script tag.',
      leadHtml:
        'EU Directive 2023/2673 makes a digital withdrawal button mandatory for most webshops selling to consumers. <span class="brandname">UNDO</span> is that button, handled end to end. Paste one script tag, and the duty is covered.',
      crumb: { href: '/', label: '← HEKLA' },
      crumbLabel: 'Standalone product',
      hero: { kind: 'image', src: janAntoninKolar, alt: 'A spilled takeaway coffee on a pavement as someone walks past', monogram: 'paper' },
      diagram: {
        summary: 'An order placed in your webshop fires UNDO, which sets the correct withdrawal deadline for that order and logs a provable receipt if the customer withdraws.',
        tag: 'Flow · UNDO',
        meta: '999 kr / yr',
        live: true,
        steps: [
          { stamp: '10:02 PLACED', label: 'Order placed', sub: 'in your webshop' },
          { stamp: '10:02 FIRES', label: 'UNDO', sub: 'one script tag', accent: true },
          { stamp: '+14 DAYS', label: 'Deadline set', sub: 'per order, per rule' },
          { stamp: 'ON WITHDRAWAL', label: 'Logged', sub: 'receipt & webhook' },
        ],
      },
      getList: [
        { title: 'One script tag, live in minutes', note: 'No development work. Paste it, and the button is on your shop.' },
        { title: 'Correct withdrawal deadline per order', note: 'Calculated from the order data, not guessed from a calendar.' },
        { title: 'Legally binding text, kept current', note: 'When the rules change, the text changes. That is what the annual fee buys.' },
        { title: 'Receipt and documentation trail', note: 'Every withdrawal logged and provable, plus webhooks for your own systems.' },
      ],
      facts: [
        { term: 'Price', def: '999 kr / year per site' },
        { term: 'Includes', def: 'Annual legal updates' },
        { term: 'Setup', def: 'Minutes, one script tag' },
        { term: 'Buy directly', def: 'No sales call needed' },
      ],
      priceChip: '999 kr / year per site',
      cta: { href: 'https://undo.onl', label: '→ Get UNDO at undo.onl' },
      /* Self-serve purchase, not an enquiry. No reply to promise. */
      factsNote: null,
      limits:
        'UNDO covers the withdrawal button duty under Directive 2023/2673. It is not a legal review of your whole shop, and it does not replace your terms of sale.',
      closing: { heading: 'When a customer withdraws, only what you can prove counts.', cta: bookCta },
    },
  },
];

/** Every product shown on the front page, featured pair first, in order. */
export const homeProducts = products.filter((p) => !p.railHidden);

/** The pair shown side by side above the rail. */
export const featuredProducts = homeProducts.filter((p) => p.featured);

/** The products that appear in the front page rail, in order. */
export const railProducts = homeProducts.filter((p) => !p.featured);

/** Products with a detail page, used to build the routes and the crumbs. */
export const pagedProducts = products.filter((p) => p.page !== null);

/** Look one up by slug. */
export const getProduct = (slug: string): Product | undefined => products.find((p) => p.slug === slug);

/**
 * The "→ 02 / 07" crumb. Derived from the front page (featured pair, then rail) so the numerator and the
 * denominator can never disagree with what the front page actually shows,
 * which is exactly how the handoff drifted to "01 / 04" against six cards.
 */
export function railPosition(slug: string): string | null {
  const i = homeProducts.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `→ ${pad(i + 1)} / ${pad(homeProducts.length)}`;
}
