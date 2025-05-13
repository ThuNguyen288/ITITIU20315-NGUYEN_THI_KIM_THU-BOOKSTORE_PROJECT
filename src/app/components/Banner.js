'use client'

import Image from 'next/image'
import Promo1 from '/public/BannerImg/Promo1.svg'
import Promo2 from '/public/BannerImg/Promo2.svg'

export default function Banner() {
  return (
    <div id="carouselExampleCaptions" className="carousel slide w-full mx-auto overflow-hidden">
      <div className="carousel-inner">
        <div className="carousel-item active relative w-full">
          <Image
            src={Promo1}
            alt="Promo 1"
            className="object-cover"
            priority
          />
        </div>
        <div className="carousel-item relative w-full">
          <Image
            src={Promo2}
            alt="Promo 2"
            className="object-cover"
          />
        </div>
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}
