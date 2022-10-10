import "./offer.css"
import SwiperElement from "./swiper"
import * as container from "../container/container"
import { useState } from "react"
import SwiperBottom from "./swiper-bottom"

export default function Offer (props) {
    const productObject = props.product
    const URL_HISTORY = window.sessionStorage.getItem("URL_HISTORY")
    const user = props.data.users[productObject.userID-1]
    const [phoneState, setPhoneState] = useState(false)

    const stars = [];
    for(let i = 0; i<user.rating; i++) {
        stars.push(true)
    }
    for(let i = 0; i<5-user.rating; i++) {
        stars.push(false)
    }

    let starkey = 0
    return(<div className="offer">
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
            
            <a href="/">Pagina principala       
            </a><span>/</span>

            <a href={props.gotoSearch({category: productObject.category})}>
                {productObject.category}
            </a><span>/</span>

            <a href={props.gotoSearch({category: productObject.category, location: productObject.county})}>
                {productObject.category} - {productObject.county}
            </a><span>/</span>

            <a href={props.gotoSearch({category: productObject.category, location: productObject.county + ";" + productObject.city.City})}>
                {productObject.category} - {productObject.city.City}
            </a><span>/</span>

            <a href={props.gotoSearch({brand: productObject.brand})}>
                {productObject.brand}
            </a><span>/</span>

            <a href={props.gotoSearch({brand: productObject.brand, location: productObject.county})}>
                {productObject.brand} - {productObject.county}
            </a><span>/</span>       

            <a href={props.gotoSearch({brand: productObject.brand, location: productObject.county+ ";" + productObject.city.City})}>
                {productObject.brand} - {productObject.city.City}
            </a>

        </nav>
        
        <div className="main">

 







        <div className="presentation">


            <section className="images">
                <SwiperElement images={productObject.images}/>
            </section>


            <section className="description">

                <span>Postat {productObject.dateAdded.slice(0, 10)}</span>
                <h1>{productObject.title} </h1>
                <span>{productObject.price}€ </span>
                <div>
                    <span><iconify-icon icon="bytesize:bookmark"></iconify-icon>Promoveaza</span><span onClick={() => window.location.reload()}><iconify-icon icon="carbon:reset"></iconify-icon>Reactualizeaza</span>
                </div>

                <h2>DESCRIERE</h2>
                <p>{productObject.description}</p>

                <hr></hr>
                <footer>
                    <span>ID: {productObject.id}</span>
                    <span>Vizualizari: {container.randomNumber(0, 1500)}</span>
                    <span><iconify-icon icon="akar-icons:flag"></iconify-icon>Raporteaza</span>
                </footer>
            </section>


            <section className="messaging">

                <header>
                    <div className="profile">
                        <iconify-icon icon="bi:person-circle"></iconify-icon>
                        <div>
                            <h1>{user.firstName}</h1>
                            <span>Pe OLX din {user.dateJoined.slice(0, 10)}</span>
                        </div>
                    </div>
                    <div>
                        <span><iconify-icon icon="akar-icons:phone"></iconify-icon></span>
                        <h1>{phoneState ? user.phone : "XXX XXX XXX"}</h1>
                        <button style={phoneState ? {display: "none"}: {}}onClick={() => {setPhoneState(true)}} className="green-button"><span>Arata</span></button>
                    </div>
                </header>

                <textarea placeholder="Scrie mesajul tau..."></textarea>
                <footer>
                    <div>
                        <span><iconify-icon icon="fa6-solid:paperclip"></iconify-icon>Adauga atasament</span>
                        <p>Poti incarca fisiere in formatele: jpg, jpeg, png</p>
                    </div>
                    <button className="green-button"><span>Trimite</span></button>
                </footer>
            </section>

            <section style={user.products.length === 1 ? {display: "none"} : {}} className="bottom-div more">
                <h1>Mai multe anunturi de la acest vanzator</h1>
                <SwiperBottom promotedProductsArray={props.promotedProductsArray} products={user.products}/>
            </section>

            <section className="bottom-div similar">
                <h1>Anunturi Similare</h1>
                <SwiperBottom promotedProductsArray={props.promotedProductsArray} products={props.data.categories[productObject.category]}/>
            </section>

        </div>












        <aside>
            <section className="user">


                <div className="profile">
                    <iconify-icon icon="bi:person-circle"></iconify-icon>
                    <div>
                        <h1>{user.firstName}</h1>
                        <span>Pe OLX din {user.dateJoined.slice(0, 10)}</span>
                    </div>
                </div>


                <div className="rating">
                    <div>
                        {
                            stars.map(star => {
                                return star ? <iconify-icon key={starkey++}icon="bi:star-fill"></iconify-icon> : <iconify-icon key={starkey++} icon="bi:star"></iconify-icon>
                            })  
                        }
                        <span>
                        {
                            user.rating + "/5"
                        }
                        </span>
                    </div>
                    <span>[{container.randomNumber(1, 50)} rating-uri]</span>
                    <a href="#">Cum functioneaza rating-urile?</a>
                </div>


                <div className="buttons">
                    <button className="green-button"><span>Suna vanzatorul</span></button>
                    <button className="green-button"><span>Trimite Mesaj</span></button>
                </div>


                <a className="more" href={props.gotoSearch({userId: user.id})}>Mai multe anunturi ale acestui vanzator<iconify-icon icon="akar-icons:chevron-right"></iconify-icon></a>


            </section>

            <section className="location"></section>

            <section className="details"></section>
        </aside>







        </div>
    </div>)
}