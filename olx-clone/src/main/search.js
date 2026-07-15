import "./main.css"
import {useEffect, useState, useRef } from "react"
import InputLocationDropdownArray from "./input-location-dropdown-array"
import { capitalize, replaceDiacritics } from "../container/container"

export default function SearchForm (props) {
    const [searchSuggestions, setSearchSuggestions] = useState([[], [], []])
    const [countiesVisible, setCountiesVisible] = useState(false)
    const [chosenLocation, setChosenLocation] = useState()
    const [locSearchResults, setLocSearchResults] = useState([[],[],{}])
    const [searchValue, setSearchValue] = useState(props.filters ? props.inputDefaultValue || "" : "")
    const [locationValue, setLocationValue] = useState("")
    const searchInputRef = useRef()
    const locationInputRef = useRef()
    const searchDropdownRef = useRef()
    const locationDropdownRef = useRef()
    let key = 0
    let key2 = 0
    let key3 = 0
    const distOptions = [0, 2, 5, 10, 15, 30, 50, 75, 100]

    let defaultLocationValue = "Toata Romania"
    if(props.filters && props.locationDefaultValue) {
        let locationArr = decodeURIComponent(props.locationDefaultValue).split(";")
        if(props.locationDefaultValue !== "") 
        if(locationArr.length === 1) defaultLocationValue = locationArr[0]
        else defaultLocationValue = locationArr[1] +", Judet " + locationArr[0]
    }

    useEffect(() => {
        if(chosenLocation === undefined) return
        setCountiesVisible(false)
        if(props.filters !== true) return

        const timer = setTimeout(() => {
            props.filteredSearch({locatie: chosenLocation})
        }, 100)
        return () => clearTimeout(timer)
    }, [chosenLocation])

    const handleSearch = value => {
        const normalizedValue = value.toLowerCase()
        if(!normalizedValue.length) window.sessionStorage.setItem("searchFormInputValue", "")
        if(normalizedValue.length < 3) {
            setSearchSuggestions([[],[],[]])
            return
        }
        const searchParams = [...new Set(normalizedValue.split(" "))]
        const suggestions = []
        const categorySuggestions = []
        Object.keys(props.data.categories).forEach(category => {
            let pushed = false
            searchParams.forEach((param) => {
                if(param.length < 3 || pushed) return
                else if (category.includes(param)) {
                    categorySuggestions.push(category)
                    pushed = true
                }
            })
        })

        const brandSuggestions = []
        JSON.parse(window.localStorage.getItem("allBrands")).forEach(brand => {
            let pushed = false
            searchParams.forEach((param) => {
                if(param.length < 3 || pushed) return
                else if (brand.includes(param)) {
                    brandSuggestions.push(brand.toLowerCase())
                    pushed = true
                }
            })
        })

        let productSuggestions = []
        const paramObj = {}
        const keywordObj = {}
        const alreadyAdded = {}
        const productsSortedByRating = [...props.data.products.products].sort((a, b) => -(a.rating - b.rating))
        productsSortedByRating.forEach(productObj => {
            let searchString = 
            productObj.title + " " + 
            productObj.category + " " + 
            productObj.description + " " + 
            productObj.brand + " " + 
            replaceDiacritics(productObj.county) + " " + 
            replaceDiacritics(productObj.city.City.replaceAll("*", ""))
            searchString = searchString.replaceAll("-", " ").replaceAll("_", " ").toLowerCase()
            searchParams.forEach(param => {
                if(param.length < 3) return
                if(searchString.includes(param)) {
                    productSuggestions.push([productObj.title, productObj.category, productObj.id])
                    categorySuggestions.push(productObj.category)
                    brandSuggestions.push(productObj.brand.toLowerCase())
                    
                    if(keywordObj[productObj.title] === undefined) keywordObj[productObj.title] = 0
                    keywordObj[productObj.title]++

                    if(paramObj[param] === undefined) paramObj[param] = 0
                    paramObj[param]++
                }
            })
        })
        productSuggestions = productSuggestions.sort(  (a,b) => -(keywordObj[a[0]] - keywordObj[b[0]])  )
        productSuggestions = productSuggestions.filter(suggestion => {
            if(alreadyAdded[suggestion[2]] === true) return false
            else {
                alreadyAdded[suggestion[2]] = true
                return true
            }
        })
        
        suggestions.push([...new Set(categorySuggestions)].splice(0, 5))
        suggestions.push([...new Set(brandSuggestions)].splice(0, 5))
        suggestions.push(
            props.filters == true ? paramObj : productSuggestions.splice(0, 10) 
        )

        setSearchSuggestions(suggestions)
    }   

    const getLocationPlaceholder = () => {
        if(chosenLocation) {
            if(chosenLocation.startsWith("Toata Romania")) return "Toata Romania"
            if(chosenLocation.includes(";"))
            {
                const arr = chosenLocation.split(";")
                return(arr[1] + ", Judet " + arr[0])
            } else {
                return chosenLocation
            }
        } else {
            if(countiesVisible) return ""
            else return "Toata Romania"
        }
    }
    
    const handleLocationInput = value => {
        if(value.length) setCountiesVisible(false) 
        else setCountiesVisible(true) 
    

        const params = [...new Set(value.split(" "))]
        const countySuggestions = []
        const citySuggestions = []
        const dictionary = {}
        const counties = props.data.counties
        Object.keys(counties).forEach(county => {
            let pushed = false
            params.forEach(param => {
                if(pushed || param.length < 3 || param.startsWith(" ")) return
                if(replaceDiacritics(county).toLowerCase().includes(param.toLowerCase())) {
                    countySuggestions.push(county)
                    pushed = true
                    counties[county].forEach(cityObj => {
                        citySuggestions.push(cityObj.City)
                        dictionary[cityObj.City] = cityObj.County

                    }) 
                }
            })
        })
        props.data.cities.forEach(city => {
            let pushed = false
            params.forEach(param => {
                if(pushed || param.length < 3 || param.startsWith(" ")) return
                if(replaceDiacritics(city.City).toLowerCase().includes(param.toLowerCase())) {
                    countySuggestions.push(city.County)
                    citySuggestions.push(city.City)
                    dictionary[city.City] = city.County
                    pushed = true
                }
            })
        })
        const resultArray = []
        resultArray.push([...new Set(countySuggestions)].splice(0, 5))
        resultArray.push([...new Set(citySuggestions)].splice(0, 10))
        resultArray.push(dictionary)

        setLocSearchResults(resultArray)
    }
 
    useEffect(() => {
        const closeDropdowns = event => {
            if(!searchInputRef.current?.contains(event.target) && !searchDropdownRef.current?.contains(event.target)) {
                setSearchSuggestions([[],[],[]])
            }
            if(!locationInputRef.current?.contains(event.target) && !locationDropdownRef.current?.contains(event.target)) {
                setLocSearchResults([[],[],{}])
                setCountiesVisible(false)
            }
        }

        window.addEventListener('click', closeDropdowns)
        return () => window.removeEventListener('click', closeDropdowns)
    }, [])

    const submitForm = (e) => {
        e.preventDefault()
        if(e.nativeEvent.submitter.id !== "search") return
        let submittedSearchValue = searchValue
        if(submittedSearchValue.length < 3) submittedSearchValue = undefined
        let location = chosenLocation ? (chosenLocation.startsWith("Toata Romania") ? 
            undefined : chosenLocation) : undefined
        if(props.filters === true) {
            if(!location && props.locationDefaultValue) location = props.locationDefaultValue
            props.filteredSearch ({
                "cautare": submittedSearchValue,
                "locatie": location
            })
        } else {
            window.location.href = props.gotoSearch ({
                "cautare": submittedSearchValue,
                "locatie": location
            })
        }
    }

    return(
        <form className="search-form" onSubmit={submitForm}>
            <div style={!props.warningVisible ? {"display" :"none"} : {}} className="banner">
                <h1>Cum să recunoști escrocheriile de tip phishing în OLX și cum să le eviți?</h1>
                <div></div>
                <button>Afla mai multe<div></div></button>
                <button onClick={() => {props.setWarningVisible(false)}}><iconify-icon icon="bi:x-lg"></iconify-icon>
                    </button>
            </div>
            <div className="form-wrapper">
                <iconify-icon className="search-icon-1" icon="bi:search"></iconify-icon>

                <iconify-icon onClick={() => {
                    setSearchValue("")
                    setSearchSuggestions([[],[],[]])
                }} style={{
                    position: "absolute",
                    left: props.filters !== true ? "675px" : "660px",
                    cursor: "pointer",
                    display: searchValue.length ? "" : "none"
                }} icon="bytesize:close"></iconify-icon>

                <input ref={searchInputRef} onChange={event => {
                    setSearchValue(event.target.value)
                    handleSearch(event.target.value)
                }} className="input-search" type="text" value={searchValue}
                    placeholder={`${Object.keys(props.data.products.products).length} anunturi din apropierea ta`}></input>
                <div ref={searchDropdownRef} className="input-search-dropdown">
                    <div className="category-suggestions">
                        {
                            searchSuggestions[0].map(suggestion => {
                                return(<a 
                                    onClick={() => {
                                        window.sessionStorage.setItem("searchFormInputValue", capitalize(suggestion.replaceAll("-", " ")))
                                    }} 

                                    href={props.filters !== true ? props.gotoSearch({categorie: suggestion, 
                                    location: (chosenLocation ? (chosenLocation.startsWith("Toata Romania") ? 
                                    "undefined" : chosenLocation) : undefined) }) : 
                                    props.filteredSearch({categorie: suggestion, cautare: undefined}, false)} 

                                className="suggestion" key={key++} >Categoria {suggestion.replaceAll("-"," ")}
                                </a>) 
                            })
                        } 

                    </div> 
                    <div className="brand-suggestions">
                        {
                            searchSuggestions[1].map(suggestion => {
                                return(<a 
                                    onClick={() => {
                                        window.sessionStorage.setItem("searchFormInputValue", capitalize(suggestion.replaceAll("-", " ")))
                                    }} 

                                    href={props.filters !== true ? props.gotoSearch({firma: suggestion, 
                                    locatie: (chosenLocation ? (chosenLocation.startsWith("Toata Romania") ? 
                                    undefined : chosenLocation) : undefined) }) : 
                                    props.filteredSearch({firma: suggestion, cautare: undefined}, false)} 
                                    
                                    key={key++} className="suggestion"><span>Firma {suggestion}</span></a>)
                            }) 
                        }

                    </div>
                    <div className="product-suggestions">             
                        {
                             props.filters === true ?
                                Object.keys(searchSuggestions[2]).map(suggestion => {
                                    return (
                                        <a  className="suggestion" href={props.filteredSearch({cautare: suggestion}, false)} key={key++} >{suggestion}</a>
                                    )
                                })
                             
                             : searchSuggestions[2].map(suggestion => {
                                return(<a href={props.gotoOffer(suggestion[2])} key={key++} className="suggestion">{suggestion[0]}<span>in categoria <span>
                                    { capitalize(suggestion[1].replaceAll("-", " "))}</span></span></a>)
                            }) 
                        }
                    </div>
                </div>  
                   
                <span></span>
                <iconify-icon className="location-icon" icon="akar-icons:location"></iconify-icon>

                <iconify-icon onClick={() => {
                    setLocationValue("")
                    setLocSearchResults([[],[],{}])
                }} style={{
                    position: "absolute",
                    right: props.filters === true? "245px": "170px",
                    cursor: "pointer",
                    display: locationValue.length ? "" : "none",
                }}  className="location-close" icon="bytesize:close"></iconify-icon>

                <input ref={locationInputRef} onFocus={() => {
                    if(!locationValue.length) setCountiesVisible(true)
                }} onChange={event => {
                    setLocationValue(event.target.value)
                    handleLocationInput(event.target.value)
                }} className={`input-location ${(chosenLocation && !chosenLocation.startsWith("Toata Romania")) || (props.filters && props.locationDefaultValue) ? "bold-placeholder" : ""}`} type="text" value={locationValue}
                    placeholder={capitalize(props.filters === true ? defaultLocationValue : getLocationPlaceholder())}></input>
                <div style={locSearchResults[0].length ? {} : {display: "none"}} className="input-location-dropdown-tiny">
                    {
                        locSearchResults[0].map(county => {
                            return(<a href={
                                props.filters === true ? props.filteredSearch({locatie: county}, false) : props.gotoSearch({locatie: county})
                            } key={key2++} className="county-suggestion suggestion">{county}</a>)
                        })
                    }
                    {
                        locSearchResults[1].map(city=> {
                            return(<a href={
                                props.filters === true ? props.filteredSearch({locatie: (locSearchResults[2][city] + ";" + city.replaceAll("*", ""))}, false) : props.gotoSearch({locatie: (locSearchResults[2][city] + ";" + city.replaceAll("*", ""))})
                            } key={key2++} 
                            className="city-suggestion suggestion">{city.replaceAll("*", "")}</a>)
                        })
                    }
                </div>
                <div ref={locationDropdownRef} className="input-location-dropdown" style={countiesVisible ? {"display": "unset"} : {}}>
                    <InputLocationDropdownArray chosenLocation={chosenLocation} setChosenLocation={setChosenLocation} 
                        data={props.data}/>
                </div>
                
                <div className="input-distance" style={props.filters === true ? {} : {display: "none"}}>
                    <select defaultValue={props.defaultDistance} id="distance">
                        {
                            distOptions.map((dist) => {
                                return(<option key={key3++} onClick={() => {
                                    props.filteredSearch({distanta: dist}) 
                                }} value={dist}>{`+${dist} km`}</option>)
                            })
                        }
                    </select>
                </div>
                <button id="search">Cauta acum <iconify-icon className="search-icon-2" icon="bi:search"></iconify-icon>
                </button>
            </div>
        </form>
    )
}
