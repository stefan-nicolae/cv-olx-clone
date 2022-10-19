import "./search-page.css"
import SearchForm from "../main/search"

export default function SearchPage (props) {
    const searchParams = props.paramObj
    const storedFormInputValue = window.sessionStorage.getItem("searchFormInputValue")

    //this is for the values/placeholders
    let value_input = props.paramObj.search ? props.paramObj.search : storedFormInputValue
    let value_location = props.paramObj.location ? props.paramObj.location.replace("_", " ") : ""
    if(value_location === "") value_location = window.sessionStorage.getItem("location")
    window.sessionStorage.setItem("location", props.paramObj.location)


    console.log(searchParams)

    //Takes parameters, fuses them with what is already in the URL, and goes to the new search page
    const filteredSearch = (newParams, open=true) => {
        // console.log(newParams.search)   

        if(newParams.source) {
            const source = newParams.source
            newParams.source = undefined
            switch(source) {
                //It is a category set by the search-input, thus it needs to be locally remembered as the input's value
                case "search-form-input": 
                    if(newParams.category) {
                        const category = newParams.category 
                        window.sessionStorage.setItem("searchFormInputValue", category[0].toUpperCase() +
                         category.substring(1))
                        newParams.search = undefined
                    }
            }
        }


        if(newParams.location && newParams.location.startsWith("Toata Romania"))  {
            newParams.location = ""
            window.sessionStorage.setItem("location", "")
        }
        if(searchParams.category && newParams.search && searchParams.category.toLowerCase() === newParams.search.toLowerCase()) {
            newParams.search = undefined
        }

        if(open) { 
            window.location.href = props.gotoSearch({...searchParams, ...newParams})
            return -1
        }
        
        return props.gotoSearch({...searchParams, ...newParams})
    }

    if(value_location === undefined || value_location === "undefined") value_location = ""
    console.log(value_location)
    return(<div className="search-page">
        <SearchForm locationDefaultValue={value_location} inputDefaultValue={value_input} data={props.data} 
            filters={true} gotoSearch={() => "#"} filteredSearch={filteredSearch} gotoOffer={props.gotoOffer}/>
    </div>)
}