const SiteSettings = require('../models/SiteSettings');
const { AppError } = require('../middleware/errorHandler');

const DEFAULT_SETTINGS = {
  instagramUrl: '',
  facebookUrl: '',
  whatsappNumber: '919876543210',
};

const readSettings = async () => {
  const settings = await SiteSettings.findById('global').lean();
  return { ...DEFAULT_SETTINGS, ...settings };
};

const normalizeSocialUrl = (value, label, domains) => {
  const input = String(value || '').trim();
  if (!input) return '';

  let url;
  try {
    url = new URL(input);
  } catch {
    throw new AppError(`Enter a valid ${label} profile URL.`, 400);
  }

  const hostname = url.hostname.toLowerCase();
  const isAllowedHost = domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  if (url.protocol !== 'https:' || !isAllowedHost) {
    throw new AppError(`Use a secure ${label} profile URL.`, 400);
  }

  return url.toString();
};

const getPublicSettings = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: await readSettings() });
  } catch (error) {
    next(error);
  }
};

const getAdminSettings = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: await readSettings() });
  } catch (error) {
    next(error);
  }
};

const updateAdminSettings = async (req, res, next) => {
  try {
    const rawNumber = String(req.body.whatsappNumber || '').trim();
    const whatsappNumber = rawNumber.replace(/\D/g, '');
    if (whatsappNumber && (whatsappNumber.length < 8 || whatsappNumber.length > 15)) {
      throw new AppError('WhatsApp number must contain 8 to 15 digits, including the country code.', 400);
    }

    const settings = await SiteSettings.findByIdAndUpdate(
      'global',
      {
        instagramUrl: normalizeSocialUrl(req.body.instagramUrl, 'Instagram', ['instagram.com']),
        facebookUrl: normalizeSocialUrl(req.body.facebookUrl, 'Facebook', ['facebook.com', 'fb.com']),
        whatsappNumber,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: 'Site settings saved.', data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublicSettings, getAdminSettings, updateAdminSettings };