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
            searchString = searchString.replaceAll("-", " ").replaceAll("_", " ").toLowerCase().replaceAll("'", "")
            
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
    
    let location = decodeURIComponent(props.searchParams.locatie)
    let county = location.split(';')[0]
    let city = location.split(';')[1]
    const distance = props.searchParams.distanta
    if(!location.length) location = undefined
    if(city && !city.length) city = undefined
    if(county && !county.length) county = undefined
    
    const locationCompare = string => {
        const result = replaceDiacritics(string).toLowerCase().replaceAll("-", "").replaceAll("_", "").replaceAll("*", "").replaceAll(" ", "")
        return result
    }

    const locationCompareDist = string => {
        const result = string.replaceAll(" ", "-").replaceAll("*", "")
        return result
    }

    // if just location input, city > county
    // if location and distance input, city > county > within the distance
    // if just dist input, do nothing
    let noCity = true, noCounty = true
    const PRIO_RESULTS = []

    RESULTS.forEach(result => {
        result.prio = 0

        //if distance input and also location
        if(distance) {
            if(location && location !== "undefined") { 
                if(locationCompareDist(county) !== locationCompareDist(result.city.City)) {
                    if(city && city !== "undefined") {
                        if(locationCompareDist(county) === locationCompareDist(result.county)) {}
                        else if(distCityCity[locationCompareDist(city)][locationCompareDist(result.city.City)] > distance) return
                        else {
                            result.pass = true
                            result.prio += 10000
                        }
                    }
                    else if(county && county !== "undefined") {
                        if(locationCompareDist(county) === locationCompareDist(result.county)) {}
                        else if(distCountyCity[locationCompareDist(county)][locationCompareDist(result.city.City)] > distance) return
                        else {
                            result.pass = true
                            result.prio += 10000
                        }
                    }
                }
            }
        }   

        //if location input
        if(location && location !== "undefined") {
            //if city, limit to city and county
            if(city && city !== "undefined") {
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
            else if(county && county !== "undefined") {
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
    
    console.log(props.searchParams.sorteaza)
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
    
    let key = 0
    return (
        <div className="results">
            <h1>Am gasit {PRIO_RESULTS.length} rezultate:</h1>
            <div className="results-wrapper">
                {
                    PRIO_RESULTS.map(result => {
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
        </div>
    )
}