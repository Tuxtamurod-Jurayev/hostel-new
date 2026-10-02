import React from 'react';
import { Utensils, Sparkles, Waves, Car, Shield, Wifi, Coffee, Clock } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <Utensils size={28} color="var(--gold-500)" />,
      title: "Fine Dining Restoran & Bar",
      description: "Sharqona va Yevropa taomlarining nodir uyg'unligi. Eng mohir oshpazlar tomonidan tayyorlangan lazzatlar."
    },
    {
      icon: <Waves size={28} color="var(--gold-500)" />,
      title: "Lounge & Isitiladigan Basseyn",
      description: "Yil bo'yi ishlaydigan panoramik basseyn, zamonaviy fin saunasi va turk xamomi."
    },
    {
      icon: <Sparkles size={28} color="var(--gold-500)" />,
      title: "SPA & Salomatlik Markazi",
      description: "Professional massaj, aromaterapiya va tana parvarishi bo'yicha eksklyuziv muolajalar."
    },
    {
      icon: <Car size={28} color="var(--gold-500)" />,
      title: "VIP Aeroport Transferi",
      description: "Islom Karimov nomidagi aeroportdan hashamatli premium avtomobillarda kutib olish va kuzatish."
    },
    {
      icon: <Clock size={28} color="var(--gold-500)" />,
      title: "24/7 Shaxsiy Konsyerj",
      description: "Shahardagi eng nufuzli maskanlarga buyurtmalar, ekskursiyalar va shaxsiy topshiriqlar bajarilishi."
    },
    {
      icon: <Shield size={28} color="var(--gold-500)" />,
      title: "Konferensiya & Biznes Zal",
      description: "Yuqori darajadagi muzokaralar, seminar va xalqaro uchrashuvlar uchun eng so'nggi audio-vizual jihozlar."
    }
  ];

  return (
    <section id="services" style={{ padding: '6rem 0', background: 'var(--slate-50)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem' }}>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--gold-600)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em'
          }}>
            BEKAMU-KO'ST XIZMATLAR
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--navy-900)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Har bir daqiqangiz maroqli o'tishi uchun
          </h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.6 }}>
            Mehmonxonamiz har bir mehmon uchun individual yondashuv va jahon andozalariga mos sifatni taqdim etadi.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {services.map((svc, idx) => (
            <div 
              key={idx}
              style={{
                background: '#ffffff',
                padding: '2.25rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-normal)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--gold-400)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--slate-200)';
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--gold-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                {svc.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                {svc.title}
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {svc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
