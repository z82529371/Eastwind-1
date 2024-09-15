import { FaSearch } from 'react-icons/fa'
import styles from '@/styles/gw/_Search.module.scss'
import { useRef, useState } from 'react';

export default function RoomSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchArea}>
    <div className={styles.searchArea}>
      <div className={`${styles.searchBox} input-group`}>
        <input
          type="text"
          className="form-control"
          placeholder="請輸入店家"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn " type="submit" id="button-addon2">
          <FaSearch />
        </button>
      </div>
    </div>
    </form>
  )
}
