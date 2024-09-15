import React from 'react';
import styles from '@/styles/gw/_nextPage.module.scss';

const PageNext = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems,
  itemsPerPage
}) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const progress = (currentPage / totalPages) * 100;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.pagesplit}>
      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className={`${styles.paginationControls} mb-3`}>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          上一頁
        </button>
        <span className={styles.pageInfo}>
          第 {currentPage} 頁，共 {totalPages} 頁
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          下一頁
        </button>
      </div>

      {/* <div className={styles.itemCount}>
        顯示 {startItem} - {endItem} 項，共 {totalItems} 項
      </div> */}
    </div>
  );
};

export default PageNext;