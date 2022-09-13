import "./footer.css"
import SVG from "./svg.svg"

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
    return(
        <footer>
            <section>
                <div className="wrapper">
                    <img src={SVG}></img>
                    <p><span>Categorii principale: </span>
                        {
                            Object.keys(props.categories).map(category => {
                                return <a key={key++} href="#">{category}<span className="comma">, </span></a>
                            })
                        }
                    </p>
                </div>
            </section>
            <section>
                <div className="links">
                    {footerLinks.map(link => {
                        return(<a href={link.url}>{link.title}</a>)
                    })}
                </div>
                <div className="bottom-links">
                    <a href="#">OLX.bg</a>
                    <a href="#">OLX.pl</a>
                    <a href="#">OLX.ua</a>
                    <a href="#">OLX.pt</a>
                    <a href="#">Autovit.ro</a>
                    <a href="#">Storia.ro</a>
                    <a href="#">OLX Business</a>
                </div>
                <div className="aside"></div>
            </section>
        </footer>
    )
}