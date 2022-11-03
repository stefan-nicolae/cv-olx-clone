import { capitalize, makeSureItOnlyHasNumbers } from "../container/container"
import "./filters.css"

export default function Filters (props) {
    //category brand pricerange sortby (price dateuploaded)
    const selected = {} 
    selected["categorie"] = props.searchParams.categorie ? decodeURIComponent(props.searchParams.categorie) : undefined
    selected["firma"] = props.searchParams.firma ? decodeURIComponent(props.searchParams.firma.replaceAll("_", " ")) :  undefined
    selected["sorteaza"] = props.searchParams.sorteaza ? capitalize(props.searchParams.sorteaza).replaceAll(" ", "") : undefined
    selected["minim"] = props.searchParams.minim
    selected["maxim"] = props.searchParams.maxim

    const submitForm = (e) => {
        console.log(e[0].value)
        const formData = {}
        for(let i = 0; i <= 2; i++) {
            formData[e[i].name] = e[i].value !== "placeholder" ? e[i].value : undefined
        }

        for(let i = 3; i <= 4; i++) {
            formData[e[i].name] = e[i].value ? e[i].value : undefined
        }       

        if(e[0].value && e[1].value && e[0].value !== "placeholder" && e[1].value !== "placeholder") {
            const brands = []
            
            props.data.categories[e[0].value].forEach(product => {
                brands.push(product.brand.toLowerCase().replaceAll("_", " ").toLowerCase())
            })  
            if(!brands.includes(e[1].value)) formData["firma"] = undefined
        }

         props.filteredSearch(formData)
    }

    const dropdowns = []
    const brands = !selected["categorie"] ? JSON.parse(window.localStorage.getItem("allBrands")).sort() : (() => {
        const brands = []
        props.data.categories[selected["categorie"]].forEach(product => {
            brands.push(product.brand.toLowerCase().replaceAll("_", " ").toLowerCase())
        })  
        return [...new Set(brands.sort())]
    })()

    const categories = Object.keys(props.data.categories).sort()
    dropdowns.push(["categorie", categories], ["firma", brands], ["sorteaza", ["scumpe", "ieftine", "noi"]])
    
    Object.keys(selected).forEach(filter => {
       if(selected[filter]) selected[filter] = selected[filter].toLowerCase()
    })

    console.log(selected)
    
    const handlePriceInputKeys = (e) => {
        const regex=/^[0-9]+$/
        if(!e.key.match(regex) && e.key !== "Backspace" && e.key !== "Enter") e.preventDefault()
        if(e.key === "Enter") {
            submitForm(e.target.parentElement.parentElement.parentElement)
        }
    }

    const handlePriceInputChange = (e) => {
        const current = e.target
        const other = document.querySelector(`input[name="${current.name !== "maxim" ? "maxim" : "minim"}"]`)
        if(current.value !== "" && makeSureItOnlyHasNumbers(current.value)) current.value = "" 

        if(current.value !== "" && other.value !== "") {
            if(current.name === "minim" && current.value > other.value) other.value = current.value
            if(current.name === "maxim" && current.value < other.value) other.value = current.value
        }
        setTimeout(() => {
            submitForm(e.target.parentElement.parentElement.parentElement)
        }, 2000)
    }

    let key1=0, key2=0


    return (
        <form className="filters">
            {
                dropdowns.map(dropdown => {
                    return(<div key={key1++} className="dropdown">
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
                                submitForm(e.target.parentElement.parentElement.parentElement)
                            ]} value={"placeholder"}>
                                {/* Toate */}
                                {dropdown[0] === "sorteaza" ? "Fara sortare" : "Toate"}
                            </option>

                            {
                                dropdown[1].map(option => {
                                    const optionShown = capitalize(option.replaceAll(dropdown[0] === "Firma" ? " " : "-", " ").replaceAll("_", " "))
                                    return(<option onClick={(e) => {
                                        submitForm(e.target.parentElement.parentElement.parentElement)
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
                    <input defaultValue={selected["minim"]} onChange={(e) => {handlePriceInputChange(e) }} onKeyUp={(e) => {handlePriceInputKeys(e)}} name="minim" placeholder="Minim"></input>
                    <input defaultValue={selected["maxim"]} onChange={(e) => {handlePriceInputChange(e) }} onKeyUp={(e) => {handlePriceInputKeys(e)}} name="maxim" placeholder="Maxim"></input>
                </div>
            </div>
        </form>
    )
}