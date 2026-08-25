/**
 * Front page content. Everything the home page says, in one file, so the copy
 * can be edited without going anywhere near the markup.
 */
import type { Media } from './products';

import heroGrid from '../assets/photos/hero-grid.png';
import jonathanCastaneda from '../assets/photos/jonathan-castaneda-w.jpg';
import stepLookFurkan from '../assets/photos/step-look-furkan.jpg';
import stepHandoverYuriy from '../assets/photos/step-handover-yuriy.jpg';

export const hero = {
  eyebrow: 'AI Engineering · Copenhagen',
  wordmark: 'HEKLA',
  tagline: 'Yes, we build AI.',
  lines: ['Engineering firm in Copenhagen.', 'Workers that run inside your company, 24/7.'],
  ctas: [
    { href: '#contact', label: '→ Book a conversation', variant: 'primary' as const },
    { href: '#products', label: 'See what we build', variant: 'plain' as const },
  ],
  proof: [
    { number: '12+', label: 'Systems shipped' },
    { number: '83%', label: 'Time saved on automated processes' },
    { number: '100%', label: 'Client ownership' },
  ],
  /* The loose polaroids beside the headline. Decorative, so the alt text is
     empty and the whole group is hidden from assistive technology. */
  photos: [
    { kind: 'image', src: jonathanCastaneda, alt: '' },
    { kind: 'motion', name: 'hero-arc', alt: '' },
    { kind: 'image', src: heroGrid, alt: '' },
  ] as Media[],
};

export const homeDiagram = {
  summary:
    'Your operations feed the agent. The agent reads, decides and acts inside your own systems. Then the whole thing is handed over and owned by you.',
  tag: 'System map · 001',
  meta: 'UTC 14:32:07',
  live: true,
  steps: [
    { stamp: '00:00:00', label: 'Your operations', sub: 'leads · orders · documents' },
    { stamp: '00:00:04', label: 'Hekla agent', sub: 'reads · decides · acts', accent: true },
    { stamp: '00:00:09', label: 'Your systems', sub: 'crm · calendar · erp · shop' },
    { stamp: 'T+handover', label: 'Owned by you', sub: 'code · docs · no lock-in', dashedIn: true },
  ],
};

export const howWeWork = {
  heading: 'Three steps. No fourth',
  steps: [
    {
      title: 'Look',
      body: 'We sit with your team and map the processes as they run, not as the org chart says they run.',
      media: {
        kind: 'image',
        src: stepLookFurkan,
        alt: 'A crowded ferry cabin seen through a porthole in a wooden door',
        monogram: 'paper',
      } as Media,
    },
    {
      title: 'Build',
      body: 'We ship the first thing that works and put it in production. Usually within weeks.',
      media: {
        kind: 'motion',
        name: 'step-build-desk',
        alt: 'Two people facing each other across a desk in a dim room under a ceiling fan',
      } as Media,
    },
    {
      title: 'Hand over',
      body: 'You get the code, the documentation and the training. If you never call us again, it still runs.',
      media: {
        kind: 'image',
        src: stepHandoverYuriy,
        alt: 'Two men reflected in the polished bodywork of a car on a street',
        monogram: 'paper',
      } as Media,
    },
  ],
};

export const about = {
  heading: 'We got tired of noisy projects',
  copy: [
    'HEKLA started as a casual conversation over a beer between three collaborators after a tech summit. We were working on different projects with tech companies and institutions, and had a hard time wrapping our heads around why medium sized projects would cost a fortune, and leave the client with a way too big check and locked in.',
    'HEKLA builds smart, fast, cheaper and without the theatre.',
  ],
  media: {
    kind: 'motion',
    name: 'founders',
    alt: 'Hjalti, Christopher and Sven, the three founders of HEKLA, in a harbourside building in Copenhagen',
    tear: true,
  } as Media,
};

export const contact = {
  heading: "What is eating your team's week?",
  intro: 'Tell us and we will see if we can eat it off your plate.',
};
