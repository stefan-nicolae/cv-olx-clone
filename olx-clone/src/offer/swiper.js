// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

let key = 0
export default function SwiperElement (props) {
    return(
        <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
      >


        {
            props.images.map(image => {
                const myImg = document.createElement("img")
                myImg.src = `${image}`
                const width = myImg.naturalWidth
                const height = myImg.naturalHeight
                let className
                if(width > height) className="wide"
                if(height >= width) className="tall"
                return(<SwiperSlide key={key++}>
                    <img className={className} src={image}></img>
                </SwiperSlide>)
            })
        }
      </Swiper>
    )
}