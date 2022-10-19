import "./search-page.css"
import SearchForm from "../main/search"

export default function SearchPage (props) {
    const searchParams = props.paramObj

    const filteredSearch = (newParams, isSearchInputValue=false) => {

        // if(isSearchInputValue) {
        //     // window.sessionStorage.setItem("filteredSearchInputValue", Object.values(newParams)[0])
        // } 
        console.log(newParams)
        window.location.href = props.gotoSearch({...searchParams, ...newParams})
    }

    return(<div className="search-page">
        <SearchForm data={props.data} filters={true} gotoSearch={() => "#"} filteredSearch={filteredSearch} gotoOffer={props.gotoOffer}/>
    </div>)
}