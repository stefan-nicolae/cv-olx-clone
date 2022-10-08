import "./container.css"
import { useEffect, useState, useRef } from "react"
import Data from "./data";
import Header from "../header/header"
import SearchForm from "../main/search";
import Categories from "../main/categories";
import Announcements from "../main/announcements";
import Advert from "../footer/advert";
import Footer from "../footer/footer";
import Offer from "../offer/offer"

export function randomNumber (min, max) { 
	return Math.floor(Math.random() * (max+1 - min) + min)
} 

function getNewTitle(title) {
	return title.replaceAll(" ", "-")
	.replaceAll("/", "")
	.replaceAll("_", "-")
	.toLowerCase()
}

export default function Container () {
	let storedData = window.localStorage.getItem("data")
	const [data, setData] = useState(storedData ? JSON.parse(storedData) : undefined) 
	const [warningVisible, setWarningVisible] = useState(true)
	const promotedProducts = useRef([])
	const pathname = window.location.pathname

	//update URL_HISTORY
	const URL_HISTORY = window.sessionStorage.getItem("URL_HISTORY")
	console.log(URL_HISTORY)
	if(!URL_HISTORY) window.sessionStorage.setItem("URL_HISTORY", JSON.stringify([pathname]))
	else {
		const newURL_HISTORY = JSON.parse(URL_HISTORY).concat([pathname])
		window.sessionStorage.setItem("URL_HISTORY", JSON.stringify(newURL_HISTORY))
	}

	//data will be updated through the setData still
	if(data && (!storedData || (storedData && JSON.parse(storedData) !== data))) {
		window.localStorage.setItem("data", JSON.stringify(data))
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
				data.products.products[randomNumber(0, len-1)]
                )
            }
	}
		
	const gotoSearch=(parametersObj) => {
		console.log(parametersObj)
		return "#"
	}
		
	const gotoOffer = (id) => {
		console.log("go to " + id)
		let url = "/404"
		data.products.products.forEach((product => 
			{
				if(product.id === id) {
					const newTitle = getNewTitle(product.title)
					url = "/oferta/" + newTitle + "_ID=" + product.id
					return
				}
			}
		))
		return url
	}

	//should run just once, as storedData doesn't update instantly 
	if(!storedData && data) {
		storedData = JSON.stringify(data)
	}
	if(storedData && pathname.startsWith("/oferta")) {
		const targetID = pathname.slice(pathname.lastIndexOf("ID")+3)
		const targetTitle = pathname.slice(pathname.lastIndexOf("/")+1, pathname.lastIndexOf("_"))
		let foundProduct
		data.products.products.forEach(product => {
			if(product.id == targetID) {
				foundProduct = product
				return
			}
		})
		if(foundProduct && getNewTitle(foundProduct.title) !== targetTitle) foundProduct = undefined
		console.log(foundProduct)
		if(foundProduct) return (<div className="container">
			<Header />
			<Offer data={data} product={foundProduct}/>
		</div>)
		else window.location.pathname = "/404"
	}
	return data ? 
		<div className="container">
			{/* header element */}
			<Header/>
			{/* section search + warning div */}
			<SearchForm data={data} gotoOffer={gotoOffer} gotoSearch={gotoSearch} warningVisible={warningVisible} setWarningVisible={setWarningVisible}/>
			{/* section categorii priniciple */}
			<Categories data={data} categories={data.categories} gotoOffer={gotoOffer} gotoSearch={gotoSearch}/>
			{/* section anunturi promovate */}
			<Announcements promotedProducts={promotedProducts.current} gotoOffer={gotoOffer} gotoSearch={gotoSearch}/>
			{/* section advert verde */}
			<Advert/>
			{/* footer */}
			<Footer categories={data.categories} gotoOffer={gotoOffer} gotoSearch={gotoSearch}/>
		</div> 
		: 
		<div className="container">
			<Data setData={setData}/>
			Loading...
		</div>   
}