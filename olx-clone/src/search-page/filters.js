import { capitalize } from "../container/container"
import "./filters.css"

export default function Filters (props) {
    //category brand pricerange sortby (price dateuploaded)
    const selected = {} 
    selected["categorie"] = props.searchParams.categorie ? decodeURIComponent(props.searchParams.categorie) : undefined
    selected["firma"] = props.searchParams.firma ? decodeURIComponent(props.searchParams.firma).replaceAll("+", " ").replaceAll("_", " ").toLowerCase() : undefined
    selected["sorteaza"] = props.searchParams.sorteaza 

    const dropdowns = []
    const brands = !selected["categorie"] ? JSON.parse(window.localStorage.getItem("allBrands")).sort() : (() => {
        const brands = []
        props.data.categories[selected["categorie"]].forEach(product => {
            brands.push(product.brand.toLowerCase().replaceAll("_", " ").toLowerCase())
        })  
        const uniqueBrands = [...new Set(brands.sort())]
        if(selected["firma"] && !uniqueBrands.includes(selected["firma"])) props.filteredSearch({"firma": undefined})
        return uniqueBrands
    })()

    const categories = Object.keys(props.data.categories).sort()
    dropdowns.push(["categorie", categories], ["firma", brands], ["sorteaza", ["Scump", "Ieftin", "Noi"]])
    

    console.log(selected)

    let key1=0, key2=0
    return (
        <form className="filters">
            {
                dropdowns.map(dropdown => {
                    return(<div key={key1++}className="dropdown">
                        <label htmlFor={dropdown[0]}>{capitalize(dropdown[0])}</label>

                        <select style={

                                // !selected[dropdown[0]] ? (dropdown[0] !== "sorteaza" ? {"color": "gray"} : {}) : {}
                                !selected[dropdown[0]] ? {color: "gray"} : {}

                            } defaultValue={

                                // selected[dropdown[0]] ? selected[dropdown[0]] : (dropdown[0] === "sorteaza" ? "Noi" : "placeholder") 
                                selected[dropdown[0]] ? selected[dropdown[0]] : "placeholder"

                            } name={dropdown[0]}>



                            <option style={
                                // dropdown[0] === "sorteaza" ? {display: "none"} : {}
                                {}
                            } onClick={(e) => [
                                e.target.parentElement.parentElement.parentElement.submit()
                            ]} value={"placeholder"}>
                                {/* Toate */}
                                {dropdown[0] === "sorteaza" ? "Fara sortare" : "Toate"}
                            </option>

                            {
                                dropdown[1].map(option => {
                                    const optionShown = capitalize(option.replaceAll(dropdown[0] === "Firma" ? " " : "-", " ").replaceAll("_", " "))
                                    return(<option onClick={(e) => {
                                        e.target.parentElement.parentElement.parentElement.submit()
                                    }} key={key2++} value={
                                        option
                                    }>{optionShown}</option>)
                                })
                            }

                        </select>
                    </div>)
                })
            }
            <div className="dropdown"><span>Limita pret</span>
                <div className="inputs">
                    <input type="number"></input><input type="number"></input>
                </div>
            </div>
        </form>
    )
}