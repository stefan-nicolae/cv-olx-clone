import "./container.css"
import { useEffect, useState, useRef } from "react"
import Data from "./data";
import Header from "../header/header"
import SearchForm from "../main/search";
import Categories from "../main/categories";
import Announcements from "../main/announcements";
import Advert from "../footer/advert";
import Footer from "../footer/footer";

export default function Container (props) {
	const [data, setData] = useState()
	const promotedProducts = useRef([])
    
    const randomNumber = (min, max) => { 
        return Math.floor(Math.random() * (max - min) + min)
    } 
	useEffect(() => {
			const script = document.createElement('script');
			script.src = "https://code.iconify.design/iconify-icon/1.0.0-beta.3/iconify-icon.min.js";
			script.async = true;
			document.body.appendChild(script);
			return () => {
				document.body.removeChild(script);
			}
		}, []);
		
		if(data && !promotedProducts.current.length) {
            const len = data.products.products.length 
            for(let i = 0; i < 16; i++) {
                promotedProducts.current.push(
                    data.products.products[randomNumber(0, len)]
                )
            }
		}

		return data ? 

				<div className="container">
						{/* header element */}
						<Header/>
						{/* section search + warning div */}
						<SearchForm/>
						{/* section categorii priniciple */}
						<Categories categories={data.categories}/>
						{/* section anunturi promovate */}
						<Announcements promotedProducts={promotedProducts.current}/>
						{/* section advert verde */}
						<Advert/>
						{/* footer */}
						<Footer categories={data.categories}/>
				</div> : 

				<div className="container">
					<Data setData={setData}/>
					Loading...
				</div>   

}