import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div style={{ overflowX: 'auto', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'rgba(255, 215, 0, 0.03)', borderBottom: '1px solid var(--border)' }}>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  padding: '16px 24px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
