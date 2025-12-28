import { Template } from '../types/imageEditor';

export const IMAGE_EDITOR_TEMPLATES: Template[] = [
  {
    id: 'wb-studio-clean',
    name: 'WB Studio Clean',
    marketplace: 'WB',
    description: 'White background, strict form preservation'
  },
  {
    id: 'ozon-lifestyle-soft',
    name: 'Ozon Lifestyle Soft',
    marketplace: 'Ozon',
    description: 'Realistic interior, soft daylight'
  },
  {
    id: 'premium-apple-look',
    name: 'Premium Apple Look',
    marketplace: 'Both',
    description: 'Light gray background, premium lighting'
  }
];

export const STYLES = ['minimal', 'premium', 'eco', 'fashion', 'tech', 'lifestyle'] as const;
export const MOODS = ['clean', 'warm', 'bright', 'dark', 'professional'] as const;
