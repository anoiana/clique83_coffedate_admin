import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Typography } from '../Typography/Typography';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, style }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '24px', 
      marginTop: '32px',
      ...style 
    }}>
      {/* Prev Button */}
      <button
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isFirstPage ? 'not-allowed' : 'pointer',
          opacity: isFirstPage ? 0.3 : 1,
          transition: 'all 0.2s ease',
          color: 'var(--text-primary)'
        }}
        onMouseEnter={(e) => { if(!isFirstPage) e.currentTarget.style.borderColor = 'var(--primary)'; }}
        onMouseLeave={(e) => { if(!isFirstPage) e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Typography variant="body" style={{ fontWeight: 600, color: 'var(--primary)' }}>{currentPage}</Typography>
        <Typography variant="caption" style={{ textTransform: 'none', letterSpacing: 0 }}>of</Typography>
        <Typography variant="body" style={{ fontWeight: 600 }}>{totalPages}</Typography>
      </div>

      {/* Next Button */}
      <button
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isLastPage ? 'not-allowed' : 'pointer',
          opacity: isLastPage ? 0.3 : 1,
          transition: 'all 0.2s ease',
          color: 'var(--text-primary)'
        }}
        onMouseEnter={(e) => { if(!isLastPage) e.currentTarget.style.borderColor = 'var(--primary)'; }}
        onMouseLeave={(e) => { if(!isLastPage) e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
