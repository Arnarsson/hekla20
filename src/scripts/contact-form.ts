/**
 * The contact form.
 *
 * With PUBLIC_FORM_ENDPOINT set, the form POSTs JSON to it. With no endpoint
 * configured it hands the enquiry to the visitor's mail client with every
 * field already filled in, so the call to action never dead-ends and the form
 * never pretends to have sent something it did not send.
 */
export function initContactForm(endpoint: string): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const message = document.querySelector<HTMLElement>('[data-form-message]');
  const mailto = form?.dataset.mailto ?? '';
  if (!form || !message) return;

  const show = (text: string, state: 'ok' | 'err') => {
    message.textContent = text;
    message.className = `form__message is-shown form__message--${state}`;
  };

  const field = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = field('name')?.value.trim() ?? '';
    const email = field('email')?.value.trim() ?? '';
    const company = field('company')?.value.trim() ?? '';
    const body = field('message')?.value.trim() ?? '';

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
      const subject = `Conversation with HEKLA${company ? ` (${company})` : ''}`;
      const lines = [`Name: ${name}`, `Email: ${email}`];
      if (company) lines.push(`Company: ${company}`);
      lines.push('', body);
      show('Opening your email app with the enquiry ready to send.', 'ok');
      window.location.href = `mailto:${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, message: body }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      show('Sent. You will hear back within one working day.', 'ok');
      form.reset();
    } catch {
      show('Something went wrong sending the form. Please try again in a moment.', 'err');
    }
  });
}
