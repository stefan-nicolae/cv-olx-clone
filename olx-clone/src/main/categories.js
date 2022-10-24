import CategoryDropdown from "./category-dropdown"
import { useState, useRef } from "react"

export default function Categories (props) {
    const [selectedCategory, setSelectedCategory] = useState()
    const lastSelectedCategoryElement = useRef()
    const categoriesWrapper = useRef()
    let categoryDropdownStyle = {
        "display": "none"
    }
    if(selectedCategory) {
        if(lastSelectedCategoryElement.current) {
            lastSelectedCategoryElement.current.style.marginBottom = "unset"
            lastSelectedCategoryElement.current.style.textDecoration = "unset"
        }
        let categoryBottom = 0, categoriesWrapperTop= 0
        document.querySelectorAll(".category").forEach(category => {
            if(category.dataset.category === selectedCategory) {
                categoryBottom = category.getBoundingClientRect().bottom
                categoriesWrapperTop= categoriesWrapper.current.getBoundingClientRect().top
                category.style.marginBottom = "200px"
                category.style.textDecoration = "underline"
                lastSelectedCategoryElement.current = category
                return
            }
        })
        categoryDropdownStyle = {
            "display": "unset",
            "top": categoryBottom - categoriesWrapperTop,
        }
    } else {
        if(lastSelectedCategoryElement.current) {
            lastSelectedCategoryElement.current.style.marginBottom = "unset"
            lastSelectedCategoryElement.current.style.textDecoration = "unset"
        }
    }
    let key = 0


    //set margin bottom to selected category
    //set coordinates of the dropdown 

    const openCategory = (event, category) => {
        event.preventDefault()
        category === selectedCategory ? setSelectedCategory(undefined) : setSelectedCategory(category)
    }

    return(
        <main className="categories-wrapper" ref={categoriesWrapper}>
            <h1>Categorii Principale</h1>
            <div className="categories">
            { 
                Object.keys(props.categories).map(category => {
                    return(<a href={props.gotoSearch({categorie: category})} data-category={category} 
                        onClick={(event) => openCategory(event, category) } key={key++} className="category">
                        <div className="category-img"><img src={props.categories[category][0].images[0]}></img></div>
                        <div className="category-name">{category.replaceAll("-", " ")}</div>
                    </a>)
                }) 
            }
            <CategoryDropdown categoryDropdownStyle={categoryDropdownStyle} selectedCategory={selectedCategory} 
                data={props.data} gotoSearch={props.gotoSearch}/>
    
            </div>
        </main>
    )
}