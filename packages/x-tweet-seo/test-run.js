import { autogenerateTags } from './auto-tag.js';
import { topKeywordsFromTexts } from './trending.js';
console.log('Sample tags:', autogenerateTags('New X-Tweet video pipeline with Cloudinary and BunnyNet CDN for faster media delivery'));
console.log('Sample trending:', topKeywordsFromTexts(['X-Tweet video', 'Cloudinary integration', 'wallet security', 'X-Tweet video']));
