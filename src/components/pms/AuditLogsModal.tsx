import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { X, History, Search, ShieldCheck } from 'lucide-react';

interface AuditLogsModalProps {
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({ onClose }) => {
  const { auditLogs } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--navy-900)',
              color: 'var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <History size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)' }}>
                Tizim Harakatlari Tarixi (Audit Log)
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Xavfsizlik va o'zgarishlar monitoringi
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--slate-400)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
            <input 
              type="text" 
              placeholder="Operator, amal yoki obyekt bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Logs Table */}
          <div style={{ maxHeight: '420px', overflowY: 'auto', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vaqt</th>
                  <th>Operator</th>
                  <th>Amal (Action)</th>
                  <th>Tafsilotlar (Details)</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.78rem', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <strong style={{ color: 'var(--navy-900)', fontSize: '0.85rem' }}>
                        {log.operator}
                      </strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                        {log.role}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--slate-700)' }}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
