import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const AboutContactSection: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    setFormSent(true);
    setTimeout(() => {
      setName('');
      setContact('');
      setMessage('');
      setFormSent(false);
    }, 4000);
  };

  return (
    <section id="about" style={{ padding: '6rem 0', background: 'var(--slate-50)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          
          {/* About text & Contact details */}
          <div>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--gold-600)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em'
            }}>
              MEHMONXONA HAQIDA
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--navy-900)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              Silk Road Palace Hotel & Suites
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Qadimiy Ipak yo'lining boy madaniy merosi va zamonaviy arxitektura durdonasi 
              uyg'unlashgan maskanimiz poytaxtimizning eng nufuzli markazida joylashgan.
            </p>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Biz har bir mehmonga shohona ehtirom, qulay sharoit va unutilmas xotiralar hadya etishni 
              oliy maqsad deb bilamiz.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--gold-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-600)'
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Manzilimiz</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '0.92rem' }}>
                    Amir Temur ko'chasi, 45, Toshkent, O'zbekiston
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--gold-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-600)'
                }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Telefon / Reception</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '0.92rem' }}>
                    +998 (71) 200-88-77 / +998 (90) 123-45-67
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--gold-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-600)'
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Elektron pochta</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '0.92rem' }}>
                    reservation@silkroadpalace.uz
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div style={{
            background: '#ffffff',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--slate-200)'
          }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              Savolingiz bormi?
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
              Qo'ng'iroqqa buyurtma bering yoki xabar qoldiring, administratorimiz 15 daqiqada siz bilan bog'lanadi.
            </p>

            {formSent ? (
              <div style={{
                background: 'var(--status-available-bg)',
                color: '#065f46',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid var(--status-available-border)'
              }}>
                <CheckCircle2 size={24} />
                <div>
                  <strong>Xabaringiz qabul qilindi!</strong>
                  <div style={{ fontSize: '0.82rem' }}>Tez orada siz bilan bog'lanamiz.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Ismingiz
                  </label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Azizbek"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Telefon yoki Email
                  </label>
                  <input 
                    type="text" 
                    placeholder="+998 90 000 00 00"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Xabaringiz
                  </label>
                  <textarea 
                    rows={3} 
                    placeholder="Savolingiz yoki taklifingiz..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <button type="submit" className="btn btn-navy" style={{ marginTop: '0.5rem' }}>
                  <Send size={16} />
                  <span>Xabarni yuborish</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
