// import { useState, useEffect } from 'react'
// import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
// import { format } from 'date-fns'

// const ProductReviews = ({ productId }) => {
//     const [reviews, setReviews] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const [rating, setRating] = useState(0)
//     const [comment, setComment] = useState('')
//     const [showAll, setShowAll] = useState(false)

//     useEffect(() => {
//         const fetchReviews = async () => {
//             try {
//                 const response = await fetch(`/api/review?productId=${productId}`);
//                 const data = await response.json()
//                 setReviews(data)
//             } catch (error) {
//                 setError('Error fetching reviews')
//             } finally {
//                 setLoading(false)
//             }
//         }

//         if (productId) {
//             fetchReviews()
//         }
//     }, [productId])

//     const renderStars = (rating) => {
//         const stars = []
//         for (let i = 1; i <= 5; i++) {
//             if (i <= Math.floor(rating)) {
//                 stars.push(<FaStar key={i} className="text-warning" size={16} />)
//             } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
//                 stars.push(<FaStarHalfAlt key={i} className="text-warning" size={16} />)
//             } else {
//                 stars.push(<FaRegStar key={i} className="text-warning" size={16} />)
//             }
//         }
//         return stars
//     }

//     const handlePostReview = async (event) => {
//         event.preventDefault()
//         // Post review logic here
//     }

//     const handleSetComment = (event) => {
//         setComment(event.target.value)
//     }

//     const changeFormatDay = (dateString) => {
//         const date = new Date(dateString)
//         return format(date, 'MMMM dd, yyyy')
//     }

//     if (loading) {
//         return <div>Loading reviews...</div>
//     }

//     if (error) {
//         return <div>{error}</div>
//     }

//     const visibleReviews = showAll ? reviews : reviews.slice(0, 3)

//     return (
//         <div className="product-reviews">
//             <h2>Reviews</h2>
//             <button onClick={() => setShowAll(!showAll)}>
//                 {showAll ? 'Show Less' : 'Show All'}
//             </button>

//             <div className="reviews-summary">
//                 <div className="rating-summary">
//                     <h3>{product.AverageRating}</h3>
//                     <div className="stars">
//                         {renderStars(product.AverageRating)}
//                     </div>
//                     <p>{product.TotalReviews} reviews</p>
//                 </div>

//                 {visibleReviews.map((review) => (
//                     <div key={review.ReviewID} className="review">
//                         <div className="review-header">
//                             <span className="review-rating">
//                                 {renderStars(review.Rating)}
//                             </span>
//                             <span className="review-date">
//                                 {changeFormatDay(review.CreatedAt)}
//                             </span>
//                         </div>
//                         <p>{review.Comment}</p>
//                     </div>
//                 ))}
//             </div>

//             <form onSubmit={handlePostReview}>
//                 <div className="rating">
//                     {[...Array(5)].map((star, index) => {
//                         const ratingValue = index + 1
//                         return (
//                             <label key={index}>
//                                 <input
//                                     type="radio"
//                                     value={ratingValue}
//                                     onClick={() => setRating(ratingValue)}
//                                     style={{ display: 'none' }}
//                                 />
//                                 <FaStar
//                                     color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
//                                     size={25}
//                                 />
//                             </label>
//                         )
//                     })}
//                 </div>

//                 <textarea
//                     value={comment}
//                     onChange={handleSetComment}
//                     placeholder="Write your review..."
//                 />
//                 <button type="submit">Post Review</button>
//             </form>
//         </div>
//     )
// }

// export default ProductReviews


import { useState, useEffect } from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { format } from 'date-fns'

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [showAll, setShowAll] = useState(false)

    useEffect(() => {
        // Fake data for testing the front-end
        const fakeReviews = [
            {
                ReviewID: 1,
                Rating: 5,
                CreatedAt: '2023-12-25T12:00:00Z',
                Comment: 'Excellent product! Highly recommended.',
            },
            {
                ReviewID: 2,
                Rating: 4,
                CreatedAt: '2023-12-20T12:00:00Z',
                Comment: 'Good product, but it could be better.',
            },
            {
                ReviewID: 3,
                Rating: 3,
                CreatedAt: '2023-12-18T12:00:00Z',
                Comment: 'It works fine, but some features are lacking.',
            },
            {
                ReviewID: 4,
                Rating: 2,
                CreatedAt: '2023-12-10T12:00:00Z',
                Comment: 'Not satisfied with the quality.',
            },
        ]

        // Simulating a delay to mimic fetching data
        setTimeout(() => {
            setReviews(fakeReviews)
            setLoading(false)
        }, 1000)
    }, [productId])

    const renderStars = (rating) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<FaStar key={i} className="text-warning" size={16} />)
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                stars.push(<FaStarHalfAlt key={i} className="text-warning" size={16} />)
            } else {
                stars.push(<FaRegStar key={i} className="text-warning" size={16} />)
            }
        }
        return stars
    }

    const handlePostReview = async (event) => {
        event.preventDefault()
        // Post review logic here
    }

    const handleSetComment = (event) => {
        setComment(event.target.value)
    }

    const changeFormatDay = (dateString) => {
        const date = new Date(dateString)
        return format(date, 'MMMM dd, yyyy')
    }

    if (loading) {
        return <div>Loading reviews...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    const visibleReviews = showAll ? reviews : reviews.slice(0, 3)

    return (
        <div className="product-reviews">
            <h2>Reviews</h2>
            <button onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show Less' : 'Show All'}
            </button>

            <div className="reviews-summary">
                <div className="rating-summary">
                    <h3>{productId ? "4.5" : "No Product"}</h3> {/* Example for average rating */}
                    <div className="stars">
                        {renderStars(4.5)} {/* Example for rating display */}
                    </div>
                    <p>{reviews.length} reviews</p>
                </div>

                {visibleReviews.map((review) => (
                    <div key={review.ReviewID} className="review">
                        <div className="review-header">
                            <span className="review-rating">
                                {renderStars(review.Rating)}
                            </span>
                            <span className="review-date">
                                {changeFormatDay(review.CreatedAt)}
                            </span>
                        </div>
                        <p>{review.Comment}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handlePostReview}>
                <div className="rating">
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1
                        return (
                            <label key={index}>
                                <input
                                    type="radio"
                                    value={ratingValue}
                                    onClick={() => setRating(ratingValue)}
                                    style={{ display: 'none' }}
                                />
                                <FaStar
                                    color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
                                    size={25}
                                />
                            </label>
                        )
                    })}
                </div>

                <textarea
                    value={comment}
                    onChange={handleSetComment}
                    placeholder="Write your review..."
                />
                <button type="submit">Post Review</button>
            </form>
        </div>
    )
}

export default ProductReviews
