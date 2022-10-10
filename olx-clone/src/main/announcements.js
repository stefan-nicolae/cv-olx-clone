import { randomNumber } from "../container/container"

export default function Announcements (props) {
    const promotedProducts = []
    props.promotedProductsArray.forEach(item => {
        promotedProducts.push(item)
    })
    const promotedProductsArray16 = []
    for(let i = 0; i < 16; i++) {
        let index = randomNumber(0, promotedProducts.length-1)
        while(promotedProductsArray16[index] === true) {
            index = randomNumber(0, promotedProducts.length-1)
        }
        promotedProductsArray16[index] = true
    }   

    let key = 0
    return(<div className="announcements">
        <h1>Anunturi Promovate</h1>
        <div className="wrapper">
            {props.data.products.products.map(product => {
                if(promotedProductsArray16[product.id] === true)
                return(<div key={key++} className="announcement">
                    <a href= {props.gotoOffer(product.id)} className="img-wrapper">                  
                        <img alt="no image available" src={product.images[1]}></img>
                    </a>
                    <a href={props.gotoOffer(product.id)} title={product.title} className="title"><span>{product.title.length <= 50 ? product.title : product.title.slice(0, 50) + "..."}</span></a>
                    <div title={product.description} className="description"><span>{product.description}</span></div>
                    <div className="bottom-row">
                        <span className="price">${product.price}</span>
                        <iconify-icon icon="akar-icons:heart"></iconify-icon>
                    </div>
                </div>)
            })}
        </div>
    </div>)
}