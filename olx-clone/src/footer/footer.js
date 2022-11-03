import "./footer.css"
import DOCUMENT from "./document.svg"
import APP_STORE from "./app-store.svg"
import GOOGLE_PLAY from "./google-play.svg"

export default function Footer (props) {
    const footerLinks = [
        {
            title: "Ajutor si contact",
            url: "#"
        },
        {
            title: "Cautari frecvente",
            url: "#"
        },
        {
            title: "Conditii de utilizare",
            url: "#"
        },
        {
            title: "Politica de confidentialitate",
            url: "#"
        },
        {
            title: "Setari Cookies",
            url: "#"
        },
        {
            title: "Harta site",
            url: "#"
        },
        {
            title: "Harta judetelor",
            url: "#"
        },
        {
            title: "Cariere in OLX",
            url: "#"
        },
        {
            title: "ANPC",
            url: "#"
        },
        {
            title: "Parteneri",
            url: "#"
        },
        {
            title: "Aplicatii mobile",
            url: "#"
        },
        {
            title: "Cum functioneaza",
            url: "#"
        },
        {
            title: "OLX pentru afacerea ta",
            url: "#"
        },
        {
            title: "Livrare prin OLX",
            url: "#"
        },
        {
            title: "Promovarea anunturilor",
            url: "#"
        },
        {
            title: "Blog OLX",
            url: "#"
        },
        {
            title: "Sfaturi de siguranta",
            url: "#"
        },
        {
            title: "How to OLX",
            url: "#"
        },
        {
            title: "Publicitate pe OLX",
            url: "#"
        },
        {
            title: "Bun de angajat",
            url: "#"
        },
        {
            title: "Incotro in RO",
            url: "#"
        },
    ]

    let key = 0 
    let key2 = 0
    return(
        <footer>
            <section>
                <div className="wrapper">
                    <img src={DOCUMENT}></img>
                    <p><span>Categorii principale: </span>
                        {
                            Object.keys(props.categories).map(category => {
                                return <a href={props.gotoSearch({"categorie": category})} key={key++}>{category.replaceAll("-", " ")}<span className="comma">, </span></a>
                            })
                        }
                    </p>
                </div>
            </section>
            <section>
                <div className="links">
                    {footerLinks.map(link => {
                        return(<a key={key2++} href={link.url}>{link.title}</a>)
                    })}
                </div>
                <div className="bottom-links">
                    <a href="#"><iconify-icon icon="openmoji:flag-bulgaria"></iconify-icon>OLX.bg</a>
                    <a href="#"><iconify-icon icon="openmoji:flag-poland"></iconify-icon>OLX.pl</a>
                    <a href="#"><iconify-icon icon="openmoji:flag-ukraine"></iconify-icon>OLX.ua</a>
                    <a href="#"><iconify-icon icon="openmoji:flag-portugal"></iconify-icon>OLX.pt</a>
                    <a href="#"><iconify-icon icon="openmoji:flag-romania"></iconify-icon>Autovit.ro</a>
                    <a href="#"><iconify-icon icon="openmoji:flag-romania"></iconify-icon>Storia.ro</a>
                    <a href="#"><iconify-icon icon="openmoji:flag-romania"></iconify-icon>OLX Business</a>
                </div>
                <div className="aside">
                    <div className="follow">
                        Urmareste-ne pe
                        <a href="#"><iconify-icon icon="akar-icons:facebook-fill"></iconify-icon></a>
                        <a href="#"><iconify-icon icon="akar-icons:instagram-fill"></iconify-icon></a>
                        <a href="#"><iconify-icon icon="akar-icons:youtube-fill"></iconify-icon></a>
                    </div>
                    <div className="download">
                        Descarca aplicatia pentru telefon din 
                        <a href="#"><img src={APP_STORE}></img></a>
                        <a href="#"><img src={GOOGLE_PLAY}></img></a>
                    </div>
                </div>
            </section>
        </footer>
    )
}