import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = `${ic} resize-y`;

function Section({ label, step, accent = 'blue', children }) {
  const colors = {
    blue:   { border: 'border-blue-200',   label: 'text-blue-700' },
    indigo: { border: 'border-indigo-200', label: 'text-indigo-700' },
    purple: { border: 'border-purple-200', label: 'text-purple-700' },
    emerald:{ border: 'border-emerald-200',label: 'text-emerald-700' },
    amber:  { border: 'border-amber-200',  label: 'text-amber-700' },
    slate:  { border: 'border-slate-200',  label: 'text-slate-600' },
  };
  const c = colors[accent] || colors.blue;
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

export default function ChurchRegistrationFields({
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
      <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#102b52] via-[#214d7d] to-[#101e34] px-6 py-7 text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300">Religious & Social · Church Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your church details</h2>
        <p className="mt-2 text-sm text-white/70">These details will appear on your public church page — worship service timings, pastor details, ministries, prayer meetings, and community outreach.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          {['01 Identity', '02 Worship Timings', '03 Ministries', '04 Events & Conventions', '05 Community Outreach', '06 Leadership & Giving', '07 Visuals', '08 Social'].map((s) => (
            <span key={s} className="rounded-full bg-white/10 px-3 py-1.5">{s}</span>
          ))}
        </div>
      </div>

      {/* Step 1 — Basic Identity */}
      <Section label="Church Identity & Contact" step="Step 1 · Basic Details" accent="blue">
        <F label="Church name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. Calvary Fellowship Church, St. Paul's Cathedral" className={ic} />
        </F>
        {tf('pastorName', 'Senior Pastor / Parish Priest *', 'e.g. Rev. Dr. John Wesley, Fr. Joseph', 1)}
        {tf('denomination', 'Denomination / Affiliation', 'e.g. Baptist, CSI, Catholic, Pentecostal, Methodist, Independent', 1)}
        {tf('establishedYear', 'Established year', 'e.g. 1995', 1)}
        <F label="Contact phone / prayer helpline *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Official email" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="pastor@church.org" className={ic} /></F>
        <F label="Official website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://church.org" className={ic} /></F>
        <F label="Full address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="Church campus street, landmark, area" className={ic} /></F>
        <F label="About the church & vision *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Describe your church community, belief statement, core mission, and welcome message..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Worship Services & Timings */}
      <Section label="Worship Services & Timings" step="Step 2 · Worship & Prayer" accent="indigo">
        {lf('worshipServices', 'Sunday worship services (one per line) *', '1st Service (Telugu): 7:00 AM - 9:00 AM\n2nd Service (English): 9:30 AM - 11:30 AM\nEvening Service: 6:00 PM - 8:00 PM\nSunday School (Children): 9:30 AM', 4)}
        {lf('timings', 'Weekday & prayer meeting timings (one per line) *', 'Tuesday Fasting Prayer: 10:30 AM - 1:00 PM\nWednesday Bible Study: 7:00 PM - 8:30 PM\nFriday All-Night Prayer: 10:00 PM - 5:00 AM\nSaturday Youth Fellowship: 6:30 PM', 4)}
        {tf('communionTiming', 'Holy Communion service schedule', 'First Sunday of every month at all services', 1)}
        {tf('languages', 'Languages of service', 'Telugu, English, Hindi, Tamil', 1)}
      </Section>

      {/* Step 3 — Ministries & Fellowships */}
      <Section label="Ministries & Departments" step="Step 3 · Ministries" accent="purple">
        {lf('ministries', 'Ministries & departments (one per line) *', 'Youth Fellowship (Ignite)\nWomen Fellowship (Dorcas Society)\nMen Fellowship (Brothers Fellowship)\nSunday School & Kids Ministry\nChoir & Praise & Worship Team\nIntercessory Prayer Ministry\nOutreach & Evangelism Team', 5)}
        {lf('communityPrograms', 'Community care & cell groups', 'Home care cell groups across 20+ areas; Hospital visit ministry; Prison outreach; Marriage counseling sessions', 3)}
      </Section>

      {/* Step 4 — Events & Annual Conventions */}
      <Section label="Events, Conferences & Festivals" step="Step 4 · Gatherings" accent="rose">
        {lf('events', 'Major annual events & conventions (one per line) *', 'Annual Church Convention (November)\nChristmas Carols & New Year Eve Midnight Service\nGood Friday & Easter Resurrection Service\nYouth Summer Camp & VBS (May)\nLeadership & Bible Training Seminar', 4)}
        {lf('announcements', 'Current church notices & announcements', 'Vacation Bible School registrations open for children aged 5-15; Fasting prayer this Friday at 10 AM', 2)}
      </Section>

      {/* Step 5 — Facilities & Community Outreach */}
      <Section label="Facilities & Community Outreach" step="Step 5 · Campus & Outreach" accent="emerald">
        {tf('sanctuaryCapacity', 'Prayer hall seating capacity', 'e.g. 1,500 seats (air-conditioned)', 1)}
        {tf('parkingCapacity', 'Parking & campus area', 'e.g. 100+ car parking, 2-acre campus', 1)}
        {lf('facilities', 'Church facilities available', 'Air-conditioned main hall, Fellowship dining hall, Audio/video live broadcast setup, Counseling room, Wheelchair ramp & accessible restrooms', 3)}
        {lf('socialOutreach', 'Social welfare & charity work', 'Weekly free food distribution to poor families; Free health camps every quarter; Educational aid for underprivileged students', 2)}
      </Section>

      {/* Step 6 — Leadership & Giving */}
      <Section label="Leadership & Contribution" step="Step 6 · Leadership & Giving" accent="amber">
        {tf('associatePastors', 'Associate Pastors / Elders', 'Rev. Timothy, Pastor Samuel, Elder Thomas', 1)}
        {tf('regNumber', 'Society / Trust registration No.', 'e.g. REG/SOC/2005/1432', 1)}
        {lf('donationDetails', 'Tithes, Offerings & Building Fund details', 'Account Name: Calvary Fellowship Church\nA/C No: 123456789012\nIFSC: SBIN0001234\nUPI: church@sbi / 9876543210@upi', 3)}
        {tf('counselingHelpline', '24/7 Prayer Helpline number', '+91 98765 00000', 1)}
        {tf('taxExemption', '80G / 12A exemption status', 'Registered under 12A / 80G available', 1)}
      </Section>

      {/* Step 7 — Visuals & Media */}
      <Section label="Church Visuals & Media" step="Step 7 · Visuals" accent="slate">
        <div className="col-span-2 text-xs text-ink/50">Upload church emblem/cross logo, main building exterior cover photo, and photos of the sanctuary and congregation.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Church logo / Cross emblem')}
          {renderSingleImageUpload?.('coverImage', 'Church building exterior cover photo', false)}
          {renderSingleImageUpload?.('aboutImage', 'Sanctuary / Altar photo', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Worship service, choir & community gallery</label>
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
        <F label="Live Stream / YouTube service link (optional)" col={2}>
          <input type="url" value={form.videoUrls || ''} onChange={update('videoUrls')} placeholder="https://youtube.com/live/..." className={ic} />
          <p className="mt-1 text-xs text-ink/40">Paste YouTube link for Sunday service live stream or choir music video.</p>
        </F>
      </Section>

      {/* Step 8 — Social Links */}
      <Section label="Church Media & Social Presence" step="Step 8 · Contact & Social" accent="blue">
        <F label="WhatsApp prayer & announcements group" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} /></F>
        <F label="YouTube channel (Sermons & Live)" col={1}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/@churchlive" className={ic} /></F>
        <F label="Facebook page" col={1}><input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/churchpage" className={ic} /></F>
        <F label="Instagram" col={1}><input value={form.instagram || ''} onChange={update('instagram')} placeholder="https://instagram.com/church" className={ic} /></F>
      </Section>
    </div>
  );
}
