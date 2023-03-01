// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

let key = 0
export default function SwiperBottom (props) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={20} 
      slidesPerView={4}
      navigation >
      {props.products.map(product => {
        if(product.id !== props.openedID)
        return(<SwiperSlide key={key++}>
            <a href={props.gotoOffer(product.id)}></a>
            <div className='wrapper'>
                <div className='img-div'>
                    <img src={product.images[0]}></img>
                    <span style={props.promotedProductsArray[product.id] !== true ? {display: "none"} : {}}>PROMOVAT</span>
                </div>
                <div className='text'>
                    <h1>{product.title}</h1>
                    <span>{product.price}€</span>
                    <span>{product.city.City.replaceAll("*", "")}</span>
                    <span>Postat {product.dateAdded.slice(0,10)}</span>
                </div>
            </div>
            </SwiperSlide>)
      })}
    </Swiper>
  );
};
