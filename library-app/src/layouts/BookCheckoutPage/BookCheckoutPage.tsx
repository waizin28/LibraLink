import { useState } from 'react';
import BookModel from '../../models/BookModel';
import { useEffect } from 'react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { StarsReview } from '../Utils/StarsReview';
import { CheckoutAndReview } from './CheckoutAndReview';
import ReviewModel from '../../models/ReviewModel';
import { LatestReviews } from './LatestReviews';
import { useOktaAuth } from '@okta/okta-react';

export const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // For review
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  // has this user left review on this book
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  // Loans count
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true);

  // Is Book Checkout?
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  // Getting the url and get path parm by splitting to get bookId
  const bookId = window.location.pathname.split('/')[2];

  // To get each book
  useEffect(() => {
    const fetchBooks = async () => {
      const url: string = `http://localhost:8080/api/books/${bookId}`;

      const resp = await fetch(url);

      if (!resp.ok) {
        throw new Error('Something went wrong!');
      }

      const reponseJson = await resp.json();

      const loadedBooks: BookModel = {
        id: reponseJson.id,
        title: reponseJson.title,
        author: reponseJson.author,
        description: reponseJson.description,
        copies: reponseJson.copies,
        copiesAvailable: reponseJson.copiesAvailable,
        category: reponseJson.category,
        img: reponseJson.imd,
      };

      setBook(loadedBooks);
      setIsLoading(false);
    };

    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut, isReviewLeft]);

  // Getting reviews
  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
      const responseReview = await fetch(reviewUrl);

      if (!responseReview.ok) {
        throw new Error('Something went wrong');
      }

      const responseJsonReviews = await responseReview.json();

      const responseData = responseJsonReviews._embedded.reviews;

      const loadReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in responseData) {
        loadReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          book_id: responseData[key].bookId,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedStarReviews = weightedStarReviews + responseData[key].rating;
      }

      if (loadReviews) {
        // Finding total star average
        // rating / number of books = need to round nearest .5
        const round = (
          Math.round((weightedStarReviews / loadReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadReviews);
      setIsLoadingReview(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [bookId]);

  // g
  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState?.isAuthenticated) {
        const url = `http://localhost:8080/api/reviews/secure/user/book/?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };

        const reviewResp = await fetch(url, requestOptions);

        if (!reviewResp.ok) {
          throw new Error('Something went wrong');
        }

        const reviewJson = await reviewResp.json();

        if (reviewJson._embedded.reviews.length > 0) {
          setIsReviewLeft(reviewJson);
        }
      }
      setIsLoadingUserReview(false);
    };

    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [authState]);

  // Getting loan count
  useEffect(() => {
    const currentUserLoanCount = async () => {
      if (authState && authState.isAuthenticated) {
        // Only call the api when user is authenticated
        const url = `http://localhost:8080/api/books/secure/currentloans/count`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };

        const currentLoanResp = await fetch(url, requestOptions);

        if (!currentLoanResp.ok) {
          throw new Error('Something went wrong');
        }

        const currentLoanJson = await currentLoanResp.json();
        setCurrentLoansCount(currentLoanJson);
      }
      setIsLoadingCurrentLoansCount(false);
    };

    currentUserLoanCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [authState, isCheckedOut]);

  useEffect(() => {
    const fetchUserCheckedOutBooks = async () => {
      if (authState && authState?.isAuthenticated) {
        const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };

        const bookCheckedOutResp = await fetch(url, requestOptions);

        if (!bookCheckedOutResp.ok) {
          throw new Error('Something went wrong');
        }

        const bookCheckedOutJson = await bookCheckedOutResp.json();
        setIsCheckedOut(bookCheckedOutJson);
      }
      setIsLoadingBookCheckedOut(false);
    };
    fetchUserCheckedOutBooks().catch((err: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(err.message);
    });
  }, [authState]);

  if (
    isLoading ||
    isLoadingReview ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckedOut ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className='container m-5'>
        <p>{httpError}</p>
      </div>
    );
  }

  async function checkoutBook() {
    const url = `http://localhost:8080/api/books/secure/checkout/?bookId=${bookId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const checkoutRep = await fetch(url, requestOptions);

    if (!checkoutRep.ok) {
      throw new Error('Something went wrong');
    }

    setIsCheckedOut(true);
  }

  return (
    <div>
      <div className='container d-none d-lg-block'>
        <div className='row mt-5'>
          {/* Creating a picture and description on side for each book */}

          <div className='col-sm-2 col-md-2'>
            {book?.img ? (
              <img src={book?.img} width='226' height='349' alt='Book' />
            ) : (
              <img
                src={require('../../Images/BooksImages/book-luv2code-1000.png')}
                width='226'
                height='349'
                alt='Book'
              />
            )}
          </div>

          <div className='col-4 col-md-4 container'>
            <div className='ml-2'>
              <h2>{book?.title}</h2>
              <h5 className='text-primary'>{book?.author}</h5>
              <p className='lead'>{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReview
            book={book}
            mobile={false}
            currentLoansCount={currentLoansCount}
            isAuthenticated={authState?.isAuthenticated}
            isCheckedOut={isCheckedOut}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>

      {/* Mobile app */}
      <div className='container d-lg-none mt-5'>
        <div className='d-flex justify-content-center align-items-center'>
          {book?.img ? (
            <img src={book?.img} width='226' height='349' alt='Book' />
          ) : (
            <img
              src={require('../../Images/BooksImages/book-luv2code-1000.png')}
              width='226'
              height='349'
              alt='Book'
            />
          )}
        </div>
        <div className='mt-4'>
          <div className='ml-2'>
            <h2>{book?.title}</h2>
            <h5 className='text-primary'>{book?.author}</h5>
            <p className='lead'>{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReview
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isAuthenticated={authState?.isAuthenticated}
          isCheckedOut={isCheckedOut}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
