import React from 'react';

const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const textareaClass = `${inputClass} resize-y`;

function Section({ label, step, children }) {
  return (
    <div className="rounded-[1.25rem] border border-sky-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">{step}</p>
      <h3 className="mt-1 font-display text-xl font-semibold text-slate-800">{label}</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, col = 2, children }) {
  return (
    <div className={`col-span-2 sm:col-span-${col}`}>
      <label className="text-sm font-medium text-ink/75">{label}</label>
      {children}
    </div>
  );
}

/**
 * ConsultancyRegistrationFields — dedicated form for Consultancies subcategory.
 * Props:
 *   form       — parent form state (contains name, phone, email, website, description, facebook, instagram, whatsapp, linkedin)
 *   categoryData  — categoryData sub-object
 *   update     — (field) => handler for form fields
 *   updateCategoryData — (key, value) => handler for categoryData keys
 *   inputClass — optional override
 *   uploadedFiles — { logo, coverImage, aboutImage, galleryImages }
 *   renderSingleImageUpload — function to render single image upload
 *   handleLocalFiles — function to handle local file picks
 *   removeUploadedImage — function to remove uploaded image
 */
export default function ConsultancyRegistrationFields({
  form,
  categoryData = {},
  update,
  updateCategoryData,
  uploadedFiles = {},
  renderSingleImageUpload,
  handleLocalFiles,
  removeUploadedImage,
}) {
  const ic = inputClass;
  const tc = textareaClass;

  const listField = (key, label, placeholder, rows = 2) => (
    <Field label={label} col={2}>
      <textarea
        rows={rows}
        value={categoryData[key] || ''}
        onChange={(e) => updateCategoryData(key, e.target.value)}
        placeholder={placeholder}
        className={tc}
      />
    </Field>
  );

  const textFieldSmall = (key, label, placeholder, col = 1) => (
    <Field label={label} col={col}>
      <input
        value={categoryData[key] || ''}
        onChange={(e) => updateCategoryData(key, e.target.value)}
        placeholder={placeholder}
        className={ic}
      />
    </Field>
  );

  return (
    <div className="col-span-2 space-y-5">
      {/* Hero info */}
      <div className="overflow-hidden rounded-[1.5rem] bg-[#061f35] px-6 py-7 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300">Consultancy Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your consultancy details</h2>
        <p className="mt-2 text-sm text-white/60">These details will appear on your public consultancy brand page — hero, services, team, gallery, and contact sections.</p>
      </div>

      {/* 1. Basic Identity */}
      <Section label="Basic Identity & Contact" step="Step 1 · Identity">
        <Field label="Consultancy / Business name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. Veritas Business Consultants" className={ic} />
        </Field>
        <Field label="Consultancy type *" col={1}>
          <input
            value={categoryData.consultancyType || ''}
            onChange={(e) => updateCategoryData('consultancyType', e.target.value)}
            placeholder="Management, Legal, Finance, Education..."
            className={ic}
          />
        </Field>
        <Field label="Tagline" col={1}>
          <input
            value={categoryData.tagline || ''}
            onChange={(e) => updateCategoryData('tagline', e.target.value)}
            placeholder="Strategic Consulting for a Smarter Tomorrow"
            className={ic}
          />
        </Field>
        <Field label="Phone *" col={1}>
          <input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} />
        </Field>
        <Field label="Email *" col={1}>
          <input type="email" value={form.email || ''} onChange={update('email')} placeholder="info@consultancy.com" className={ic} />
        </Field>
        <Field label="Website" col={1}>
          <input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://www.yourconsultancy.com" className={ic} />
        </Field>
        <Field label="Address *" col={1}>
          <input value={form.address || ''} onChange={update('address')} placeholder="Office address" className={ic} />
        </Field>
        <Field label="About your consultancy *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Describe your consultancy, mission, and what sets you apart..." className={tc} />
        </Field>
      </Section>

      {/* 2. Expertise & Services */}
      <Section label="Expertise & Services" step="Step 2 · What you offer">
        {listField('areasOfExpertise', 'Areas of expertise (comma or newline separated) *', 'Strategy, Finance, Technology, Operations, HR...', 3)}
        {listField('consultingServices', 'Consulting services (one per line) *', 'Business planning\nAudits & compliance\nMarket research\nProcess improvement', 4)}
        {listField('industriesServed', 'Industries served', 'Healthcare, Manufacturing, Retail, IT, Real Estate...', 2)}
        {listField('serviceLocations', 'Service locations', 'Vijayawada, Hyderabad, Bengaluru, Online...', 2)}
      </Section>

      {/* 3. Why Choose Us */}
      <Section label="Why Choose Us" step="Step 3 · Your strengths">
        {textFieldSmall('yearsExperience', 'Years of experience', '10+', 1)}
        {textFieldSmall('happyClients', 'Happy clients', '500+', 1)}
        {textFieldSmall('successRate', 'Success rate', '95%', 1)}
        {textFieldSmall('clientRating', 'Client rating (e.g. 4.8/5)', '4.8/5', 1)}
        {listField('highlights', 'Why choose us — key highlights (comma separated)', 'Expert guidance, Tailored solutions, Proven track record, Client-first approach', 2)}
        {listField('certifications', 'Certifications / accreditations', 'ISO 9001, NASSCOM, CII member...', 2)}
      </Section>

      {/* 4. Team & Case Studies */}
      <Section label="Team & Case Studies" step="Step 4 · Credibility">
        {listField('teamMembers', 'Team members (name – designation, one per line)', 'Arun Kumar – Managing Partner\nPriya Sharma – Strategy Lead', 3)}
        {listField('caseStudies', 'Case studies / notable projects (one per line)', 'Helped XYZ Corp increase revenue by 40%\nImplemented ERP for 3 factories', 3)}
        {listField('clients', 'Notable clients', 'Reliance Industries, Infosys, Apollo Hospitals...', 2)}
      </Section>

      {/* 5. Branding Media */}
      <Section label="Branding & Media" step="Step 5 · Visuals">
        <div className="col-span-2 text-xs text-ink/50">Upload your logo, cover photo, and gallery images. These appear on your hero and gallery sections.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Consultancy logo')}
          {renderSingleImageUpload?.('coverImage', 'Hero cover image', false)}
          {renderSingleImageUpload?.('aboutImage', 'About section image', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Gallery images (multiple uploads)</label>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(uploadedFiles.galleryImages || []).map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded border border-line bg-white">
                <img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full object-contain" />
                <button
                  type="button"
                  onClick={() => removeUploadedImage?.('galleryImages', index)}
                  className="w-full border-t border-line bg-vermilion/5 px-2 py-2 text-[11px] font-medium text-vermilion hover:bg-vermilion/10"
                >
                  Remove
                </button>
              </div>
            ))}
            <label className="flex min-h-[110px] cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white px-3 py-4 text-center text-xs text-ink/60 hover:border-ink/40">
              Add photos
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleLocalFiles?.('galleryImages', e.target.files, true)} />
            </label>
          </div>
        </div>
        <Field label="Video URL (optional)" col={2}>
          <input
            type="url"
            value={form.videoUrls || ''}
            onChange={update('videoUrls')}
            placeholder="https://www.youtube.com/watch?v=..."
            className={ic}
          />
          <p className="mt-1 text-xs text-ink/45">Paste a YouTube or video URL to display on your public page.</p>
        </Field>
      </Section>

      {/* 6. Social Media */}
      <Section label="Social Media Links" step="Step 6 · Social presence">
        <Field label="WhatsApp" col={1}>
          <input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} />
        </Field>
        <Field label="Instagram" col={1}>
          <input value={form.instagram || ''} onChange={update('instagram')} placeholder="https://instagram.com/..." className={ic} />
        </Field>
        <Field label="Facebook" col={1}>
          <input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/..." className={ic} />
        </Field>
        <Field label="LinkedIn" col={1}>
          <input value={form.linkedin || ''} onChange={update('linkedin')} placeholder="https://linkedin.com/company/..." className={ic} />
        </Field>
        <Field label="YouTube" col={2}>
          <input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/..." className={ic} />
        </Field>
      </Section>
    </div>
  );
}
