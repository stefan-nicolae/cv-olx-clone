import "./search-page.css"
import SearchForm from "../main/search"
import Filters from "./filters"
import Results from "./results"
import Footer from "../footer/footer"
import { capitalize, makeSureItOnlyHasNumbers } from "../container/container"
import distCityCity from "../search-page/dist-city-city.json"
import distCountyCity from "../search-page/dist-county-city.json"


export default function SearchPage (props) {
    const searchParams = props.paramObj
    const paramList = ["cautare", "locatie", "distanta", "categorie", "firma", "sorteaza", "minim", "maxim", "pagina"]

    Object.keys(searchParams).forEach(param => {
        let found = false
        paramList.forEach(allowedParam => {
            if(found) return
            if(allowedParam === param) found = true
        })
        if(!found) { delete searchParams[param]; return }
        if(!searchParams[param] || !searchParams[param].length || searchParams[param].startsWith(" ")) { delete searchParams[param]; return}
        searchParams[param] = searchParams[param].toLowerCase()
        if(searchParams[param] === "placeholder") {delete searchParams[param]; return}
    }) 

    if(searchParams.locatie) {
        const location = decodeURIComponent(searchParams.locatie)
        if(location.includes(";")) {
            let county = location.split(";")[0]
            let city = location.split(";")[1]
            county = capitalize(county.replaceAll("_", "-")).replaceAll(" ", "")
            city = capitalize(city.replaceAll("_", "-")).replaceAll(" ", "")
            if(!distCountyCity[county] || !distCityCity[city]) delete searchParams.locatie
        }
        else {
            let county = capitalize(location.replaceAll("_", "-")).replaceAll(" ", "")
            if(!distCountyCity[county]) delete searchParams.locatie
        }
    }

    if(searchParams.distanta) {
        if(makeSureItOnlyHasNumbers(searchParams.distanta)) delete searchParams.distanta
        if(searchParams.distanta < 0) searchParams.distanta = 0
        if(searchParams.distanta > 100) searchParams.distanta = 100
    }

    if(searchParams.categorie) {
        if(!props.data.categories [decodeURIComponent(searchParams.categorie)]) delete searchParams.categorie
    }

    if(searchParams.firma) {
        const brands = JSON.parse(window.localStorage.getItem("allBrands"))
        let found = false
        brands.forEach(storedBrand => {
            if(found) return
            if(storedBrand.replaceAll(" ", "_") === decodeURIComponent(searchParams.firma)) found = true
        })
        if(!found) delete searchParams.firma
    }

    if(searchParams.sorteaza) { 
        const sorteaza = searchParams.sorteaza.toLowerCase()
        if(sorteaza === "ieftine" || sorteaza === "noi" || sorteaza === "scumpe" ) {}
        else delete searchParams.sorteaza
    }

    if(searchParams.minim) {
        if(makeSureItOnlyHasNumbers (searchParams.minim)) delete searchParams.minim
    }

    if(searchParams.maxim) {
        if(makeSureItOnlyHasNumbers (searchParams.maxim)) delete searchParams.maxim
    }

    if(searchParams.pagina) {
        if( makeSureItOnlyHasNumbers(searchParams.pagina) ) delete searchParams.pagina
        if(searchParams.pagina < 0) searchParams.pagina = 0
    }

    if(searchParams.categorie) searchParams.categorie = decodeURIComponent(searchParams.categorie)
    if(searchParams.cautare) searchParams.cautare = decodeURIComponent(searchParams.cautare)
    if(searchParams.firma) searchParams.firma = decodeURIComponent(searchParams.firma)

    const storedFormInputValue = window.sessionStorage.getItem("searchFormInputValue")
    let value_input = searchParams.cautare ? searchParams.cautare.replaceAll("_", " ") : storedFormInputValue
    let value_location = searchParams.locatie ? searchParams.locatie.replaceAll("_", " ") : ""

    const filteredSearch = (newParams, open=true) => {
        const brands = []

        if(newParams.pagina && newParams.pagina === 1) newParams.pagina = undefined
        if(searchParams.categorie && newParams.firma) {
            props.data.categories[searchParams.categorie].forEach(product => {
                brands.push(product.brand.toLowerCase().replaceAll("_", " "))
            }) 
            if(!brands.includes(newParams.firma.toLowerCase().replaceAll("_", " "))) newParams.categorie = undefined
        }
        if(newParams.locatie && newParams.locatie.startsWith("Toata Romania"))  {
            newParams.locatie = ""
        }

        if(searchParams.categorie && newParams.cautare && searchParams.categorie.toLowerCase().replaceAll("-", "").replaceAll("_","").replaceAll(" ", "") ==
        newParams.cautare.toLowerCase().replaceAll("-", "").replaceAll("_","").replaceAll(" ", "")) newParams.cautare = undefined

        if(newParams.distanta === 0) newParams.distanta = undefined

        if(open) { 
            window.location.href = props.gotoSearch({...searchParams, ...newParams})
            return -1
        }
        return props.gotoSearch({...searchParams, ...newParams})
    }
    
    if(!value_location || value_location === undefined) {
        value_location = ""
    } 

    return(<div className="search-page">
        <SearchForm locationDefaultValue={value_location} inputDefaultValue={value_input} data={props.data} 
            filters={true} gotoSearch={() => "#"} filteredSearch={filteredSearch} gotoOffer={props.gotoOffer} defaultDistance={searchParams.distanta === undefined ? 0 : searchParams.distanta}/>
        <Filters data={props.data} searchParams={searchParams} filteredSearch={filteredSearch}/>
        <Results promotedProductsArray={props.promotedProductsArray} data={props.data} searchParams={searchParams} gotoOffer={props.gotoOffer} filteredSearch={filteredSearch}/>
        <Footer categories={props.data.categories} gotoSearch={props.gotoSearch} />
    </div>)
}