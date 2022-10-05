// import { replaceAll } from "../container/container"

export default function Categories (props) {
    let key = 0
    return(
        <main className="categories-wrapper">
                <h1>Categorii Principale</h1>
            <div className="categories">
            { 
                Object.keys(props.categories).map(category => {
                    return(<div key={key++} className="category">
                        <div className="category-img"><img src={props.categories[category][0].images[0]}></img></div>
                        <div className="category-name">{category.replaceAll("-", " ")}</div>
                    </div>)
                }) 
            }
    
            </div>
        </main>
    )
}