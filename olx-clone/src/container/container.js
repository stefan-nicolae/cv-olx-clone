import "./container.css"
import { useEffect, useState, useRef } from "react"
import Data from "./data";
import Header from "../header/header"
import SearchForm from "../main/search";
import Categories from "../main/categories";
import Announcements from "../main/announcements";
import Advert from "../footer/advert";
import Footer from "../footer/footer";
import Offer from "../offer/offer";

export function randomNumber (min, max) { 
	return Math.floor(Math.random() * (max+1 - min) + min)
} 

// export function replaceAll (string="", oldValue="", newValue="") {
// 	if(oldValue === newValue) return
// 	if(string === undefined || string === null) return ""
// 	let newString = string
// 	while(newString.includes(oldValue)) newString = newString.replace(oldValue, newValue)
// 	console.log(oldValue)
// 	console.log(string)
// 	return newString
// }

function nth_ocurrence(str, needle, nth) {
	for (let i=0;i<str.length;i++) {
	  if (str.charAt(i) == needle) {
		  if (!--nth) {
			 return i;    
		  }
	  }
	}
	return false;
}


export default function Container (props) {
	const URL_HISTORY = useRef([])
	const [data, setData] = useState()
	const promotedProducts = useRef([])
	console.log(data)
    
	const URL = window.location.href
	const URL_TARGET = URL.slice(nth_ocurrence(URL, "/", 3)+1, URL.length)

	URL_HISTORY.current.push(URL)

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
                    data.products.products[randomNumber(0, len-1)]
                )
            }
		}

		if(data && URL_TARGET.startsWith("oferta")) {
			const productName = URL_TARGET.slice(URL_TARGET.indexOf("/")+1, URL_TARGET.length)
			let productObjectFound

			data.products.products.forEach(productObject => {
				// console.log(productObject["title"])
				if(productObject["title"].toLowerCase().replaceAll("/\s/g", '') === productName.toLowerCase().replaceAll("/\s/g", '')) {
					productObjectFound = productObject
					return
				}
			})

			return (
			<div className="container">
				{/* header element */}
				<Header/>
				{/* section search + warning div */}
				<SearchForm/>
				<Offer productObject={productObjectFound} URL_HISTORY={URL_HISTORY}/>
			</div>
			)	
		}	

		return data ? 
				<div className="container">
						{/* header element */}
						<Header/>
						{/* section search + warning div */}
						<SearchForm data={data}/>
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