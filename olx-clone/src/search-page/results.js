import "./results.css"
import { replaceDiacritics } from "../container/container"
import distCityCity from "./dist-city-city.json"
import distCountyCity from "./dist-county-city.json"

export default function Results (props) {
    let INITIAL_RESULTS = []
    if(props.searchParams.cautare) {
        props.data.products.products.forEach(productObj => {
            let searchString = 
            productObj.title + " " + 
            productObj.category + " " + 
            productObj.description + " " + 
            replaceDiacritics(productObj.county) + " " + 
            replaceDiacritics(productObj.city.City)
            searchString = searchString.replaceAll("-", " ").replaceAll("_", " ").toLowerCase()
            
            const params = props.searchParams.cautare.split("_")
            let pushed = false
            params.forEach(param => {
                if(param.length < 3 || pushed) return
                if(searchString.includes(param)) {
                    INITIAL_RESULTS.push(productObj)
                    pushed = true
                }
            })
        })
    } else {
        INITIAL_RESULTS = props.data.products.products
    }
    
    
    const RESULTS = []
    INITIAL_RESULTS.forEach(product => {
        if(props.searchParams.categorie && props.searchParams.categorie !== product.category) return
        if(props.searchParams.firma && product.brand.toLowerCase().replaceAll(" ", "_") !== decodeURIComponent(props.searchParams.firma)) return
        if(props.searchParams.minim && product.price < props.searchParams.minim) return
        if(props.searchParams.maxim && product.price > props.searchParams.maxim) return
        RESULTS.push(product)
    })
    

    
    //now that we have the results, we have to set the priorities
    
    let location, county, city
    if(props.searchParams.locatie) {
        location = decodeURIComponent(props.searchParams.locatie)
        county = location.split(';')[0]
        city = location.split(';')[1]
    }
    const distance = props.searchParams.distanta
    
    const locationCompare = string => {
        const result = replaceDiacritics(string).toLowerCase().replaceAll("-", "").replaceAll("_", "").replaceAll("*", "").replaceAll(" ", "")
        return result
    }

    const locationCompareDist = string => {
        const result = string.replaceAll(" ", "-").replaceAll("*", "").replaceAll("_", "-")
        return result
    }

    // if just location input, city > county
    // if location and distance input, city > county > within the distance
    // if just dist input, do nothing
    let noCity = true, noCounty = true, noDist = true
    let PRIO_RESULTS = []

    RESULTS.forEach(result => {
        result.prio = 0

        //if distance input and also location
        if(distance) {
            if(location) { 
                if(locationCompareDist(county) !== locationCompareDist(result.city.City)) {
                    if(city) {
                        if(locationCompareDist(county) === locationCompareDist(result.county)) {}
                        else if(distCityCity[locationCompareDist(city)][locationCompareDist(result.city.City)]* 1.609344 > distance) return
                        else {
                            result.pass = true
                            result.prio += 10000
                            noDist = false
                        }
                    }
                    else if(county) {
                        if(locationCompareDist(county) === locationCompareDist(result.county)) {}
                        else if(distCountyCity[locationCompareDist(county)][locationCompareDist(result.city.City)]* 1.609344 > distance) return
                        else {
                            result.pass = true
                            result.prio += 10000
                            noDist = false
                        }
                    }
                }
            }
        }   

        //if location input
        if(location) {
            //if city, limit to city and county
            if(city) {
                if(locationCompare(city) === locationCompare(result.city.City)) {
                    result.prio += 1000000
                    noCity = false
                    noCounty = false
                } 
                else if(locationCompare(county) === locationCompare(result.county)) {
                    result.prio += 100000
                    noCounty = false
                } 
                else if(!result.pass) return    
            }
            
            // //if county, limit to county
            else if(county) {
                if(locationCompare(county) === locationCompare(result.county)) 
                {
                    noCounty = false
                    noCounty = false
                    result.prio += 100000
                }
                else if(!result.pass) return
            }
        }

        //rating
        result.prio += result.rating * 1000


        //promoted
        if(props.promotedProductsArray[result.id]) result.prio += 100

        PRIO_RESULTS.push(result)
    })
    
    if(props.searchParams.sorteaza) {
        switch(props.searchParams.sorteaza.toLowerCase()) {
            case "noi": 
                PRIO_RESULTS.sort((a, b) => -(new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()))
                break
            case "ieftine":
                PRIO_RESULTS.sort((a, b) => (a.price - b.price) )
                break
            case "scumpe":
                PRIO_RESULTS.sort((a, b) => -(a.price - b.price) )
                break
            default:
                PRIO_RESULTS.sort((a, b) => -(a.prio - b.prio))
        }
    }
    else PRIO_RESULTS.sort((a, b) => -(a.prio - b.prio))
    
        
    const pageNumber = Math.ceil(PRIO_RESULTS.length/20)
    const pages = []
    for(let i = 1; i <= pageNumber; i++) {
        pages.push(i)
    }

    let RENDERED_RESULTS = []
    if(props.searchParams.pagina) {
        if(props.searchParams.pagina > pageNumber) props.searchParams.pagina = pageNumber
        RENDERED_RESULTS = PRIO_RESULTS.slice(
            20 + (20 * (props.searchParams.pagina-2)),
            40 + (20 * (props.searchParams.pagina-2)) 
        )
    } else {
        RENDERED_RESULTS = PRIO_RESULTS.slice(0, 20)
    }


    let searchWarning 

    if(location && noCity) searchWarning = "Nu am gasit rezultate in orasul ales. Iata anunturile din judet" + (distance ? " si din perimetrul ales." : ":")
    if(location && noCounty && !distance) searchWarning = "Nu am gasit rezultate in judetul ales."
    if(distance) {
        if(location) {
            if(noCounty && noDist) searchWarning = "Nu am gasit rezultate in perimetrul ales:"
        } else {
            searchWarning = "Setarea de distanta nu functioneaza fara a alege o locatie."
        }
    }

    
    let key = 0
    let key2 = 0

    return (
        <div className="results">

            <h1>Am gasit {PRIO_RESULTS.length} rezultate:</h1>
            <div style={searchWarning ? {} : {display: "none"}}className="search-warning">{searchWarning}</div>
            <div className="results-wrapper">
                {
                    RENDERED_RESULTS.map(result => {
                        return(
                            <div key={key++} className="result">
                                <a href={props.gotoOffer(result.id)}></a>
                                <div className="image-wrapper">
                                    <img src={result.images[0]}></img>  
                                </div>
                                <section>
                                    <h1>{result.title}</h1>
                                    {/* <div>{result.prio} {result.rating}</div> */}
                                    <div></div>
                                    <span>{result.city.City.replaceAll("*", "")} - {result.county} - {result.dateAdded.slice(0, 10)}</span>
                                </section>
                                <aside>
                                    <h1>${result.price}</h1>
                                    <iconify-icon icon="akar-icons:heart"></iconify-icon>
                                </aside>
                                <span style={props.promotedProductsArray[result.id] ? {} : {display: "none"}} >PROMOVAT</span>
                            </div>
                        )
                    })
                }
            </div>
            
            <div style={{width: pageNumber * 50 + "px", display: (!parseInt(pageNumber) ? "none" : "")}} className="pages">
                <span onClick={() => {props.searchParams.pagina ? props.filteredSearch({pagina: props.searchParams.pagina-1}) : {}}}><iconify-icon icon="akar-icons:chevron-left"></iconify-icon></span>
                {
                    pages.map(pageNumber => {
                        return(
                            <a href={props.filteredSearch({pagina: pageNumber == 1 ? undefined : pageNumber}, false)} className={"page-option "
                                + ((!props.searchParams.pagina && 1 == pageNumber) ? " selected" : (props.searchParams.pagina == pageNumber ? " selected" : ""))
                            } key={key2++}>{pageNumber}</a>
                        )
                    })
                }
                <span onClick={() => {props.filteredSearch({pagina: props.searchParams.pagina ? parseFloat(props.searchParams.pagina)+1 : 2})}}><iconify-icon icon="akar-icons:chevron-right"></iconify-icon></span>
            </div>
        </div>
    )
}