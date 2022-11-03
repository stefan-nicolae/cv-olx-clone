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
import SearchPage from "../search-page/search-page";

export function randomNumber (min, max) { 
	return Math.floor(Math.random() * (max+1 - min) + min)
} 

export function makeSureItOnlyHasNumbers (val) {
	return !(/^\d+$/.test(val))
}
 
export function replaceDiacritics(string) {
	return string
		.replaceAll("ă", "a")
		.replaceAll("â", "a")
		.replaceAll("î", "i")
		.replaceAll("ș", "s")
		.replaceAll("ț", "t")
}

export function capitalize (string) {
	let newString = ""
	string.split(" ").forEach((word) => {
		if(!word) return
		word = word[0].toUpperCase() + word.slice(1)
		newString += word + " "
	})

	string = newString
	newString = ""
	string.split("-").forEach((word) => {
		if(!word) return

		word = word[0].toUpperCase() + word.slice(1)
		newString += word + "-"
	})
	if(newString.endsWith("-")) newString = newString.slice(0, -1)
	if(newString.endsWith(" ")) newString = newString.slice(0, -1)
	return newString
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
	const storedWarningVisible = window.sessionStorage.getItem("warningVisible") 
	const [warningVisible, setWarningVisible] = useState(storedWarningVisible ? false : true)
	const pathname = window.location.pathname

	window.sessionStorage.setItem("warningVisible", "anything") 
	
	
	console.log(data)
	//update URL_HISTORY
	const URL_HISTORY = window.sessionStorage.getItem("URL_HISTORY")
	// console.log(URL_HISTORY)
	if(!URL_HISTORY) window.sessionStorage.setItem("URL_HISTORY", JSON.stringify([pathname]))
	else {
		const newURL_HISTORY = JSON.parse(URL_HISTORY).concat([pathname])
		window.sessionStorage.setItem("URL_HISTORY", JSON.stringify(newURL_HISTORY))
	}

	//data will be updated through the setData still
	if(data && (!storedData || (storedData && JSON.parse(storedData) !== data))) {
		window.localStorage.setItem("data", JSON.stringify(data))
		const brandsArr = []
		data.products.products.forEach(product => {
			brandsArr.push(product.brand.toLowerCase())
		})
		const allBrands = [...new Set(brandsArr)]
		window.localStorage.setItem("allBrands", JSON.stringify(allBrands))
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
	
	let promotedProductsArray = []
	if(window.localStorage.getItem("promotedProductsArray")) {
		promotedProductsArray = JSON.parse(window.localStorage.getItem("promotedProductsArray"))
	}
	if(data && !promotedProductsArray.length) {
		const len = data.products.products.length 
		for(let i = 0; i < 32; i++) {
			let index = randomNumber(0, len-1)
			while(promotedProductsArray[index] === true) {
				index = randomNumber(0, len-1)
			}
			promotedProductsArray[index] = true
        }
		window.localStorage.setItem("promotedProductsArray", JSON.stringify(promotedProductsArray))
	}
		
	const gotoSearch=(parametersObj) => {
		let paramList = ""
		Object.keys(parametersObj).forEach(key => {
			if(parametersObj[key] === undefined) return
			paramList += key + "=" + `${parametersObj[key]}`.replaceAll(" ", "_") + "&"
		})
		const newPath = "/search?" + paramList
		return newPath.slice(0, newPath.length-1)
	}
		
	const gotoOffer = (id) => {
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


	if(pathname.startsWith("/404")) {
		return(
			<div className="container page404">
				<h1>404 not found</h1>
			</div>
		)
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
		if(foundProduct) {

			return (<div className="container">

				<Header />
				<SearchForm data={data} gotoSearch={gotoSearch} gotoOffer={gotoOffer}/>
				<Offer data={data} product={foundProduct} gotoSearch={gotoSearch} gotoOffer={gotoOffer} promotedProductsArray={promotedProductsArray}/>
				<Footer categories={data.categories} gotoOffer={gotoOffer} gotoSearch={gotoSearch}/>

			</div>)
		} 
		else window.location.pathname = "/404"
	}
	if(storedData && pathname.startsWith("/search")) {
			let URL = window.location.href
			const paramObj = {}
			URL = URL.slice(URL.indexOf("?")+1, URL.length)
			
			URL.split("&").forEach(param => {
				const arr = param.split("=")
				paramObj[arr[0]] = arr[1]
			})

			return(
			<div className="container">
				<Header/>
				<SearchPage promotedProductsArray={promotedProductsArray} paramObj={paramObj} data={data} gotoSearch={gotoSearch} gotoOffer={gotoOffer}/>
			</div>
		)
	}

	if(pathname !== "/") {
		window.location.pathname = "/404"
	} 
	return data ? 
		<div className="container">
			{/* header element */}
			<Header/>
			{/* section search + warning div */}
			<SearchForm filteredSearch={() => {}} data={data} gotoOffer={gotoOffer} gotoSearch={gotoSearch} 
				warningVisible={warningVisible} setWarningVisible={setWarningVisible}/>
			{/* section categorii priniciple */}
			<Categories data={data} categories={data.categories} gotoOffer={gotoOffer} gotoSearch={gotoSearch}/>
			{/* section anunturi promovate */}
			<Announcements promotedProductsArray={promotedProductsArray} gotoOffer={gotoOffer} gotoSearch={gotoSearch} 
				data={data}/>
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