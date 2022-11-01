import "./search-page.css"
import SearchForm from "../main/search"
import Filters from "./filters"
import Results from "./results"
import Footer from "../footer/footer"

export default function SearchPage (props) {
    const searchParams = props.paramObj
    const storedFormInputValue = window.sessionStorage.getItem("searchFormInputValue")

    //this is for the values/placeholders
    let value_input = props.paramObj.cautare ? props.paramObj.cautare.replaceAll("_", " ") : storedFormInputValue
    let value_location = props.paramObj.locatie ? props.paramObj.locatie.replaceAll("_", " ") : ""
    if(value_location === "") value_location = window.sessionStorage.getItem("location")
    window.sessionStorage.setItem("location", props.paramObj.locatie)

    Object.keys(searchParams).forEach(param => {
        if(searchParams[param] === "placeholder") searchParams[param] = undefined
    })

    console.log(searchParams)

    //Takes parameters, fuses them with what is already in the URL, and goes to the new search page
    const filteredSearch = (newParams, open=true) => {
        // console.log(newParams.search)   
        const brands = []

        if(searchParams.categorie && newParams.firma) {
            props.data.categories[searchParams.categorie].forEach(product => {
                brands.push(product.brand.toLowerCase().replaceAll("_", " "))
            }) 
            console.log(brands)
            if(!brands.includes(newParams.firma.toLowerCase().replaceAll("_", " "))) newParams.categorie = undefined
        }
        // newParams.categorie = undefined
        if(newParams.locatie && newParams.locatie.startsWith("Toata Romania"))  {
            newParams.locatie = ""
            window.sessionStorage.setItem("location", "")
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

    if(value_location === undefined || value_location === "undefined") value_location = ""
    return(<div className="search-page">
        <SearchForm locationDefaultValue={value_location} inputDefaultValue={value_input} data={props.data} 
            filters={true} gotoSearch={() => "#"} filteredSearch={filteredSearch} gotoOffer={props.gotoOffer} defaultDistance={props.paramObj.distanta === undefined ? 0 : props.paramObj.distanta}/>
        <Filters data={props.data} searchParams={searchParams} filteredSearch={filteredSearch}/>
        <Results promotedProductsArray={props.promotedProductsArray} data={props.data} searchParams={searchParams} gotoOffer={props.gotoOffer}/>
        <Footer categories={props.data.categories} gotoSearch={props.gotoSearch} />
    </div>)
}