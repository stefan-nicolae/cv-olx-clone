export default function CategoryDropdown (props) {
    const categoryArray = props.data.categories[props.selectedCategory]
    if(!categoryArray) return (<></>)
    let brands = []
    categoryArray.forEach(category => {
        brands.push(category.brand)
    })
    brands = [...new Set(brands)]
    brands.sort()
    let key = 0
    return (<div style={props.categoryDropdownStyle} className="category-dropdown">
        <div className="title"><iconify-icon icon="akar-icons:chevron-right"></iconify-icon>
            <a href={props.gotoSearch({"category": props.selectedCategory})} >Vezi toate anunturile</a>in {props.selectedCategory}
        </div>
        <div className="brands">
            {brands.map(brand => {
                return (<a href={props.gotoSearch({"category": props.selectedCategory, "brand": brand})} key={key++}><iconify-icon icon="akar-icons:chevron-right"></iconify-icon><span>{brand}</span></a>)
            })}
        </div>
    </div>)
}