import "./offer.css"

export default function Offer (props) {
    const productObject = props.product
    const URL_HISTORY = window.sessionStorage.getItem("URL_HISTORY")
    return(<div className="offer">
        <form>
            <div>
                <iconify-icon className="search-icon-1" icon="bi:search"></iconify-icon>
                <input placeholder="Ce anume cauti?"></input>
            </div>
            <div>
                <iconify-icon className="location-icon" icon="akar-icons:location"></iconify-icon>
                <input placeholder="Toata tara"></input>
            </div>
            <button className="green-button">
                <span>
                Cautare                
                <iconify-icon className="search-icon-1" icon="bi:search"></iconify-icon>
                </span>
            </button>
            
        </form>
        <nav>
            <button onClick={() => {
                if(URL_HISTORY) {
                    const array = JSON.parse(URL_HISTORY)
                    const lastURL = array[array.length - 2]
                    const arrayWithoutLastURL = array.slice(0, array[array.length-2])
                    window.sessionStorage.setItem("URL_HISTORY", JSON.stringify(arrayWithoutLastURL))
                    console.log(lastURL)
                    window.location.pathname = lastURL
                }
            }}><iconify-icon icon="akar-icons:chevron-left"></iconify-icon>Inapoi</button>
            <a href="">Pagina principala</a><span>/</span>
            <a href="">{productObject.category}</a><span>/</span>
            <a href="">{productObject.brand}</a><span>/</span>
            <a href="">{productObject.category} {productObject.location}</a><span>/</span>
            <a href="">{productObject.brand} {productObject.location}</a>
        </nav>
    </div>)
}