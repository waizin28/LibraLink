import React, { useState } from 'react';
import Loans from './components/Loans';
import { HistoryPage } from './components/HistoryPage';

// Reference for tab: https://getbootstrap.com/docs/5.0/components/navs-tabs/
const ShelfPage = () => {
  // Force history page to load when new history loaded
  const [historyClick, setHistoryClick] = useState(false);
  return (
    <div className='container'>
      <div className='mt-3'>
        <nav>
          <div className='nav nav-tabs' id='nav-tab' role='tablist'>
            <button
              className='nav-link active'
              id='nav-loans-tab'
              data-bs-toggle='tab'
              data-bs-target='#nav-loans'
              type='button'
              role='tab'
              aria-controls='nav-loans'
              aria-selected='true'
              onClick={() => setHistoryClick(false)}
            >
              Loans
            </button>

            <button
              className='nav-link'
              id='nav-history-tab'
              data-bs-toggle='tab'
              data-bs-target='#nav-history'
              type='button'
              role='tab'
              aria-controls='nav-history'
              aria-selected='false'
              onClick={() => setHistoryClick(true)}
            >
              Your History
            </button>
          </div>
        </nav>

        <div className='tab-content' id='nav-tabContent'>
          {/* Will show Loans (current books that are checked out) */}
          <div
            className='tab-pane fade show active'
            id='nav-loans'
            role='tabpanel'
            aria-labelledby='nav-loans-tab'
          >
            <Loans />
          </div>

          {/* Will show all books that have been checked out and returned */}
          <div
            className='tab-pane fade'
            id='nav-history'
            role='tabpanel'
            aria-labelledby='nav-history-tab'
          >
            {historyClick ? <HistoryPage /> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelfPage;
