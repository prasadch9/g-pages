import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = `${ic} resize-y`;

function Section({ label, step, accent = 'green', children }) {
  const colors = {
    green:  { border: 'border-green-200',  label: 'text-green-700' },
    emerald:{ border: 'border-emerald-200',label: 'text-emerald-700' },
    teal:   { border: 'border-teal-200',   label: 'text-teal-700' },
    blue:   { border: 'border-blue-200',   label: 'text-blue-700' },
    amber:  { border: 'border-amber-200',  label: 'text-amber-700' },
    slate:  { border: 'border-slate-200',  label: 'text-slate-600' },
  };
  const c = colors[accent] || colors.green;
  return (
    <div className={`rounded-[1.25rem] border ${c.border} bg-white p-5 shadow-sm sm:p-7`}>
      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${c.label}`}>{step}</p>
      <h3 className="mt-1 font-display text-xl font-semibold text-slate-800">{label}</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function F({ label, col = 2, children }) {
  return (
    <div className={col === 1 ? 'col-span-2 sm:col-span-1' : 'col-span-2'}>
      <label className="text-sm font-medium text-ink/75">{label}</label>
      {children}
    </div>
  );
}

export default function NgoRegistrationFields({
  form,
  categoryData = {},
  update,
  updateCategoryData,
  uploadedFiles = {},
  renderSingleImageUpload,
  handleLocalFiles,
  removeUploadedImage,
}) {
  const lf = (key, label, ph, rows = 2) => (
    <F label={label} col={2}>
      <textarea
        rows={rows}
        value={categoryData[key] || ''}
        onChange={(e) => updateCategoryData(key, e.target.value)}
        placeholder={ph}
        className={tc}
      />
    </F>
  );

  const tf = (key, label, ph, col = 1) => (
    <F label={label} col={col}>
      <input
        value={categoryData[key] || ''}
        onChange={(e) => updateCategoryData(key, e.target.value)}
        placeholder={ph}
        className={ic}
      />
    </F>
  );

  return (
    <div className="col-span-2 space-y-5">
      {/* Hero Banner */}
      <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#0f3829] via-[#1c7245] to-[#092b1e] px-6 py-7 text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">Religious & Social · NGO / Non-Profit Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your NGO details</h2>
        <p className="mt-2 text-sm text-white/70">These details will appear on your public NGO page — core causes, field projects, volunteer opportunities, measurable impact, and donation channels.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          {['01 Identity', '02 Causes', '03 Projects', '04 Measurable Impact', '05 Volunteers', '06 Funding & CSR', '07 Media', '08 Social'].map((s) => (
            <span key={s} className="rounded-full bg-white/10 px-3 py-1.5">{s}</span>
          ))}
        </div>
      </div>

      {/* Step 1 — Basic Identity & Legal Status */}
      <Section label="NGO Identity & Legal Standing" step="Step 1 · Basic Details" accent="green">
        <F label="NGO / Organization name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. Navajeevan Community Development Society" className={ic} />
        </F>
        {tf('regType', 'Registration Type', 'Societies Act / Section 8 Company / Public Charitable Trust', 1)}
        {tf('regNumber', 'Registration Number *', 'e.g. SOC/2012/1054', 1)}
        {tf('darpanId', 'NITI Aayog NGO Darpan ID', 'e.g. AP/2019/0223456', 1)}
        {tf('directorName', 'Founder / Executive Director *', 'e.g. Smt. K. Anitha, Founder & President', 1)}
        <F label="Contact phone *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Official email *" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="contact@ngo.org" className={ic} /></F>
        <F label="Website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://ngo.org" className={ic} /></F>
        <F label="Head office address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="NGO head office, building, street, city" className={ic} /></F>
        <F label="About the organization & mission *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Write about your NGO's vision, core values, history, community impact, and the people you serve..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Core Causes & Target Communities */}
      <Section label="Causes & Focus Communities" step="Step 2 · Causes" accent="emerald">
        {lf('causes', 'Core causes / thematic areas (one per line) *', 'Child Rights & Quality Education\nHealthcare, Maternal & Child Nutrition\nWomen Empowerment & Livelihood Skills\nClean Water, Sanitation & Hygiene (WASH)\nEnvironmental Sustainability & Tree Plantation\nDisability Rehabilitation & Support', 5)}
        {lf('targetCommunities', 'Target communities & geographies', 'Tribal hamlets, rural villages, urban slum settlements, women artisans, child laborers, marginalized communities', 2)}
      </Section>

      {/* Step 3 — Flagship Projects & Field Campaigns */}
      <Section label="Active Projects & Field Campaigns" step="Step 3 · Field Projects" accent="teal">
        {lf('projects', 'Active projects & campaigns (one per line) *', 'Project Vidya: Remedial tuition centers for 1,200 slum children\nProject Sanjeevani: Mobile medical vans serving 30 remote villages\nProject Shakthi: Micro-entrepreneurship training for 500 rural women\nGreen Canopy: 50,000 native tree plantation across degraded lands', 4)}
        {lf('events', 'Upcoming awareness drives & campaigns', 'Annual Walkathon for Girl Child Education (Next Month); Community Health & Eye Screening Camp; Beach Cleanup Drive', 2)}
      </Section>

      {/* Step 4 — Measurable Impact & Metrics */}
      <Section label="Measurable Impact & Achievements" step="Step 4 · Impact Metrics" accent="amber">
        {tf('impactLives', 'People supported / lives transformed', '65,000+ lives', 1)}
        {tf('childrenEducated', 'Children enrolled / educated', '4,500+ children', 1)}
        {tf('villagesReached', 'Villages / communities covered', '80+ villages', 1)}
        {tf('volunteersActive', 'Active volunteer network', '350+ volunteers', 1)}
        {lf('impact', 'Detailed impact summary & milestones', 'Reached 65,000+ beneficiaries across 80 villages; Established 12 learning centers; Empowered 1,500 women through self-help groups; Recognized by United Nations Volunteers (UNV) partner network.', 3)}
        {lf('awardsPartnerships', 'Key CSR partners & awards', 'CSR Partners: Tata Trusts, Infosys Foundation, Tech Mahindra CSR; Awarded Best Grassroots NGO 2023 by State Council.', 2)}
      </Section>

      {/* Step 5 — Volunteer & Career Opportunities */}
      <Section label="Volunteer Network & Opportunities" step="Step 5 · Volunteers" accent="blue">
        {lf('volunteerOpportunities', 'Volunteer roles available (one per line) *', 'Weekend School Teacher / Tutor\nField Medical Volunteer (Nurses & Doctors)\nDigital Content Creator & Social Media Volunteer\nEvent & Campaign Coordinator\nFundraising & Grant Writing Volunteer', 4)}
        {tf('volunteerProcess', 'Volunteer signup / selection process', 'Register online → Quick orientation session → Join local field team', 2)}
      </Section>

      {/* Step 6 — Support Options & CSR Grants */}
      <Section label="Support Options, Donations & CSR" step="Step 6 · Support & Funding" accent="green">
        {tf('taxExemption', '80G Exemption Certificate No.', 'e.g. AABTN5432G20218', 1)}
        {tf('section12A', '12A Registration No.', 'e.g. 12A/2013/452', 1)}
        {tf('fcraStatus', 'FCRA Registration status', 'Valid / Available for Foreign Contribution', 1)}
        {tf('csr1Number', 'MCA CSR-1 Registration No.', 'e.g. CSR00012345', 1)}
        {lf('supportOptions', 'How supporters & CSR can contribute *', 'Sponsor a Child Education: ₹1,200/month\nSupport a Rural Health Camp: ₹15,000/camp\nCorporate CSR Partnership: Tailored impact projects\nBank Details: A/C 987654321, IFSC: SBIN0001234, UPI: ngo@upi', 4)}
      </Section>

      {/* Step 7 — Visuals & Field Work Media */}
      <Section label="Field Work Visuals & Media" step="Step 7 · Visuals" accent="slate">
        <div className="col-span-2 text-xs text-ink/50">Upload NGO emblem/logo, field work cover photo, and gallery photos of community impact, teaching, and relief distribution.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'NGO logo / emblem')}
          {renderSingleImageUpload?.('coverImage', 'Field work / Cover photo', false)}
          {renderSingleImageUpload?.('aboutImage', 'Community impact banner photo', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Community projects & field activity gallery</label>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(uploadedFiles.galleryImages || []).map((img, i) => (
              <div key={i} className="overflow-hidden rounded border border-line bg-white">
                <img src={img} alt={`Gallery ${i + 1}`} className="h-24 w-full object-contain" />
                <button type="button" onClick={() => removeUploadedImage?.('galleryImages', i)} className="w-full border-t border-line bg-red-50 px-2 py-2 text-[11px] font-medium text-red-500 hover:bg-red-100">Remove</button>
              </div>
            ))}
            <label className="flex min-h-[110px] cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white px-3 py-4 text-center text-xs text-ink/60 hover:border-ink/40">
              Add photos<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleLocalFiles?.('galleryImages', e.target.files, true)} />
            </label>
          </div>
        </div>
        <F label="Impact Documentary / YouTube video link (optional)" col={2}>
          <input type="url" value={form.videoUrls || ''} onChange={update('videoUrls')} placeholder="https://youtube.com/..." className={ic} />
          <p className="mt-1 text-xs text-ink/40">Paste YouTube link for impact documentary or annual outreach report video.</p>
        </F>
      </Section>

      {/* Step 8 — Social Links */}
      <Section label="NGO Communications & Social Presence" step="Step 8 · Contact & Social" accent="green">
        <F label="WhatsApp volunteer helpline" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} /></F>
        <F label="Instagram handle" col={1}><input value={form.instagram || ''} onChange={update('instagram')} placeholder="https://instagram.com/ngo" className={ic} /></F>
        <F label="LinkedIn organization page" col={1}><input value={form.linkedin || ''} onChange={update('linkedin')} placeholder="https://linkedin.com/company/ngo" className={ic} /></F>
        <F label="YouTube channel" col={1}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/@ngo" className={ic} /></F>
      </Section>
    </div>
  );
}
