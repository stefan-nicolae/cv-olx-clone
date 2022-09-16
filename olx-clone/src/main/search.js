import "./main.css"

export default function SearchForm () {
    return(
        <form className="search-form">
            <div className="banner">
                <h1>Cum să recunoști escrocheriile de tip phishing în OLX și cum să le eviți?</h1>
                <div></div>
                <button>Afla mai multe<div></div></button>
                <button><iconify-icon icon="bi:x-lg"></iconify-icon></button>
            </div>
            <div className="form-wrapper">
                <iconify-icon className="search-icon-1" icon="bi:search"></iconify-icon>
                <input className="input-search" type="text" placeholder="1.000.000 anunturi din apropierea ta"></input>
                  
                <span></span>
                <iconify-icon className="location-icon" icon="akar-icons:location"></iconify-icon>
                <input className="input-location" type="text" placeholder="Toata Romania"></input>

                <button>Cauta acum <iconify-icon className="search-icon-2" icon="bi:search"></iconify-icon></button>
               
            </div>
        </form>
    )
}