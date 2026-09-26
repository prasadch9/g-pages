import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = ic + ' resize-y';

function Section({ label, step, children }) {
  return (
    <div className="rounded-[1.25rem] border border-indigo-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700">{step}</p>
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

export default function ManpowerAgencyRegistrationFields({
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
      <div className="overflow-hidden rounded-[1.5rem] bg-[#1e3a5f] px-6 py-7 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-300">Manpower Agency Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your manpower agency details</h2>
        <p className="mt-2 text-sm text-white/60">These details will appear on your public page — recruitment services, job categories, employer services, and contact info.</p>
      </div>

      {/* Step 1 — Identity */}
      <Section label="Basic Identity & Contact" step="Step 1 · Identity">
        <F label="Agency name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. TalentBridge Staffing Solutions" className={ic} />
        </F>
        {tf('tagline', 'Tagline', 'Connecting Talent with Opportunity', 2)}
        <F label="Phone *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Email *" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="info@manpoweragency.com" className={ic} /></F>
        <F label="Website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://yourmanpoweragency.com" className={ic} /></F>
        <F label="Address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="Office address" className={ic} /></F>
        <F label="About your agency *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Describe your manpower agency, your specialties, and your reach..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Recruitment Services */}
      <Section label="Recruitment & Staffing Services" step="Step 2 · Services">
        {lf('recruitmentServices', 'Recruitment services (one per line) *', 'Permanent hiring\nContract staffing\nTemporary staffing\nBulk hiring\nExecutive search', 4)}
        {lf('employerServices', 'Employer services', 'Resume screening, Background verification, Payroll management, Workforce planning', 2)}
        {lf('candidateServices', 'Candidate services', 'Career guidance, Interview preparation, Resume building, Skill assessment', 2)}
      </Section>

      {/* Step 3 — Job Categories */}
      <Section label="Job Categories & Industries" step="Step 3 · Focus areas">
        {lf('jobCategories', 'Job categories (comma separated) *', 'IT, Engineering, Healthcare, Sales, Manufacturing, Hospitality, Banking, Education...', 2)}
        {lf('industriesServed', 'Industries served', 'Technology, Logistics, Hospitality, Construction, Retail, Finance...', 2)}
        {tf('serviceCoverage', 'Service coverage', 'Domestic, International, or Both', 2)}
        {lf('serviceLocations', 'Service locations', 'Vijayawada, Hyderabad, Bengaluru, Chennai, Online...', 2)}
      </Section>

      {/* Step 4 — Stats */}
      <Section label="Track Record & Credibility" step="Step 4 · Credibility">
        {tf('yearsExperience', 'Years in business', '8+', 1)}
        {tf('candidatesPlaced', 'Candidates placed', '5000+', 1)}
        {tf('clientCompanies', 'Client companies', '200+', 1)}
        {tf('clientRating', 'Client rating', '4.8/5', 1)}
        {lf('highlights', 'Key strengths (comma separated)', 'Pan-India network, Fast turnaround, Verified candidates, Industry experts', 2)}
        {lf('notableClients', 'Notable client companies', 'TCS, Infosys, Apollo, Flipkart...', 2)}
        {lf('certifications', 'Licenses / certifications', 'NASSCOM member, ISO certified, Govt approved...', 2)}
      </Section>

      {/* Step 5 — Branding Media */}
      <Section label="Branding & Media" step="Step 5 · Visuals">
        <div className="col-span-2 text-xs text-ink/50">Upload your agency logo, office cover image, and gallery photos.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Agency logo')}
          {renderSingleImageUpload?.('coverImage', 'Office / hero cover image', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Gallery images</label>
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
      </Section>

      {/* Step 6 — Social */}
      <Section label="Social Media Links" step="Step 6 · Social presence">
        <F label="WhatsApp" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} /></F>
        <F label="Instagram" col={1}><input value={form.instagram || ''} onChange={update('instagram')} placeholder="https://instagram.com/..." className={ic} /></F>
        <F label="Facebook" col={1}><input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/..." className={ic} /></F>
        <F label="LinkedIn" col={1}><input value={form.linkedin || ''} onChange={update('linkedin')} placeholder="https://linkedin.com/company/..." className={ic} /></F>
        <F label="YouTube" col={2}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/..." className={ic} /></F>
      </Section>
    </div>
  );
}
