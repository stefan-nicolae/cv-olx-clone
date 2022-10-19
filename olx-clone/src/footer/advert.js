// green section
import "./footer.css"
import Image from "./flower-mouse.jpg"
import Logo from "./reverse-olx-logo.png"

export default function Advert () {
    return(
        <div className="advert">

            <section>
                <div className="wrapper">
                    <img src={Image}></img>
                    <div>
                        <h2>Creste-ti afacerea pe OLX!</h2>
                        <h1>Descoperă oferta olx pentru afaceri</h1>
                    </div>
                    <button className="green-button"><span>Vezi mai multe detalii</span></button>
                </div>
            </section>

            <section>
                <div className="wrapper">
                    <img src={Logo}></img>
                    <p>OLX.ro iti ofera posibilitatea de a publica anunturi gratuite 
                        pentru orasul tau si imprejurimile sale. 
                        Vei gasi usor pe OLX.ro anunturi gratuite interesante din Bucuresti, Ilfov 
                        si alte orase din tara si vei putea intra usor in legatura cu cei care le-au publicat. 
                        Pe OLX.ro te asteapta locuri de munca, apartamente si camere de inchiriat, masini second-hand 
                        si telefoane mobile la preturi mici. Daca vrei sa vinzi ceva vei putea adauga foarte usor 
                        anunturi gratuite. Daca vrei sa cumperi ceva aici vei putea gasi produsele care te intereseaza
                         la preturi mai mici decat in orice magazin. </p>
                    <h3>Fii alaturi de noi si pe retelele sociale:</h3>
                    <button className="twitter">
                        <iconify-icon icon="akar-icons:twitter-fill"></iconify-icon>Tweet</button>
                </div>
            </section>
        </div>
    )
}