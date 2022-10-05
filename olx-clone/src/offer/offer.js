import "./offer.css"

export default function Offer (props) {
        console.log(props.productObject)
    return(<div className="offer">
        <nav>
            <button onClick={() => {
                //TEST 
                const target = props.URL_HISTORY.current[props.URL_HISTORY.current.length - 1]
                props.URL_HISTORY.current.pop()
                window.location = target
            }}><iconify-icon icon="akar-icons:chevron-left"></iconify-icon>Inapoi</button>
            
            <a href="">Pagina principala</a>/
            <a href="">{props.productObject.category}</a>/
            <a href="">{props.productObject.brand}</a>/
            <a href="">{props.productObject.category} {props.productObject.location}</a>/
            <a href="">{props.productObject.brand} {props.productObject.location}</a>
        </nav>
    </div>)
}