import "./search-page.css"
import SearchForm from "../main/search"
import Filters from "./filters"
import Results from "./results"

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

        if(newParams.locatie && newParams.locatie.startsWith("Toata Romania"))  {
            newParams.locatie = ""
            window.sessionStorage.setItem("location", "")
        }

        if(searchParams.categorie && newParams.cautare && searchParams.categorie.toLowerCase().replaceAll("-", "").replaceAll("_","").replaceAll(" ", "") ==
        newParams.cautare.toLowerCase().replaceAll("-", "").replaceAll("_","").replaceAll(" ", "")) newParams.cautare = undefined

        if(open) { 
            window.location.href = props.gotoSearch({...searchParams, ...newParams})
            return -1
        }
        return props.gotoSearch({...searchParams, ...newParams})
    }

    if(value_location === undefined || value_location === "undefined") value_location = ""
    return(<div className="search-page">
        <SearchForm locationDefaultValue={value_location} inputDefaultValue={value_input} data={props.data} 
            filters={true} gotoSearch={() => "#"} filteredSearch={filteredSearch} gotoOffer={props.gotoOffer}/>
        <Filters data={props.data} searchParams={searchParams} filteredSearch={filteredSearch}/>
        <Results data={props.data} searchParams={searchParams} gotoOffer={props.gotoOffer}/>
    </div>)
}