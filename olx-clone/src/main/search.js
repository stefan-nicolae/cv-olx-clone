import "./main.css"
import {useEffect, useState, useRef } from "react"
import InputLocationDropdownArray from "./input-location-dropdown-array"

export default function SearchForm (props) {
    const [searchSuggestions, setSearchSuggestions] = useState([[], []])
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
            if(props.filters === true) props.filteredSearch({location: chosenLocation})
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
            setSearchSuggestions([[],[]])
            return
        }
        const searchParams = [value].length > 1 ? [value].concat(value.split(" ")) : [value]
        const suggestions = []

        //category suggestions
        const categorySuggestions = []
        let index = 0
        Object.keys(props.data.categories).forEach(category => {
            if(index === 5) return
            let pushed = false
            searchParams.forEach(param => {
                if(param === "" || param.length < 3 || pushed) return

                if(category.toLowerCase().startsWith(param)) {
                    categorySuggestions.unshift(category)
                    pushed = true
                }
                else if(category.toLowerCase().includes(param)) { 
                    categorySuggestions.push(category)
                    pushed = true
                }
            })
            if(pushed) index++
        })
        suggestions.push(categorySuggestions)
        //category suggestions end
        
        //product suggestions
        const productSuggestions = []
        const productsSorted = props.data.products.products
        productsSorted.sort((a, b) => -(a.rating - b.rating))
        index = 0
        productsSorted.forEach(product => {
            if(index === 5) return
            const title = product.title
            const description = product.description
            const category = product.category
            const id = product.id
            const productSuggestion = [title, category, id]
            let pushed = false
            
            categorySuggestions.forEach(category => {
                if(pushed) return
                if(product.category.toLowerCase() == category.toLowerCase()) {
                    productSuggestions.unshift(productSuggestion)
                    pushed = true
                }
            })
            if(!pushed) searchParams.forEach(param => {
                if(param === "" || param.length < 3 || pushed) return
                //if it fits the category
                if(title.toLowerCase().startsWith(param)) {
                    productSuggestions.unshift(productSuggestion)
                    pushed = true
                } 
                else if (title.toLowerCase().includes(param)) {
                    productSuggestions.push(productSuggestion)
                    pushed = true
                }
                else if(description.toLowerCase().includes(param)) {
                    productSuggestions.push(productSuggestion)
                    pushed = true
                }
            })
            if(pushed) index++
        })
        suggestions.push(productSuggestions)
        //product suggestions end

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
                "search": searchValue,
                "location": location
            })
        } else {
            window.location.href = props.gotoSearch ({
                "search": searchValue,
                "location": location
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
                                    return(<a href={props.filters !== true ? props.gotoSearch({category: suggestion, 
                                        location: (chosenLocation ? (chosenLocation.startsWith("Toata Romania") ? 
                                        "undefined" : chosenLocation) : undefined) }) : 
                                        props.filteredSearch({category: suggestion, source: "search-form-input"}, false)} 
                                    className="suggestion" key={key++}>{suggestion}</a>) 
                                }) 
                        }
                    </div>
                    <div className="product-suggestions">             
                        {
                                searchSuggestions[1].map(suggestion => {
                                    return (<a href={props.gotoOffer(suggestion[2])} className="suggestion" 
                                        key={key++}>{suggestion[0]}<span>in categoria <span>
                                        {suggestion[1].replace("-", " ")}</span></span></a>) 
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