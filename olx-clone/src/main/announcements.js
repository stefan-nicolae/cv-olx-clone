export default function Announcements (props) {
    let key = 0
    return(<div className="announcements">
        <h1>Anunturi Promovate</h1>
        <div className="wrapper">
            {props.promotedProducts.map(product => {
                return(<div key={key++} className="announcement">
                    <div className="img-wrapper">                  
                        <img alt="no image available" src={product.images[1]}></img>
                    </div>
                    <span title={product.title} className="title">{product.title}</span>
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