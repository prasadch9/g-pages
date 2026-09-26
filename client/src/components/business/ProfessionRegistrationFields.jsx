import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = ic + ' resize-y';

function Section({ label, step, children }) {
  return (
    <div className="rounded-[1.25rem] border border-emerald-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">{step}</p>
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

export default function ProfessionRegistrationFields({
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
      <div className="overflow-hidden rounded-[1.5rem] bg-[#0d3d2e] px-6 py-7 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">Professional Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your professional profile details</h2>
        <p className="mt-2 text-sm text-white/60">These details will appear on your public professional profile — services, qualifications, expertise, and contact info.</p>
      </div>

      {/* Step 1 — Identity */}
      <Section label="Professional Identity & Contact" step="Step 1 · Identity">
        <F label="Full name / Practice name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. Advocate Ramesh Kumar / Dr. Priya Mehta" className={ic} />
        </F>
        {tf('professionType', 'Profession type *', 'Advocate, Doctor, Architect, CA, Designer, Engineer...', 1)}
        {tf('professionalTitle', 'Professional title / designation', 'Senior Civil Advocate, Chartered Accountant, LEED Architect...', 1)}
        {tf('tagline', 'Tagline', 'Your Trusted Legal Partner Since 2010', 2)}
        <F label="Phone *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Email *" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="contact@yourpractice.com" className={ic} /></F>
        <F label="Website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://yourpractice.com" className={ic} /></F>
        <F label="Office address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="Chamber / clinic / office address" className={ic} /></F>
        <F label="Professional bio *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Describe your professional background, what you specialize in, and how you help clients..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Services */}
      <Section label="Services & Expertise" step="Step 2 · What you offer">
        {lf('professionalServices', 'Professional services (one per line) *', 'Legal consultation\nContract drafting\nCourt representation\nProperty disputes\nFamily law matters', 4)}
        {lf('areasOfExpertise', 'Areas of expertise (comma separated) *', 'Civil law, Criminal law, Property disputes, Family law, Corporate law...', 2)}
        {lf('serviceLocations', 'Service locations', 'Local courts, High Court, Online consultation, Pan-India...', 2)}
      </Section>

      {/* Step 3 — Qualifications */}
      <Section label="Qualifications & Experience" step="Step 3 · Credentials">
        {tf('experience', 'Years of experience', '15+ years', 1)}
        {tf('clientsServed', 'Clients / cases handled', '500+', 1)}
        {tf('successRate', 'Success rate (if applicable)', '92%', 1)}
        {tf('clientRating', 'Client rating', '4.9/5', 1)}
        {lf('qualifications', 'Qualifications (one per line) *', 'LLB – Osmania University\nLLM – Delhi University\nBar Council enrollment', 3)}
        {lf('certifications', 'Memberships / certifications / licenses', 'Bar Council of AP, ICAI membership, IIA member...', 2)}
        {lf('highlights', 'Why choose me — key highlights (comma separated)', '25+ years experience, 500+ cases won, Client confidentiality guaranteed, Free initial consultation', 2)}
        {lf('notableWork', 'Notable cases / projects / work', 'Landmark property dispute case, National arbitration matter...', 3)}
      </Section>

      {/* Step 4 — Branding Media */}
      <Section label="Profile & Media" step="Step 4 · Visuals">
        <div className="col-span-2 text-xs text-ink/50">Upload your professional photo, office cover image, and gallery images.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Your professional photo / logo')}
          {renderSingleImageUpload?.('coverImage', 'Office / chamber cover image', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Gallery images (certificates, office, team etc.)</label>
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

      {/* Step 5 — Social */}
      <Section label="Social Media Links" step="Step 5 · Social presence">
        <F label="WhatsApp" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} /></F>
        <F label="Instagram" col={1}><input value={form.instagram || ''} onChange={update('instagram')} placeholder="https://instagram.com/..." className={ic} /></F>
        <F label="Facebook" col={1}><input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/..." className={ic} /></F>
        <F label="LinkedIn" col={1}><input value={form.linkedin || ''} onChange={update('linkedin')} placeholder="https://linkedin.com/in/..." className={ic} /></F>
        <F label="YouTube" col={2}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/..." className={ic} /></F>
      </Section>
    </div>
  );
}
