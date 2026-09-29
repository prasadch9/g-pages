import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = ic + ' resize-y';

function Section({ label, step, accent = 'amber', children }) {
  const colors = {
    amber: { border: 'border-amber-200', label: 'text-amber-700' },
    blue:  { border: 'border-blue-200',  label: 'text-blue-700'  },
    green: { border: 'border-green-200', label: 'text-green-700' },
    rose:  { border: 'border-rose-200',  label: 'text-rose-700'  },
    slate: { border: 'border-slate-200', label: 'text-slate-600' },
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

export default function PackersMoversRegistrationFields({
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
      {/* Hero Banner */}
      <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#1a2f4a] to-[#0f1f35] px-6 py-7 text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">Logistics & Moving · Packers & Movers Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your moving company details</h2>
        <p className="mt-2 text-sm text-white/60">These details will appear on your public brand page — moving services, fleet, coverage areas, pricing, and contact info.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          {['01 Identity', '02 Services', '03 Fleet & Storage', '04 Process', '05 Pricing', '06 Credibility', '07 Media', '08 Social'].map(s => (
            <span key={s} className="rounded-full bg-white/10 px-3 py-1.5">{s}</span>
          ))}
        </div>
      </div>

      {/* Step 1 — Identity */}
      <Section label="Basic Identity & Contact" step="Step 1 · Identity" accent="amber">
        <F label="Company name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. SafeMove Packers & Movers" className={ic} />
        </F>
        {tf('tagline', 'Tagline', 'Your Trusted Moving Partner Since 2010', 2)}
        <F label="Phone *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Email *" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="info@safemove.com" className={ic} /></F>
        <F label="Website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://safemove.com" className={ic} /></F>
        <F label="Head office address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="Full office address" className={ic} /></F>
        <F label="About your company *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Describe your moving company — experience, mission, and what makes you reliable..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Services */}
      <Section label="Moving Services" step="Step 2 · What you offer" accent="blue">
        {lf('movingServices', 'Moving services (one per line) *',
          'Residential moving\nOffice / commercial relocation\nInter-city moving\nInternational shipping\nVehicle transportation\nPlant & machinery shifting', 5)}
        {lf('specialHandling', 'Special handling services',
          'Fragile item handling, Piano moving, Art & antique transport, Medical equipment', 2)}
        {lf('additionalServices', 'Additional services',
          'Packing only, Unpacking & arrangement, Furniture assembly, Cleaning after move', 2)}
      </Section>

      {/* Step 3 — Fleet & Storage */}
      <Section label="Fleet & Storage" step="Step 3 · Fleet & storage" accent="green">
        {lf('fleet', 'Fleet (one per line) *',
          'Mini trucks (Tata Ace)\nMedium trucks (14 ft)\nLarge containers (24 ft)\nRefrigerated vans\nCar carriers', 4)}
        {lf('storageOptions', 'Storage / warehousing options',
          'Short-term storage, Long-term warehousing, Temperature-controlled, Self-storage units', 2)}
        {tf('fleetCount', 'Number of vehicles in fleet', '25+', 1)}
        {tf('warehouseArea', 'Warehouse area (if any)', '10,000 sq ft', 1)}
      </Section>

      {/* Step 4 — Coverage & Process */}
      <Section label="Coverage Areas & Moving Process" step="Step 4 · Coverage & process" accent="rose">
        {lf('serviceAreas', 'Service areas / coverage (one per line) *',
          'Vijayawada\nHyderabad\nBengaluru\nChennai\nPan India\nInternational', 4)}
        {lf('movingProcess', 'Moving process steps (one per line) *',
          'Free survey & quote\nCustom packing plan\nProfessional packing\nLoading & transport\nDelivery & unloading\nUnpacking & arrangement', 5)}
        {lf('insuranceCoverage', 'Insurance / transit coverage',
          'Full transit insurance up to ₹10 lakhs, Door-to-door coverage, Damage compensation policy', 2)}
      </Section>

      {/* Step 5 — Pricing & Offers */}
      <Section label="Pricing & Offers" step="Step 5 · Pricing" accent="amber">
        {tf('startingPrice', 'Starting price (approximate)', '₹5,000 onwards', 1)}
        {tf('freeQuote', 'Free survey / quote', 'Yes — call or WhatsApp us', 1)}
        {lf('packages', 'Available packages',
          'Basic packing only, Standard moving, Premium door-to-door, Custom enterprise plan', 2)}
        {lf('offers', 'Current offers / discounts',
          '10% off on bookings above ₹20,000, Free unpacking for long-distance moves', 2)}
      </Section>

      {/* Step 6 — Credibility */}
      <Section label="Track Record & Credibility" step="Step 6 · Credibility" accent="green">
        {tf('yearsExperience', 'Years in business', '12+', 1)}
        {tf('movesCompleted', 'Moves completed', '10,000+', 1)}
        {tf('clientRating', 'Client rating', '4.8/5', 1)}
        {tf('teamSize', 'Team size', '50+ trained staff', 1)}
        {lf('highlights', 'Why choose us — key highlights (comma separated)',
          'GPS tracking, Safe packing materials, On-time delivery, 24/7 support, Damage-free guarantee', 2)}
        {lf('certifications', 'Certifications / registrations',
          'IBA approved, GST registered, ISO certified, MSME registered', 2)}
        {lf('notableClients', 'Notable clients / projects',
          'Relocated 500+ corporate offices, Government project moves, Hospital equipment relocation', 2)}
      </Section>

      {/* Step 7 — Branding & Media */}
      <Section label="Branding & Media" step="Step 7 · Visuals" accent="slate">
        <div className="col-span-2 text-xs text-ink/50">Upload your company logo, fleet/office cover photo, and gallery images to display on your public page.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Company logo')}
          {renderSingleImageUpload?.('coverImage', 'Hero / fleet cover image', false)}
          {renderSingleImageUpload?.('aboutImage', 'About section image', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Gallery images (fleet, team, warehouse, packing process)</label>
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
        <F label="YouTube / Video URL (optional)" col={2}>
          <input type="url" value={form.videoUrls || ''} onChange={update('videoUrls')} placeholder="https://youtube.com/..." className={ic} />
          <p className="mt-1 text-xs text-ink/40">Paste a YouTube video showing your moving process or fleet.</p>
        </F>
      </Section>

      {/* Step 8 — Social */}
      <Section label="Social Media Links" step="Step 8 · Social presence" accent="blue">
        <F label="WhatsApp" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} /></F>
        <F label="Instagram" col={1}><input value={form.instagram || ''} onChange={update('instagram')} placeholder="https://instagram.com/..." className={ic} /></F>
        <F label="Facebook" col={1}><input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/..." className={ic} /></F>
        <F label="LinkedIn" col={1}><input value={form.linkedin || ''} onChange={update('linkedin')} placeholder="https://linkedin.com/company/..." className={ic} /></F>
        <F label="YouTube channel" col={2}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/..." className={ic} /></F>
      </Section>
    </div>
  );
}
