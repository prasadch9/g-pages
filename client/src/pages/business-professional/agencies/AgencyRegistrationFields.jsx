import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = ic + ' resize-y';

function Section({ label, step, children }) {
  return (
    <div className="rounded-[1.25rem] border border-orange-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700">{step}</p>
      <h3 className="mt-1 font-display text-xl font-semibold text-slate-800">{label}</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function F({ label, col = 2, children }) {
  return (
    <div className={`col-span-2 sm:col-span-${col}`}>
      <label className="text-sm font-medium text-ink/75">{label}</label>
      {children}
    </div>
  );
}

export default function AgencyRegistrationFields({
  form, categoryData = {}, update, updateCategoryData,
  uploadedFiles = {}, renderSingleImageUpload, handleLocalFiles, removeUploadedImage,
}) {
  const lf = (key, label, ph, rows = 2) => (
    <F label={label} col={2}>
      <textarea rows={rows} value={categoryData[key] || ''} onChange={e => updateCategoryData(key, e.target.value)} placeholder={ph} className={tc} />
    </F>
  );
  const tf = (key, label, ph, col = 1) => (
    <F label={label} col={col}>
      <input value={categoryData[key] || ''} onChange={e => updateCategoryData(key, e.target.value)} placeholder={ph} className={ic} />
    </F>
  );

  return (
    <div className="col-span-2 space-y-5">
      <div className="overflow-hidden rounded-[1.5rem] bg-[#1a1a2e] px-6 py-7 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-orange-300">Agency Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your agency details</h2>
        <p className="mt-2 text-sm text-white/60">These details will appear on your public agency brand page — services, portfolio, clients, and contact sections.</p>
      </div>

      {/* Step 1 — Identity */}
      <Section label="Basic Identity & Contact" step="Step 1 · Identity">
        <F label="Agency name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. Nexus Digital Agency" className={ic} />
        </F>
        {tf('agencyType', 'Agency type *', 'Creative, Marketing, Digital, PR, HR...', 1)}
        {tf('tagline', 'Tagline', 'Where Brands Come Alive', 1)}
        <F label="Phone *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Email *" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="hello@youragency.com" className={ic} /></F>
        <F label="Website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://youragency.com" className={ic} /></F>
        <F label="Address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="Office address" className={ic} /></F>
        <F label="About your agency *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Describe your agency, what you do, and what makes you different..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Services */}
      <Section label="Services & Expertise" step="Step 2 · What you offer">
        {lf('agencyServices', 'Agency services (one per line) *', 'Brand strategy\nSocial media management\nContent creation\nPaid advertising\nWebsite development', 4)}
        {lf('clientIndustries', 'Client industries', 'Technology, Healthcare, Retail, Real Estate, FMCG...', 2)}
        {lf('serviceLocations', 'Service locations', 'Vijayawada, Hyderabad, Bengaluru, Remote...', 2)}
      </Section>

      {/* Step 3 — Portfolio & Clients */}
      <Section label="Portfolio & Clients" step="Step 3 · Credibility">
        {tf('yearsExperience', 'Years in business', '5+', 1)}
        {tf('projectsCompleted', 'Projects completed', '200+', 1)}
        {tf('clientRating', 'Client rating (e.g. 4.9/5)', '4.9/5', 1)}
        {tf('happyClients', 'Happy clients', '80+', 1)}
        {lf('highlights', 'Why choose us — highlights (comma separated)', 'Creative team, Data-driven results, Transparent pricing, 24/7 support', 2)}
        {lf('notableClients', 'Notable clients', 'Brand A, Startup B, Company C...', 2)}
        {lf('caseStudies', 'Case studies / notable campaigns (one per line)', 'Grew XYZ brand followers by 300%\nLaunched ABC product with 1M+ reach', 3)}
        {lf('certifications', 'Certifications / partnerships', 'Google Partner, Meta Business Partner, HubSpot Certified...', 2)}
      </Section>

      {/* Step 4 — Branding Media */}
      <Section label="Branding & Media" step="Step 4 · Visuals">
        <div className="col-span-2 text-xs text-ink/50">Upload your agency logo, hero cover, and portfolio gallery images.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Agency logo')}
          {renderSingleImageUpload?.('coverImage', 'Hero cover image', false)}
          {renderSingleImageUpload?.('aboutImage', 'About section image', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Gallery / portfolio images</label>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(uploadedFiles.galleryImages || []).map((img, i) => (
              <div key={i} className="overflow-hidden rounded border border-line bg-white">
                <img src={img} alt={`Gallery ${i + 1}`} className="h-24 w-full object-contain" />
                <button type="button" onClick={() => removeUploadedImage?.('galleryImages', i)} className="w-full border-t border-line bg-red-50 px-2 py-2 text-[11px] font-medium text-red-500 hover:bg-red-100">Remove</button>
              </div>
            ))}
            <label className="flex min-h-[110px] cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white px-3 py-4 text-center text-xs text-ink/60 hover:border-ink/40">
              Add photos<input type="file" accept="image/*" multiple className="hidden" onChange={e => handleLocalFiles?.('galleryImages', e.target.files, true)} />
            </label>
          </div>
        </div>
        <F label="Video URL (YouTube / Reel)" col={2}>
          <input type="url" value={form.videoUrls || ''} onChange={update('videoUrls')} placeholder="https://youtube.com/..." className={ic} />
        </F>
      </Section>

      {/* Step 5 — Social */}
      <Section label="Social Media Links" step="Step 5 · Social presence">
        <F label="WhatsApp" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} /></F>
        <F label="Instagram" col={1}><input value={form.instagram || ''} onChange={update('instagram')} placeholder="https://instagram.com/..." className={ic} /></F>
        <F label="Facebook" col={1}><input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/..." className={ic} /></F>
        <F label="LinkedIn" col={1}><input value={form.linkedin || ''} onChange={update('linkedin')} placeholder="https://linkedin.com/company/..." className={ic} /></F>
        <F label="YouTube" col={2}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/..." className={ic} /></F>
      </Section>
    </div>
  );
}
