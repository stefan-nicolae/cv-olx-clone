import "./main.css"
import {useState} from "react"
import InputLocationDropdownArray from "./input-location-dropdown-array"

export default function SearchForm (props) {
    const [searchSuggestions, setSearchSuggestions] = useState([[], []])


    const handleSearch = event => {

        const value = event.currentTarget.value.toLowerCase()
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
            const productSuggestion = [title, category]
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

    let key = 0;
    return(
        <form className="search-form">
            <div className="banner">
                <h1>Cum să recunoști escrocheriile de tip phishing în OLX și cum să le eviți?</h1>
                <div></div>
                <button>Afla mai multe<div></div></button>
                <button><iconify-icon icon="bi:x-lg"></iconify-icon></button>
            </div>
            <div className="form-wrapper">
                <iconify-icon className="search-icon-1" icon="bi:search"></iconify-icon>
                <input onKeyUp={handleSearch} className="input-search" type="text" placeholder={`${Object.keys(props.data.products.products).length} anunturi din apropierea ta`}></input>
                <div className="input-search-dropdown">
                    <div className="category-suggestions">
                        {
                                searchSuggestions[0].map(suggestion => {
                                    return(<div className="suggestion" key={key++}>{suggestion}</div>) 
                                }) 
                        }
                    </div>
                    <div className="product-suggestions">             
                        {
                            searchSuggestions[1].map(suggestion => {
                                return (<div className="suggestion" key={key++}>{suggestion[0]}<span>in categoria <span>{suggestion[1].replace("-", " ")}</span></span></div>) 
                            })
                        }
                    </div>
                </div>  
                  
                <span></span>
                <iconify-icon className="location-icon" icon="akar-icons:location"></iconify-icon>
                <input className="input-location" type="text" placeholder="Toata Romania"></input>
                <div className="input-location-dropdown">
                    <InputLocationDropdownArray data={props.data}/>
                </div>
                <button>Cauta acum <iconify-icon className="search-icon-2" icon="bi:search"></iconify-icon></button>
               
            </div>
        </form>
    )
}