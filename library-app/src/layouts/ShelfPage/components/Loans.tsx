import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

const Loans = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState(null);
  const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);

  // Current Loans
  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
    ShelfCurrentLoans[]
  >([]);

  useEffect(() => {
    const fetchUserLoans = async () => {
      if (authState && authState.isAuthenticated) {
        const url: string = `http://localhost:8080/api/books/secure/currentloans`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };

        const shelfCurrentLoansResp = await fetch(url, requestOptions);

        if (!shelfCurrentLoansResp.ok) {
          throw new Error('Something went wrong');
        }

        const shelfCurrentLoansRespJson = await shelfCurrentLoansResp.json();
        setShelfCurrentLoans(shelfCurrentLoansRespJson);
      }

      setIsLoadingUserLoans(false);
    };

    fetchUserLoans().catch((error: any) => {
      setIsLoadingUserLoans(false);
      setHttpError(error.message);
    });

    window.scrollTo(0, 0);
  }, [authState]);

  if (isLoadingUserLoans) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className='container m-5'>
        <p>{httpError}</p>
      </div>
    );
  }

  return <div>Loans</div>;
};

export default Loans;
