import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = `${ic} resize-y`;

function Section({ label, step, accent = 'emerald', children }) {
  const colors = {
    emerald:{ border: 'border-emerald-200',label: 'text-emerald-700' },
    teal:   { border: 'border-teal-200',   label: 'text-teal-700' },
    blue:   { border: 'border-blue-200',   label: 'text-blue-700' },
    amber:  { border: 'border-amber-200',  label: 'text-amber-700' },
    purple: { border: 'border-purple-200', label: 'text-purple-700' },
    slate:  { border: 'border-slate-200',  label: 'text-slate-600' },
  };
  const c = colors[accent] || colors.emerald;
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

export default function TrustRegistrationFields({
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
      <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#0c3826] via-[#165a3d] to-[#072418] px-6 py-7 text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">Religious & Social · Charitable Trust Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your charitable trust details</h2>
        <p className="mt-2 text-sm text-white/70">These details will appear on your public trust page — mission, welfare programs, projects, impact statistics, 80G tax exemptions, and donation details.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          {['01 Identity', '02 Mission & Vision', '03 Programs', '04 Projects', '05 Impact Record', '06 Donations & 80G', '07 Media', '08 Social'].map((s) => (
            <span key={s} className="rounded-full bg-white/10 px-3 py-1.5">{s}</span>
          ))}
        </div>
      </div>

      {/* Step 1 — Basic Identity & Registration */}
      <Section label="Trust Identity & Legal Registration" step="Step 1 · Basic Details" accent="emerald">
        <F label="Charitable Trust name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. Sri Sarada Educational & Charitable Trust" className={ic} />
        </F>
        {tf('regNumber', 'Trust Registration No. / Deed No. *', 'e.g. TRUST/2010/8942', 1)}
        {tf('managingTrustee', 'Managing Trustee / Chairperson *', 'e.g. Dr. K. Radhakrishna, Chairman', 1)}
        {tf('establishedYear', 'Established year', 'e.g. 2008', 1)}
        <F label="Contact phone *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Official email *" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="trust@charity.org" className={ic} /></F>
        <F label="Website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://trust.org" className={ic} /></F>
        <F label="Registered office address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="Trust office address, building, area" className={ic} /></F>
        <F label="About the trust & summary *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Describe your trust, founding purpose, core values, and community impact..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Mission & Vision */}
      <Section label="Mission, Vision & Core Pillars" step="Step 2 · Philosophy" accent="teal">
        {lf('mission', 'Core mission statement *', 'To empower underprivileged children and rural communities through accessible education, healthcare, and dignified livelihood opportunities.', 2)}
        {lf('vision', 'Long-term vision statement *', 'A poverty-free society where every individual has access to quality education, primary health, and basic necessities of life.', 2)}
        {lf('focusAreas', 'Core focus pillars (comma separated)', 'Child Education, Healthcare Aid, Elderly Welfare, Hunger Eradication, Women Empowerment, Rural Upliftment', 2)}
      </Section>

      {/* Step 3 — Welfare Programs */}
      <Section label="Welfare Programs & Schemes" step="Step 3 · Programs" accent="emerald">
        {lf('programs', 'Active welfare programs (one per line) *', 'Vidya Jyothi - Free schooling and books for orphans\nAarogya Seva - Free medical diagnosis & medicine distribution\nNitya Annadanam - Daily meals for 500+ destitute seniors\nSthree Shakthi - Vocational tailoring training for rural women\nDisaster Relief - Emergency relief supply kits during floods & calamities', 5)}
        {lf('beneficiaries', 'Target beneficiaries', 'Orphan children, destitute elderly, daily-wage families, differently-abled individuals, rural school students', 2)}
      </Section>

      {/* Step 4 — Ongoing Projects & Initiatives */}
      <Section label="Ongoing Projects & Initiatives" step="Step 4 · Projects" accent="blue">
        {lf('projects', 'Active projects & initiatives (one per line) *', 'Project Smile: Dialysis support fund for kidney patients\nRural Digital Classrooms: Setting up 15 smart schools in tribal areas\nOld Age Home Care: Residential care for 120 senior citizens\nClean Drinking Water Project: RO plants across 8 drought-prone villages', 4)}
        {lf('events', 'Upcoming events, fundraisers & camps', 'Free Cardiac Screening Camp on 2nd Sunday; Annual Charity Gala & Fundraiser in December; Blanket Distribution Drive in January', 2)}
      </Section>

      {/* Step 5 — Measurable Impact & Track Record */}
      <Section label="Impact Track Record & Metrics" step="Step 5 · Impact Record" accent="amber">
        {tf('impactLives', 'Total lives impacted / beneficiaries', '50,000+ people', 1)}
        {tf('scholarshipsAwarded', 'Scholarships / students supported', '2,400+ students', 1)}
        {tf('medicalAidProvided', 'Free treatments / surgeries funded', '10,000+ patients', 1)}
        {tf('villagesServed', 'Villages / communities covered', '45+ villages', 1)}
        {lf('impact', 'Detailed impact summary & milestones', 'Distributed ₹5 Crores in educational aid over 15 years; Set up 3 free clinics; Constructed 2 senior citizen homes; Recognized by State Government for excellence in social service.', 3)}
      </Section>

      {/* Step 6 — Donations & 80G Tax Exemption */}
      <Section label="Donations & Tax Exemption" step="Step 6 · Tax & Giving" accent="purple">
        {tf('taxExemption', '80G Tax Exemption Certificate No. *', 'e.g. AABTS1234F20214', 1)}
        {tf('section12A', 'Section 12A Registration No.', 'e.g. 12A/HYD/2011/762', 1)}
        {tf('fcraStatus', 'FCRA Registration (for international donations)', 'Applicable / Under Process / Valid', 1)}
        {tf('darpanId', 'NITI Aayog NGO Darpan ID', 'e.g. AP/2018/0189234', 1)}
        {lf('donationPurpose', 'Donation schemes & bank account / UPI details *', 'Account Name: Sri Sarada Educational & Charitable Trust\nA/C No: 987654321098\nIFSC: SBIN0004321\nBank: State Bank of India\nUPI ID: trust@sbi / 9876543210@upi\nSchemes: Sponsor a child (₹1,500/mo), Annadanam (₹5,000/day)', 4)}
      </Section>

      {/* Step 7 — Visuals & Documentation */}
      <Section label="Trust Media & Photos" step="Step 7 · Visuals" accent="slate">
        <div className="col-span-2 text-xs text-ink/50">Upload trust emblem/logo, field work cover photo, and photos of activities, beneficiary support, and medical camps.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Trust emblem / logo')}
          {renderSingleImageUpload?.('coverImage', 'Field work / Cover photo', false)}
          {renderSingleImageUpload?.('aboutImage', 'Trust banner / Project photo', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Field work & program gallery</label>
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
        <F label="Documentary / YouTube video link (optional)" col={2}>
          <input type="url" value={form.videoUrls || ''} onChange={update('videoUrls')} placeholder="https://youtube.com/..." className={ic} />
          <p className="mt-1 text-xs text-ink/40">Paste YouTube link for impact documentary or annual charity report video.</p>
        </F>
      </Section>

      {/* Step 8 — Social Links */}
      <Section label="Trust Communications & Social Links" step="Step 8 · Contact & Social" accent="emerald">
        <F label="WhatsApp helpline" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} /></F>
        <F label="LinkedIn page" col={1}><input value={form.linkedin || ''} onChange={update('linkedin')} placeholder="https://linkedin.com/company/trust" className={ic} /></F>
        <F label="Facebook page" col={1}><input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/trustpage" className={ic} /></F>
        <F label="YouTube channel" col={1}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/@trustchannel" className={ic} /></F>
      </Section>
    </div>
  );
}
