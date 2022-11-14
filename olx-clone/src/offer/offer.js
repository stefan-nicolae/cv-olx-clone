import "./offer.css"
import "./map.css"
import SwiperElement from "./swiper"
import * as container from "../container/container"
import { useEffect, useState } from "react"
import SwiperBottom from "./swiper-bottom"

export default function Offer (props) {
    const MapsKey = "AIzaSyAIfwB5a40jpDuAnWFffeuE7GWa9F_KS30"
    const productObject = props.product
    const URL_HISTORY = window.sessionStorage.getItem("URL_HISTORY")
    const user = props.data.users[productObject.userID-1]
    const [phoneState, setPhoneState] = useState(false)
    const [mapVisible, setMapVisible] = useState(false)



    const stars = [];
    for(let i = 0; i<user.rating; i++) {
        stars.push(true)
    }
    for(let i = 0; i<5-user.rating; i++) {
        stars.push(false)
    }

    let starkey = 0

    useEffect(() => {
        if(mapVisible) {
            document.querySelector(".container").scrollTo(0, 0)
            document.querySelector(".container").style.overflowY = "hidden"
        } else {
            document.querySelector(".container").style.overflowY = "unset"
        }
    })

     

    return(<div className="offer">
        <nav>
            <button onClick={() => {
                if(URL_HISTORY) {
                    const array = JSON.parse(URL_HISTORY)
                    const lastURL = array[array.length - 2]
                    const arrayWithoutLastURL = array.slice(0, array.length-1)
                    window.sessionStorage.setItem("URL_HISTORY", JSON.stringify(arrayWithoutLastURL))
                    window.location.pathname = lastURL
                    if(lastURL === undefined) window.location.pathname = "/"
                } 
            }}><iconify-icon icon="akar-icons:chevron-left"></iconify-icon>Inapoi</button>
            
            <a href="/">Pagina principala       
            </a><span>/</span>

            <a href={props.gotoSearch({categorie: productObject.category})}>
                {productObject.category.replaceAll("-", " ")}
            </a><span>/</span>

            <a href={props.gotoSearch({categorie: productObject.category, locatie: productObject.county})}>
                {productObject.category.replaceAll("-", " ")} - {productObject.county}
            </a><span>/</span>

            <a href={props.gotoSearch({categorie: productObject.category, locatie: productObject.county + ";" + 
                productObject.city.City})}>
                {productObject.category.replaceAll("-", " ")} - {productObject.city.City.replaceAll("*", "")}
            </a><span>/</span>

            <a href={props.gotoSearch({firma: productObject.brand})}>
                {productObject.brand}
            </a><span>/</span>

            <a href={props.gotoSearch({firma: productObject.brand, locatie: productObject.county})}>
                {productObject.brand} - {productObject.county}
            </a><span>/</span>       

            <a href={props.gotoSearch({firma: productObject.brand, locatie: productObject.county+ ";" + 
                productObject.city.City})}>
                {productObject.brand} - {productObject.city.City.replaceAll("*", "")}
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
                    <span>
                        <iconify-icon icon="bytesize:bookmark"></iconify-icon>Promoveaza</span><span onClick={() => window.location.reload()}><iconify-icon icon="carbon:reset"></iconify-icon>Reactualizeaza</span>
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
                        <button style={phoneState ? {display: "none"}: {}}onClick={() => {setPhoneState(true)}} 
                            className="green-button"><span>Arata</span></button>
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
                <SwiperBottom openedID={productObject.id} gotoOffer={props.gotoOffer} 
                    promotedProductsArray={props.promotedProductsArray} products={user.products}/>
            </section>

            <section className="bottom-div similar">
                <h1>Anunturi Similare</h1>
                <SwiperBottom openedID={productObject.id} gotoOffer={props.gotoOffer} 
                    promotedProductsArray={props.promotedProductsArray} 
                    products={props.data.categories[productObject.category]}/>
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
                                return star ? <iconify-icon key={starkey++}icon="bi:star-fill"></iconify-icon> : 
                                    <iconify-icon key={starkey++} icon="bi:star"></iconify-icon>
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


                <a className="more" href="#">Mai 
                    multe anunturi ale acestui vanzator<iconify-icon icon="akar-icons:chevron-right"></iconify-icon></a>


            </section>

            <section className="location">
                <span>LOCALIZARE</span>
                <div className="info">
                    <div className="location-name">
                        <iconify-icon icon="akar-icons:location"></iconify-icon>
                        <div>
                            <span>{user.address.city.City.replaceAll("*", "")},</span>
                            <br></br>
                            {user.address.county}
                        </div>
                    </div>
                    <div onClick={() => {setMapVisible(true)}} className="image">
                        <img src={
                            
                            `https://maps.googleapis.com/maps/api/staticmap?` + 
                            `size=144x104&` +
                            `key=${MapsKey}&` + 
                            `center=${user.address.city.City}+${user.address.county}+Romania&` +
                            `maptype=terrain&` + 
                            `style=element:labels|visibility:off` 
                            
                        }></img>
                        <div><div></div></div>
                        {/* 145x105 */}
                    </div>
                </div>
            </section>

            <section className="details">
                <span style={{"color": "black"}}>DREPTURILE CONSUMATORILOR</span>
                <br></br>                
                <br></br>
                Acest anunț a fost publicat de către un vânzător privat.
                <br></br>
                <br></br>

                <details>
                        <summary><span>Ca urmare...</span></summary>
                        <p>
                            legile privind drepturile consumatorilor nu se aplică în cazul achizițiilor pe care le faci de la acest vânzător. Este deosebit de important să <a href="#"> respecți sfaturile noastre </a>cu privire la siguranță în interacțiunile cu vânzători privați.
                            <br></br>
                            <br></br>
                            Există mai multe entități implicate atunci când cumperi un produs sau un serviciu de pe OLX. Fiecare dintre acestea au următoarele responsabilități:
                            <br></br>
                            <br></br>
                            1. <span>OLX este responsabil pentru</span> furnizarea serviciilor online, precum un cont OLX, publicarea și promovarea anunțurilor, posibilitatea de a cumpăra produse cu Livrare prin OLX și alte servicii descrise în Condițiile noastre de utilizare.<br></br>
                            2. <span>Vânzătorii privați sunt responsabili pentru</span> vânzarea și trimiterea produsului sau prestarea serviciului exact așa cum a fost descris în anunț. Dacă ai întrebări legate de achiziția ta, îți recomandăm să contactezi direct vânzătorul privat.<br></br>
                            3. <span>Partenerii noștri de livrare sunt responsabili pentru</span> livrarea produselor către tine, conform descrierii din Condițiile de utilizare ale acestora.<br></br>
                            <br></br>
                            <br></br>
                            <a href="#">Mergi la centrul nostru de ajutor</a> pentru informații detaliate cu privire la drepturile consumatorilor pe OLX.
                        </p>
                </details>
                
            </section>
        </aside>



        <div style={!mapVisible ? {display: "none"} : {}} className="MAP">
            <header><iconify-icon onClick={() => {setMapVisible(false)}} icon="akar-icons:chevron-left">
                </iconify-icon>{productObject.title}</header>
            <iframe
                width="100%"
                height="94%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={
                    `https://www.google.com/maps/embed/v1/place?` +
                    `key=${MapsKey}&` +
                    `q=${user.address.city.City}+${user.address.county}+Romania&` +
                    `language=RO&` 
                }> 
            </iframe>
        </div>



        </div>
    </div>)
}