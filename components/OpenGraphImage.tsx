import { ImageResponse } from 'next/og';
import Image from 'next/image';

// These dimensions are the default for OpenGraph images
export const width = 1200;
export const height = 630;

type OpenGraphImageProps = {
  title?: string;
  description?: string;
  image?: string;
};

export default function OpenGraphImage({ 
  title = 'Cyclespace',
  description = 'Crypto trading and analytics platform',
  image
}: OpenGraphImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        {image ? (
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.2,
            overflow: 'hidden'
          }}>
            <Image
              src={image}
              alt=""
              fill
              style={{
                objectFit: 'cover',
              }}
              unoptimized={true} // Required for external images in ImageResponse
            />
          </div>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 1 }}>
          <h1 style={{ fontSize: '4rem', margin: 0 }}>{title}</h1>
          <p style={{ fontSize: '2rem', opacity: 0.8, margin: 0 }}>{description}</p>
        </div>
      </div>
    ),
    {
      width,
      height,
    },
  )
}
