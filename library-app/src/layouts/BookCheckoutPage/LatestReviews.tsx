import React from 'react'
import ReviewModel from '../../models/ReviewModel'
import { Link } from 'react-router-dom'
import { Review } from '../Utils/Review'

export const LatestReviews: React.FC<{reviews: ReviewModel[], bookId: number | undefined, mobile: boolean}> = (props) => {
  return (
    <div className={props.mobile ? "mt-3" : "row mt-5"}>
        <div className={props.mobile ? "" : "col-sm-2 col-md-2"}>
            <h2>Latest Reviews: </h2>
        </div>
        <div className='col-sm-10 col-md-10'>
            {props.reviews.length > 0 ?
                <>
                    {/* Just showing top 3 latest review */}
                    {props.reviews.slice(0,3).map( review => (
                        <Review review={review} key={review.id}/>
                    ))}

                    <div className='m-3'>
                        <Link type="button" className='btn main-color btn-md text-white' to="#/">Reach all reviews.</Link>
                    </div>
                </> 
                :
                // When there is no review
                <div className='m-3'>
                    <p className='lead'>
                        Currently there is no reviews for this book
                    </p>
                </div>
            }
        </div>
    </div>
  )
}
