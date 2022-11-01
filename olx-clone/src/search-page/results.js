import "./results.css"
import { replaceDiacritics } from "../container/container"
import { getDistanceBetweenCities } from "./distance"

// getDistanceBetweenCities("Deva Romania", "Bacau Romania").then(distance => {
//     // console.log(distance)
// })

export default function Results (props) {
    const RESULTS = props.data.products.products //temporary
    
    //now that we have the results, we have to set the priorities
    
    const location = decodeURIComponent(props.searchParams.locatie)
    const county = location.split(';')[0]
    const city = location.split(';')[1]
    
    const locationCompare = string => {
        const result = replaceDiacritics(string).toLowerCase().replaceAll("-", "").replaceAll("_", "").replaceAll("*", "").replaceAll(" ", "")
        return result
    }

    // if just location input, city > county
    // if location and distance input, city > county > within the distance
    // if just dist input, do nothing


    
    RESULTS.forEach(result => {
        result.prio = 0


        //if location input
        if(location.length) {
            //if city, limit to city and county
            if(city && city.length) {
                if(locationCompare(city) === locationCompare(result.city.City)) result.prio += 100000
                else if(locationCompare(county) === locationCompare(result.county)) result.prio += 10000
                else {
                    result.prio = -1
                    return
                }
            }
            // //if county, limit to county
            // else if(county && county.length) {
            // }
        }


        //rating
        result.prio += result.rating * 1000


        //promoted
        if(props.promotedProductsArray[result.id]) result.prio += 100

    })
    
    RESULTS.sort((a, b) => -(a.prio - b.prio))
    console.log(RESULTS)
    
    let key = 0
    return (
        <div className="results">
            <h1>Am gasit {RESULTS.length} rezultate pentru</h1>
            <div className="results-wrapper">
                {
                    RESULTS.map(result => {
                        if(result.prio !== -1) return(
                            <div key={key++} className="result">
                                <a href={props.gotoOffer(result.id)}></a>
                                <div className="image-wrapper">
                                    <img src={result.images[0]}></img>  
                                </div>
                                <section>
                                    <h1>{result.title}</h1>
                                    <div>{result.prio} {result.rating}</div>
                                    <span>{result.city.City.replaceAll("*", "")} - {result.dateAdded.slice(0, 10)}</span>
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