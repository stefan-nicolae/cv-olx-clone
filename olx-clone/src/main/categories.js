import CategoryDropdown from "./category-dropdown"
import { useLayoutEffect, useRef, useState } from "react"

export default function Categories (props) {
    const [selectedCategory, setSelectedCategory] = useState()
    const categoriesWrapper = useRef()
    const selectedCategoryElement = useRef()
    const [dropdownTop, setDropdownTop] = useState(0)

    useLayoutEffect(() => {
        if(!selectedCategory || !categoriesWrapper.current || !selectedCategoryElement.current) return
        const categoryBottom = selectedCategoryElement.current.getBoundingClientRect().bottom
        const categoriesWrapperTop = categoriesWrapper.current.getBoundingClientRect().top
        setDropdownTop(categoryBottom - categoriesWrapperTop)
    }, [selectedCategory])

    const categoryDropdownStyle = selectedCategory ? {
        display: "unset",
        top: dropdownTop,
    } : { display: "none" }
    let key = 0

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
                    return(<a href={props.gotoSearch({categorie: category})}
                        ref={selectedCategory === category ? selectedCategoryElement : undefined}
                        onClick={(event) => openCategory(event, category) } key={key++}
                        className={`category ${selectedCategory === category ? "selected" : ""}`}>
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
