import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity';

// Create an image builder instance
export const urlFor = (source: any) => {
  return imageUrlBuilder(client).image(source);
};
