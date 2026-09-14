import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalItems, pageSize, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 1rem',
      backgroundColor: 'white',
      borderTop: '1px solid #e2e8f0',
      flexWrap: 'wrap',
      gap: '0.75rem',
      fontSize: '0.85rem',
      color: '#64748b'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span>Hiển thị</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            color: '#0f172a',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <option value={10}>10 bản ghi</option>
          <option value={20}>20 bản ghi</option>
          <option value={50}>50 bản ghi</option>
        </select>
        <span>trên tổng số <strong>{totalItems}</strong> kết quả</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Trang <strong>{currentPage}</strong> / {totalPages}</span>
        <button
          className="btn-icon"
          onClick={handlePrev}
          disabled={currentPage === 1}
          style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          aria-label="Trang trước"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="btn-icon"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          aria-label="Trang sau"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
