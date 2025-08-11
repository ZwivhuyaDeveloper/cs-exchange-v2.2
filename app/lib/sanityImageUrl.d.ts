declare module '@/lib/sanityImageUrl' {
  import { SanityImageSource } from '@sanity/image-url/lib/types/types';
  export function urlFor(source: SanityImageSource): {
    url(): string;
    width(pixels: number): this;
    height(pixels: number): this;
    fit(value: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'): this;
    [key: string]: any;
  };
}
