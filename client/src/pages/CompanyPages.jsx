import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const legalPages = {
  privacy: {
    eyebrow: 'Privacy policy',
    title: 'Your information, handled with care.',
    intro: 'This policy explains what Google Pages information is used for when you browse the directory, create an account, or contact a listed business.',
    sections: [
      ['Information you provide', 'Account details, business listing information, reviews, favourites, and messages you submit are used to provide the features you request.'],
      ['How information is used', 'We use account and activity information to operate the directory, maintain listings, respond to support messages, protect the service, and improve discovery.'],
      ['Public listings and messages', 'Business details and reviews submitted for publication may be visible to visitors. If you send an enquiry to a business, the contact details and message you provide are shared with that business so it can respond.'],
      ['Storage and security', 'Google Pages uses service providers for hosting, data storage, and email delivery. We apply access controls and other safeguards, but no online service can guarantee absolute security.'],
      ['Your choices', 'You can update account information from your account settings. To ask about, correct, or remove information that is not editable there, use the Contact page. Some information may need to be retained for security or operational reasons.'],
      ['Changes and questions', 'We may update this policy as the service changes. The current version is published here. For privacy questions, contact us through the Contact page.'],
    ],
  },
  terms: {
    eyebrow: 'Terms & conditions',
    title: 'A useful directory depends on everyone.',
    intro: 'By using Google Pages, you agree to use the directory lawfully and to keep the information you submit accurate and respectful.',
    sections: [
      ['Using the directory', 'You may browse and use the directory for lawful personal or business discovery. Do not disrupt the service, attempt unauthorized access, or use automated means to collect data without permission.'],
      ['Accounts and submissions', 'You are responsible for activity under your account and for having the right to submit any listing, review, image, or other content you provide. Keep your account details secure and up to date.'],
      ['Listings and reviews', 'Listings and reviews should be truthful, relevant, and respectful. Google Pages may review, edit for safety, restrict, or remove content that is misleading, unlawful, abusive, or otherwise unsuitable for the directory.'],
      ['Directory information', 'Information is provided to help people discover local places. Listings may be incomplete or out of date; verify important details directly with the business. A listing is not a guarantee, certification, or endorsement by Google Pages.'],
      ['Third-party services', 'Some pages link to businesses or external services. Those services are operated by others and have their own terms and privacy practices.'],
      ['Availability and changes', 'We may change or suspend features to maintain or improve the service. These terms may also change; continued use after an update means you accept the revised terms.'],
      ['Questions', 'If you have a question about these terms or content on the directory, contact us through the Contact page.'],
    ],
  },
};

function PageHeading({ eyebrow, title, description }) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-vermilion">{eyebrow}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/60 sm:text-lg">{description}</p>}
    </header>
  );
}

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', subject: searchParams.get('subject') || '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [sending, setSending] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await api.post('/contact', form);
      setStatus({ type: 'success', message: response.data.message || 'Your message has been sent.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'We could not send your message. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/50';

  return (
    <div className="container-page py-10 sm:py-16">
      <PageHeading
        eyebrow="Contact Google Pages"
        title="How can we help?"
        description="Send a question about your account, a listing, a correction, or the directory."
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <aside className="border-t border-line pt-5">
          <h2 className="font-display text-xl font-semibold text-ink">What to include</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">Tell us what happened and include the page or listing name if your message is about a specific place. Please do not send passwords or payment details.</p>
          <p className="mt-6 text-sm leading-relaxed text-ink/60">For a business enquiry, use the contact details on that business’s listing so your message reaches the right team.</p>
          <Link to="/explore" className="mt-6 inline-flex text-sm font-semibold text-vermilion hover:underline">Browse the directory</Link>
        </aside>

        <form onSubmit={submit} className="grid gap-4 rounded-lg border border-line bg-white p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-ink">Name<input required maxLength={100} autoComplete="name" value={form.name} onChange={update('name')} className={inputClass} /></label>
            <label className="text-sm font-medium text-ink">Email<input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={update('email')} className={inputClass} /></label>
          </div>
          <label className="text-sm font-medium text-ink">Subject<input required minLength={3} maxLength={120} value={form.subject} onChange={update('subject')} className={inputClass} /></label>
          <label className="text-sm font-medium text-ink">Message<textarea required minLength={10} maxLength={5000} rows={6} value={form.message} onChange={update('message')} className={`${inputClass} resize-y`} /></label>
          {status.message && <p role="status" className={`rounded-md px-3 py-2.5 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>{status.message}</p>}
          <button type="submit" disabled={sending} className="w-fit rounded-md bg-vermilion px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-vermilion/90 disabled:cursor-wait disabled:opacity-60">
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function CareersPage() {
  return (
    <div className="container-page py-10 sm:py-16">
      <PageHeading
        eyebrow="Careers at Google Pages"
        title="Build for the places people call home."
        description="We are building a more useful way to discover local places and businesses."
      />
      <section className="mt-10 max-w-3xl border-y border-line py-7">
        <h2 className="font-display text-xl font-semibold text-ink">No open positions right now</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">There are no active roles to apply for at this time. If you would like to introduce yourself or ask about future opportunities, send us a message and choose “Career interest” as the subject.</p>
        <Link to="/contact?subject=Career%20interest" className="mt-5 inline-flex rounded-md bg-vermilion px-4 py-2.5 text-sm font-semibold text-paper hover:bg-vermilion/90">Contact the team</Link>
      </section>
    </div>
  );
}

export function BusinessSupportPage() {
  return (
    <div className="container-page py-10 sm:py-16">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink/65 transition hover:text-ink">
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </Link>
      <PageHeading
        eyebrow="Business support"
        title="Help for your business listing."
        description="Get help signing in, creating a listing, updating business information, or understanding a review decision."
      />
      <div className="mt-8 grid max-w-3xl gap-6 border-y border-line py-6 sm:grid-cols-2">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Manage your listing</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">Sign in to view listing status, update your business profile, and respond to customer messages.</p>
          <Link to="/business/login" className="mt-4 inline-flex rounded-md bg-vermilion px-4 py-2.5 text-sm font-semibold text-paper hover:bg-vermilion/90">Business login</Link>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Still need help?</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">Send the business name and a short description of the issue. Do not include your password or payment details.</p>
          <Link to="/contact?subject=Business%20support" className="mt-4 inline-flex rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink/40">Contact support</Link>
        </section>
      </div>
    </div>
  );
}

function LegalPage({ page }) {
  const content = legalPages[page];
  return (
    <div className="container-page py-10 sm:py-16">
      <PageHeading eyebrow={content.eyebrow} title={content.title} description={content.intro} />
      <p className="mt-6 text-xs text-ink/45">Last updated: September 28, 2026</p>
      <article className="mt-6 max-w-3xl divide-y divide-line border-y border-line">
        {content.sections.map(([heading, text]) => (
          <section key={heading} className="py-5">
            <h2 className="font-display text-lg font-semibold text-ink">{heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{text}</p>
          </section>
        ))}
      </article>
    </div>
  );
}

export function PrivacyPage() {
  return <LegalPage page="privacy" />;
}

export function TermsPage() {
  return <LegalPage page="terms" />;
}