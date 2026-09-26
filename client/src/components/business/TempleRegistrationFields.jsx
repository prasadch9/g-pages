import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = `${ic} resize-y`;

function Section({ label, step, accent = 'amber', children }) {
  const colors = {
    amber:  { border: 'border-amber-200',  label: 'text-amber-700' },
    orange: { border: 'border-orange-200', label: 'text-orange-700' },
    rose:   { border: 'border-rose-200',   label: 'text-rose-700' },
    emerald:{ border: 'border-emerald-200',label: 'text-emerald-700' },
    blue:   { border: 'border-blue-200',   label: 'text-blue-700' },
    slate:  { border: 'border-slate-200',  label: 'text-slate-600' },
  };
  const c = colors[accent] || colors.amber;
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

export default function TempleRegistrationFields({
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
      <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#4a1d11] via-[#7a3f1d] to-[#1b100c] px-6 py-7 text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">Religious & Social · Temple Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your temple details</h2>
        <p className="mt-2 text-sm text-white/70">These details will appear on your public temple page — deity information, pooja timings, sevas, festivals, annadanam, and administration details.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          {['01 Identity', '02 Deity & Legend', '03 Poojas & Timings', '04 Festivals', '05 Facilities & Annadanam', '06 Trust & Donations', '07 Visuals', '08 Social'].map((s) => (
            <span key={s} className="rounded-full bg-white/10 px-3 py-1.5">{s}</span>
          ))}
        </div>
      </div>

      {/* Step 1 — Basic Identity */}
      <Section label="Temple Identity & Location" step="Step 1 · Basic Details" accent="amber">
        <F label="Temple name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. Sri Venkateswara Swamy Temple" className={ic} />
        </F>
        {tf('deityName', 'Primary deity / Moolavar *', 'e.g. Lord Shiva, Sri Rama, Goddess Durga, Lord Venkateswara', 1)}
        {tf('establishedYear', 'Established era / Historical year', 'e.g. 12th Century Chola Period, 1984', 1)}
        <F label="Temple phone / inquiry *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Temple email" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="office@temple.org" className={ic} /></F>
        <F label="Official website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://temple.org" className={ic} /></F>
        <F label="Full address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="Temple street, landmark, area" className={ic} /></F>
        <F label="Temple history & legend (Sthala Puranam) *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Write about the spiritual origin, miraculous events, history and significance of the temple..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Deity & Architecture */}
      <Section label="Deity & Temple Architecture" step="Step 2 · Sacred Details" accent="orange">
        {tf('tradition', 'Tradition / Sampradaya', 'e.g. Vaishnava, Shaiva, Smartha, Shakta', 1)}
        {tf('architecturalStyle', 'Architectural style', 'e.g. Dravidian, Kakatiya, Vijayanagara, Chalukya', 1)}
        {lf('subDeities', 'Sub-deities / Parivara Devatas (one per line)', 'Lord Ganesha\nGoddess Lakshmi\nLord Subrahmanya\nLord Anjaneya\nNavagrahas', 3)}
        {tf('pushkarini', 'Sacred pond / Pushkarini name', 'e.g. Swami Pushkarini, Brahma Teertham', 1)}
        {tf('gopuramDetails', 'Gopuram / Tower details', 'e.g. 7-tier Rajagopuram, 108 ft height', 1)}
      </Section>

      {/* Step 3 — Poojas, Sevas & Darshan */}
      <Section label="Pooja, Seva & Darshan Timings" step="Step 3 · Worship & Timings" accent="amber">
        {lf('timings', 'Daily temple & darshan timings (one per line) *', 'Morning: 6:00 AM - 12:30 PM\nEvening: 4:30 PM - 8:30 PM\nSuprabhata Seva: 5:00 AM\nEkanta Seva / Pavalimpu: 9:00 PM', 4)}
        {lf('poojaServices', 'Pooja & Seva services (one per line) *', 'Suprabhata Seva - ₹50\nNitya Archana - ₹100\nRudra Abhishekam - ₹250\nSahasranama Pooja - ₹150\nKalyanotsavam - ₹1,000\nVehicle Pooja - ₹200', 5)}
        {lf('specialPoojas', 'Special weekly / monthly poojas', 'Pradosha Pooja (Trayodashi)\nSatyanarayana Swamy Vratam (Pournami)\nSankashtahara Chaturthi\nNavagraha Homam', 3)}
        {lf('prasadam', 'Prasadam details', 'Laddu Prasadam, Pulihora, Daddojanam, Panchamrutham', 2)}
        {tf('dressCode', 'Dress code & temple guidelines', 'Traditional Indian attire (Dhoti/Kurta for men, Saree/Chudidar for women)', 2)}
      </Section>

      {/* Step 4 — Festivals & Annual Celebrations */}
      <Section label="Festivals & Annual Celebrations" step="Step 4 · Events & Utsavams" accent="rose">
        {lf('festivals', 'Major festivals celebrated (one per line) *', 'Maha Shivaratri\nSri Rama Navami\nNavaratri & Dussehra\nBrahmotsavam\nVaikunta Ekadasi\nVinayaka Chaturthi', 4)}
        {lf('kalyanotsavam', 'Annual Kalyanotsavam & Rathotsavam details', 'Annual celestial wedding festival, Chariot procession (Rathotsavam), Pallaki Seva', 2)}
        {lf('announcements', 'Upcoming festival notices & announcements', 'Annual Brahmotsavams starting from next month; Special pass counters open from Monday', 2)}
      </Section>

      {/* Step 5 — Facilities & Annadanam */}
      <Section label="Pilgrim Amenities & Annadanam" step="Step 5 · Facilities" accent="emerald">
        {lf('annadanam', 'Nitya Annadanam (free food) details', 'Free Annadanam daily from 12:00 PM to 2:30 PM. Serves 1000+ devotees every day.', 2)}
        {lf('accommodation', 'Choultry / Guest house / Accommodation', 'Air-conditioned and non-AC rooms available in Temple Guest House. Advance booking available.', 2)}
        {lf('amenities', 'Devotee amenities available', 'Free drinking water (RO), Cloakroom & luggage counter, Free footwear stand, 200+ car parking, Kalyana mandapam for marriages', 3)}
        {tf('elderlySupport', 'Wheelchair / Special assistance', 'Wheelchair access available at north gate; Battery car for senior citizens', 2)}
      </Section>

      {/* Step 6 — Trust, Administration & Donations */}
      <Section label="Trust Board & Donations" step="Step 6 · Trust & E-Hundi" accent="blue">
        {tf('trustName', 'Trust / Devasthanam board name', 'Sri Venkateswara Swamy Devasthanam Trust', 1)}
        {tf('regNumber', 'Devasthanam / Trust registration No.', 'e.g. ENDW/2012/9847', 1)}
        {tf('headPriest', 'Chief Priest / Dharmakartha', 'Name of head priest or trust chairman', 1)}
        {tf('governingBody', 'Governing body', 'Endowments Department / Private Trust / Village Committee', 1)}
        {lf('donationDetails', 'E-Hundi & Donation schemes (Annadanam, Nitya Seva, Temple Renovation)', 'Annadanam Shashwata Nidhi: ₹10,000\nNitya Pooja Scheme: ₹5,000\nGoshala Maintenance: ₹2,000\nUPI: temple@upi / 9876543210@sbi', 3)}
        {tf('taxExemption', '80G Tax Exemption status', 'Eligible under section 80G / Exempted', 2)}
      </Section>

      {/* Step 7 — Visuals & Media */}
      <Section label="Temple Photos & Visuals" step="Step 7 · Visuals" accent="slate">
        <div className="col-span-2 text-xs text-ink/50">Upload temple emblem/logo, main tower (gopuram) cover image, and photos of the temple premises.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Temple logo / emblem')}
          {renderSingleImageUpload?.('coverImage', 'Main temple / Gopuram cover photo', false)}
          {renderSingleImageUpload?.('aboutImage', 'Sanctum / Deity photo', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Temple premises & utsavam gallery</label>
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
        <F label="Live Darshan / YouTube video link (optional)" col={2}>
          <input type="url" value={form.videoUrls || ''} onChange={update('videoUrls')} placeholder="https://youtube.com/live/..." className={ic} />
          <p className="mt-1 text-xs text-ink/40">Paste YouTube link for live darshan, temple documentary or annual festival video.</p>
        </F>
      </Section>

      {/* Step 8 — Social Links */}
      <Section label="Temple Communications & Social Links" step="Step 8 · Contact & Social" accent="blue">
        <F label="WhatsApp update group / helpline" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} /></F>
        <F label="YouTube channel" col={1}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/@templechannel" className={ic} /></F>
        <F label="Facebook page" col={1}><input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/templepage" className={ic} /></F>
        <F label="Instagram" col={1}><input value={form.instagram || ''} onChange={update('instagram')} placeholder="https://instagram.com/temple" className={ic} /></F>
      </Section>
    </div>
  );
}
