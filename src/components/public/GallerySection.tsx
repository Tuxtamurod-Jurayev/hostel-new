import React from 'react';

export const GallerySection: React.FC = () => {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      title: 'Mehmonxona fasadi & Kechki ko\'rinish',
      colSpan: '2'
    },
    {
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      title: 'Executive Suite yotoqxonasi',
      colSpan: '1'
    },
    {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      title: 'Silk Road Grand Restorani',
      colSpan: '1'
    },
    {
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      title: 'Presidential Penthouse Zali',
      colSpan: '2'
    },
    {
      url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
      title: 'Lounge & Isitiladigan Basseyn',
      colSpan: '1'
    },
    {
      url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      title: 'Deluxe King Xonasi',
      colSpan: '1'
    }
  ];

  return (
    <section id="gallery" style={{ padding: '6rem 0', background: '#ffffff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--gold-600)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em'
          }}>
            FOTO GALEREYA
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--navy-900)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Bizning maskanimiz suratlarda
          </h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.6 }}>
            Har bir burchakda nozik did va sharqona hashamat nafasi sezilib turadi.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {images.map((img, idx) => (
            <div 
              key={idx}
              style={{
                position: 'relative',
                height: '280px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer'
              }}
            >
              <img 
                src={img.url} 
                alt={img.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7, 13, 30, 0.85) 0%, transparent 60%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1.25rem',
                color: '#ffffff',
                pointerEvents: 'none'
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
