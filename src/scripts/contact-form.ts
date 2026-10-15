/**
 * The contact form.
 *
 * With PUBLIC_FORM_ENDPOINT set, the form POSTs JSON to it. With no endpoint
 * configured it hands the enquiry to the visitor's mail client with every
 * field already filled in, so the call to action never dead-ends and the form
 * never pretends to have sent something it did not send.
 *
 * Product context: a link to /?product=<slug>#contact preselects that product
 * in the form, and the product travels into the email subject and body (or
 * the JSON payload). On the front page itself such a link is handled in place,
 * without a reload.
 */
export function initContactForm(endpoint: string): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const message = document.querySelector<HTMLElement>('[data-form-message]');
  const hint = document.querySelector<HTMLElement>('[data-message-hint]');
  const mailto = form?.dataset.mailto ?? '';
  if (!form || !message) return;

  const show = (text: string, state: 'ok' | 'err') => {
    message.textContent = text;
    message.className = `form__message is-shown form__message--${state}`;
  };

  const field = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;

  const select = field('product') as HTMLSelectElement | null;

  /* Keep the hint under the message field in step with the chosen product. */
  const syncHint = () => {
    if (!select || !hint) return;
    const option = select.selectedOptions[0];
    hint.textContent = option?.dataset.prompt ?? form.dataset.defaultPrompt ?? '';
  };

  const selectProduct = (slug: string | null): boolean => {
    if (!select || !slug) return false;
    const match = Array.from(select.options).find((o) => o.value === slug);
    if (!match) return false;
    select.value = slug;
    syncHint();
    return true;
  };

  select?.addEventListener('change', syncHint);
  selectProduct(new URLSearchParams(window.location.search).get('product'));
  syncHint();

  /* Same-page product links: preselect and scroll, no reload. */
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="product="]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
    if (!selectProduct(url.searchParams.get('product'))) return;
    event.preventDefault();
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    const target = document.getElementById(url.hash.slice(1) || 'contact');
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    field('name')?.focus({ preventScroll: true });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = field('name')?.value.trim() ?? '';
    const email = field('email')?.value.trim() ?? '';
    const company = field('company')?.value.trim() ?? '';
    const body = field('message')?.value.trim() ?? '';
    const productSlug = select?.value ?? '';
    const productName = productSlug ? (select?.selectedOptions[0]?.textContent?.trim() ?? '') : '';

    if (!name) {
      show('Please add your name.', 'err');
      field('name')?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      show('That email does not look right. Please check it.', 'err');
      field('email')?.focus();
      return;
    }

    if (!endpoint) {
      const about = productName ? `${productName}: conversation with HEKLA` : 'Conversation with HEKLA';
      const subject = `${about}${company ? ` (${company})` : ''}`;
      const lines = [`Name: ${name}`, `Email: ${email}`];
      if (company) lines.push(`Company: ${company}`);
      lines.push(`About: ${productName || 'Not sure yet'}`);
      lines.push('', body);
      show('Opening your email app with the enquiry filled in. It is not sent until you press send there.', 'ok');
      window.location.href = `mailto:${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, product: productSlug, message: body }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      show('Sent. You will hear back within one working day.', 'ok');
      form.reset();
      syncHint();
    } catch {
      show('Something went wrong sending the form. Please try again in a moment.', 'err');
    }
  });
}
