/**
 * Every product, in one place.
 *
 * The front page rail and the individual product pages both read from this
 * file, which is what keeps the card copy, the crumb numbering and the page
 * content from drifting apart. Adding a seventh product means adding one
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
import tomW from '../assets/photos/tom-w-w.jpg';

/**
 * How the italic H monogram is stamped on this image. Measured, not guessed:
 * `paper` wherever the top-left corner of the photograph is dark enough that
 * a black mark would disappear into it.
 */
export type Monogram = 'ink' | 'paper';

/** A still photograph, optimised at build time by astro:assets. */
export interface StillMedia {
  kind: 'image';
  src: ImageMetadata;
  alt: string;
  monogram?: Monogram;
}

/**
 * A moving clip. `name` resolves to /media/<name>.mp4, .webm and .jpg, all
 * three produced from the GIF master by `npm run media`.
 */
export interface MotionMedia {
  kind: 'motion';
  name: string;
  alt: string;
  monogram?: Monogram;
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
}

const bookCta = { href: '/#contact', label: '→ Book a conversation' };
const allProductsCrumb = { href: '/#products', label: '← All products' };
const factsNote = 'You will hear back within one working day.';

export const productsFactsNote = factsNote;

export const products: Product[] = [
  {
    slug: 'lead-agent',
    name: 'Lead Agent',
    isWordmark: true,
    status: { kind: 'internal', label: 'Internal tool' },
    oneliner:
      'An agent that answers every inbound lead within minutes, qualifies it against your criteria and books the good ones into your calendar.',
    bullets: [
      'Replies in minutes, day and night',
      'Qualifies before it books',
      "Writes in your tone, not a script's",
    ],
    card: { kind: 'motion', name: 'lead-peephole', alt: 'A brass door peephole cover swinging open on a dark wooden door', monogram: 'paper' },
    page: {
      title: 'Lead Agent',
      metaDescription:
        'Lead Agent answers every inbound enquiry within minutes, qualifies it against your criteria and books the good ones into your calendar. Live within two weeks, fully handed over.',
      headingHtml: 'Every lead answered in <span class="erupt">minutes</span>.<br>Not on Monday.',
      leadHtml:
        '<span class="brandname">Lead Agent</span> watches your inbound channels, answers every enquiry within minutes, qualifies it against your criteria and books the good ones straight into your calendar. You wake up to meetings, not a backlog.',
      crumb: allProductsCrumb,
      hero: { kind: 'image', src: jonathanCastaneda, alt: 'Two players mid-rally on a squash court, seen through a blurred ring' },
      diagram: {
        summary: 'An inbound enquiry is read and tagged by Lead Agent, qualified against your criteria, then booked into your calendar, all inside two minutes.',
        tag: 'Flow · Lead Agent',
        meta: 'avg reply 92 sec',
        steps: [
          { stamp: '09:14 IN', label: 'Inbound', sub: 'email & web form' },
          { stamp: '09:14 READ', label: 'Lead Agent', sub: 'reads & tags', accent: true },
          { stamp: '09:15 QUALIFIED', label: 'Qualify', sub: 'your criteria' },
          { stamp: '09:16 BOOKED', label: 'Calendar', sub: 'meeting booked' },
        ],
      },
      getList: [
        { title: 'Replies in minutes, day and night', note: 'Email and web forms answered while your competitors sleep.' },
        { title: 'Qualification before booking', note: 'Your criteria, applied to every lead. The weak ones get a polite no.' },
        { title: 'Meetings straight into your calendar', note: 'Each one arrives with context: who they are, what they asked, what was said.' },
        { title: 'A weekly digest', note: 'What came in, what was answered, what was booked. Five minutes to read.' },
        { title: 'Runs in your environment', note: 'Your channels, your tone, your data. Full handover included.' },
      ],
      facts: [
        { term: 'Setup', def: 'Live within two weeks' },
        { term: 'Where it runs', def: 'Your channels and infrastructure' },
        { term: 'Ownership', def: 'Yours, full handover' },
      ],
      cta: { href: '/#contact', label: '→ Book a conversation' },
      runSteps: [
        { title: 'Connect', body: 'We plug into your inbound channels and your calendar. No rebuild of anything you have.' },
        { title: 'Tune', body: "Your team reviews the first replies and sets the tone. The agent learns your criteria, not a template's." },
        { title: 'Run', body: 'It answers, qualifies and books. You get the digest and the controls.' },
      ],
      limits:
        'If you get fewer than a handful of leads a month, answer them yourself and save the money. This earns its price when volume or response time is costing you deals.',
      closing: { heading: 'How many leads went unanswered last week?', cta: bookCta },
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
      cta: { href: '/#contact', label: '→ Book a conversation' },
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
      cta: { href: '/#contact', label: '→ Book a conversation' },
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
      cta: { href: '/#contact', label: '→ Book a conversation' },
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

/** The products that appear in the front page rail, in order. */
export const railProducts = products.filter((p) => !p.railHidden);

/** Products with a detail page, used to build the routes and the crumbs. */
export const pagedProducts = products.filter((p) => p.page !== null);

/** Look one up by slug. */
export const getProduct = (slug: string): Product | undefined => products.find((p) => p.slug === slug);

/**
 * The "→ 02 / 06" crumb. Derived from the rail so the numerator and the
 * denominator can never disagree with what the front page actually shows,
 * which is exactly how the handoff drifted to "01 / 04" against six cards.
 */
export function railPosition(slug: string): string | null {
  const i = railProducts.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `→ ${pad(i + 1)} / ${pad(railProducts.length)}`;
}
