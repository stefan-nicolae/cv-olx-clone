import "./header.css"
import Logo from "./olx-logo.png"

export default function Header () {
    return(
        <header>
            <div className="header-wrapper">
                <img onClick={() => {window.location = "/"}} src={Logo}/>
                <div className="buttons">
                    <button className="btn-messages"><iconify-icon icon="bx:message-rounded"></iconify-icon>Mesaje</button> 
                    <button className="btn-fav"><iconify-icon icon="akar-icons:heart"></iconify-icon></button> 
                    <button className="btn-profile"><iconify-icon icon="bi:person"></iconify-icon>Contul tau</button>
                    <button className="btn-new-announcement green-button"><span>Adauga Anunt Nou</span></button>
                </div>
            </div>
        </header>
    )
}