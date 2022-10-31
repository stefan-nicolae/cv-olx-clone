import "./main.css"
import {useEffect, useState, useRef } from "react"
import InputLocationDropdownArray from "./input-location-dropdown-array"
import { capitalize } from "../container/container"

export default function SearchForm (props) {
    const [searchSuggestions, setSearchSuggestions] = useState([[], [], []])
    const [countiesVisible, setCountiesVisible] = useState(false)
    const [chosenLocation, setChosenLocation] = useState() //<county>;<city>
    const lastChosenLocation = useRef()

    let defaultLocationValue = "Toata Romania"
    if(props.filters && props.locationDefaultValue) {
        let locationArr = decodeURIComponent(props.locationDefaultValue).split(";")
        if(props.locationDefaultValue !== "") 
        if(locationArr.length === 1) defaultLocationValue = locationArr[0]
        else defaultLocationValue = locationArr[1] +", Judet " + locationArr[0]
        setTimeout(() => {
            document.querySelector(".input-location").classList.add("bold-placeholder")
        }, 100) 
    }

    if(chosenLocation !== lastChosenLocation.current) {
        lastChosenLocation.current = chosenLocation
        setCountiesVisible(false)
        setTimeout(() => {
            if(props.filters === true) props.filteredSearch({locatie: chosenLocation})
        }, 100) 
    }

    if(chosenLocation) {
        if(!chosenLocation.startsWith("Toata Romania")) {
            document.querySelector(".input-location").classList.add("bold-placeholder")
        } else {
            document.querySelector(".input-location").classList.remove("bold-placeholder")
        }
    }

    const handleSearch = event => {
        const value = event.currentTarget.value.toLowerCase()
        if(!value.length) window.sessionStorage.setItem("searchFormInputValue", "")
        if(value.length < 3) {
            setSearchSuggestions([[],[],[]])
            return
        }
        const searchParams = [...new Set(value.split(" "))]
        const suggestions = []
        // category > brand > product/keyword 



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
                    brandSuggestions.push(brand)
                    pushed = true
                }
            })
        })


        let productSuggestions = []
        const paramObj = {}
        const keywordObj = {}
        const alreadyAdded = {}
        const productsSortedByRating = props.data.products.products.sort((a, b) => -(a.rating - b.rating))
        productsSortedByRating.forEach(productObj => {
            let searchString = 
            productObj.title + " " + 
            productObj.category + " " + 
            productObj.description + " " + 
            productObj.county + " " + 
            productObj.city.City
            searchString = searchString.replaceAll("-", " ").replaceAll("_", " ").toLowerCase().replaceAll("'", "")
            searchParams.forEach(param => {
                if(param.length < 3) return
                if(searchString.includes(param)) {
                    //name category id
                    productSuggestions.push([productObj.title, productObj.category, productObj.id])
                    categorySuggestions.push(productObj.category)
                    brandSuggestions.push(productObj.brand)
                    
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

        // console.log(suggestions)
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
    
    useEffect(() => {
        window.addEventListener('click', function(e){  
            if(e.target === document.getElementsByClassName("input-location")[0])  {
                setCountiesVisible(true)
            } else {
                const position = document.getElementsByClassName("input-location-dropdown")[0].getBoundingClientRect()
                if(e.clientX >= position.left && e.clientX <= position.right && e.clientY >= 
                    position.top && e.clientY <= position.bottom) {
        
                } else {
                    setCountiesVisible(false)
                }
            }
        });
    }, [])
    
    useEffect(() => {
        document.querySelector(".input-location").placeholder = props.filters === true ? defaultLocationValue : getLocationPlaceholder()
    })

    const submitForm = (e) => {
        e.preventDefault()
        if(e.nativeEvent.submitter.id !== "search") return
        let searchValue = e.target[2].value
        if(searchValue.length < 3) searchValue = undefined
        let location = chosenLocation ? (chosenLocation.startsWith("Toata Romania") ? 
            undefined : chosenLocation) : undefined
        if(props.filters === true) {
            if(!location && props.locationDefaultValue) location = props.locationDefaultValue
            props.filteredSearch ({
                "cautare": searchValue,
                "locatie": location
            })
        } else {
            window.location.href = props.gotoSearch ({
                "cautare": searchValue,
                "locatie": location
            })
        }
    }


    let key = 0;
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
                <input onKeyUp={handleSearch} className="input-search" type="text" defaultValue={props.filters ? props.inputDefaultValue : ""} 
                    placeholder={`${Object.keys(props.data.products.products).length} anunturi din apropierea ta`}></input>
                <div className="input-search-dropdown">
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
                                    location: (chosenLocation ? (chosenLocation.startsWith("Toata Romania") ? 
                                    "undefined" : chosenLocation) : undefined) }) : 
                                    props.filteredSearch({firma: suggestion, cautare: undefined}, false)} 
                                    
                                    key={key++} className="suggestion"><span>Firma {suggestion}</span></a>)
                            }) 
                        }

                    </div>
                    <div className="product-suggestions">             
                        {
                             props.filters == true ?
                                Object.keys(searchSuggestions[2]).map(suggestion => {
                                    return (
                                        <a className="suggestion" href={props.filteredSearch({cautare: suggestion}, false)} key={key++} >{suggestion}</a>
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
                <input className="input-location" type="text"></input>
                <div className="input-location-dropdown" style={countiesVisible ? {"display": "unset"} : {}}>
                    <InputLocationDropdownArray chosenLocation={chosenLocation} setChosenLocation={setChosenLocation} 
                        data={props.data}/>
                </div>
                <button id="search">Cauta acum <iconify-icon className="search-icon-2" icon="bi:search"></iconify-icon>
                    </button>
               
            </div>
        </form>
    )
}