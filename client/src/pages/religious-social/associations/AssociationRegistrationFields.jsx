import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = `${ic} resize-y`;

function Section({ label, step, accent = 'slate', children }) {
  const colors = {
    slate:  { border: 'border-slate-200',  label: 'text-slate-700' },
    indigo: { border: 'border-indigo-200', label: 'text-indigo-700' },
    blue:   { border: 'border-blue-200',   label: 'text-blue-700' },
    emerald:{ border: 'border-emerald-200',label: 'text-emerald-700' },
    amber:  { border: 'border-amber-200',  label: 'text-amber-700' },
    rose:   { border: 'border-rose-200',   label: 'text-rose-700' },
  };
  const c = colors[accent] || colors.slate;
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

export default function AssociationRegistrationFields({
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
      <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#0f172a] px-6 py-7 text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">Religious & Social · Association Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your association details</h2>
        <p className="mt-2 text-sm text-white/70">These details will appear on your public association page — membership details, community activities, committee leadership, events, and member benefits.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          {['01 Identity', '02 Memberships', '03 Activities', '04 Committee', '05 Events', '06 Benefits', '07 Visuals', '08 Social'].map((s) => (
            <span key={s} className="rounded-full bg-white/10 px-3 py-1.5">{s}</span>
          ))}
        </div>
      </div>

      {/* Step 1 — Basic Identity & Legal Status */}
      <Section label="Association Identity & Legal Details" step="Step 1 · Basic Details" accent="slate">
        <F label="Association name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. Greater Hyderabad Resident Welfare Association" className={ic} />
        </F>
        {tf('associationType', 'Association Type', 'e.g. Resident Welfare / Trade / Cultural / Alumni / Professional', 1)}
        {tf('regNumber', 'Society Registration No. *', 'e.g. REG/SOC/2014/342', 1)}
        {tf('presidentName', 'President / Chairperson *', 'e.g. Sri V. Nageswara Rao, President', 1)}
        {tf('establishedYear', 'Established year', 'e.g. 2005', 1)}
        <F label="Contact phone *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Official email *" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="office@association.org" className={ic} /></F>
        <F label="Website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://association.org" className={ic} /></F>
        <F label="Registered headquarters address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="Association office, community building, area" className={ic} /></F>
        <F label="About the association & motto *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Write about the founding purpose, values, community objectives, and milestones of the association..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Membership & Eligibility */}
      <Section label="Memberships & Community Base" step="Step 2 · Memberships" accent="indigo">
        {lf('memberships', 'Membership tiers & fee structure (one per line) *', 'Life Membership: ₹10,000 (one-time)\nAnnual Regular Member: ₹1,200/year\nAssociate / Student Member: ₹500/year\nCorporate / Patron Member: ₹25,000', 4)}
        {tf('totalMembers', 'Total active members count', 'e.g. 1,200+ active members', 1)}
        {tf('eligibility', 'Eligibility criteria', 'Residents of the locality / Graduates of the institution / Registered business owners', 1)}
        {lf('admissionProcess', 'How to join / Membership process', 'Fill membership application form → Verification by Executive Committee → Fee payment & ID card issuance', 2)}
      </Section>

      {/* Step 3 — Activities & Programs */}
      <Section label="Activities & Community Initiatives" step="Step 3 · Activities" accent="blue">
        {lf('activities', 'Core activities & services (one per line) *', 'Monthly General Body & Member Meetings\nCivic & Infrastructure Grievance Redressal\nCommunity Health & Blood Donation Camps\nCultural & Festival Celebrations\nMember Welfare & Mutual Aid Assistance\nEnvironmental & Cleanliness Drives (Swachhata)', 5)}
        {lf('programs', 'Ongoing welfare & development programs', 'Senior Citizen Support Wing; Youth Career Guidance Sessions; Women Entrepreneurship Circle; Legal Aid Advisory Desk', 3)}
      </Section>

      {/* Step 4 — Executive Committee & Leadership */}
      <Section label="Executive Committee & Leadership" step="Step 4 · Committee" accent="amber">
        {lf('committee', 'Executive Committee Members (one per line) *', 'President: Sri V. Nageswara Rao\nVice-President: Smt. M. Sunitha\nGeneral Secretary: Sri K. Ramesh Babu\nJoint Secretary: Sri P. Srinivas\nTreasurer: Sri D. Suresh Kumar\nAdvisory Board: 5 Senior Members', 5)}
        {tf('termDuration', 'Committee term duration', 'e.g. 2 Years (Elections held biennially)', 2)}
      </Section>

      {/* Step 5 — Events & Annual General Meeting */}
      <Section label="Conferences, Events & Meetings" step="Step 5 · Events" accent="rose">
        {lf('events', 'Major annual events & conferences (one per line) *', 'Annual General Body Meeting (AGM) - July\nAnnual Foundation Day & Cultural Festival\nInter-Colony Sports Tournament\nRepublic Day & Independence Day Flag Hoisting', 4)}
        {lf('announcements', 'Current notices & meeting announcements', 'Annual General Meeting scheduled for next Sunday at 10 AM in the Community Hall; Election nomination forms available at the office', 2)}
      </Section>

      {/* Step 6 — Member Benefits & Community Hall */}
      <Section label="Member Benefits & Facilities" step="Step 6 · Benefits" accent="emerald">
        {lf('memberBenefits', 'Member benefits & privileges (one per line)', 'Access to Community Hall at discounted rental\nFree participation in medical & wellness camps\nLegal & municipal grievance support\nAnnual Member Directory & Networking Access\nBenevolent financial assistance in medical emergencies', 4)}
        {tf('communityHall', 'Community Hall / Clubhouse facility', 'Air-conditioned hall with 400 seating capacity & dining facility', 1)}
        {tf('paymentDetails', 'Fee payment bank / UPI details', 'UPI: association@upi / SBI A/C: 1234567890', 1)}
      </Section>

      {/* Step 7 — Visuals & Media */}
      <Section label="Association Visuals & Media" step="Step 7 · Visuals" accent="slate">
        <div className="col-span-2 text-xs text-ink/50">Upload association emblem/logo, headquarters/community hall cover photo, and gallery photos of events and member gatherings.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Association emblem / logo')}
          {renderSingleImageUpload?.('coverImage', 'Headquarters / Hall cover photo', false)}
          {renderSingleImageUpload?.('aboutImage', 'Executive committee photo', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Events, gatherings & committee gallery</label>
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
        <F label="Event celebration / YouTube video link (optional)" col={2}>
          <input type="url" value={form.videoUrls || ''} onChange={update('videoUrls')} placeholder="https://youtube.com/..." className={ic} />
          <p className="mt-1 text-xs text-ink/40">Paste YouTube link for AGM recording, festival celebration, or documentary.</p>
        </F>
      </Section>

      {/* Step 8 — Social Links */}
      <Section label="Association Communications & Social Links" step="Step 8 · Contact & Social" accent="blue">
        <F label="WhatsApp members group / announcements" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://chat.whatsapp.com/..." className={ic} /></F>
        <F label="Facebook group / page" col={1}><input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/groups/..." className={ic} /></F>
        <F label="LinkedIn organization page" col={1}><input value={form.linkedin || ''} onChange={update('linkedin')} placeholder="https://linkedin.com/company/..." className={ic} /></F>
        <F label="YouTube channel" col={1}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/@..." className={ic} /></F>
      </Section>
    </div>
  );
}
