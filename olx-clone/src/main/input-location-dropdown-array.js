import { useState } from "react"

export default function InputLocationDropdownArray(props) {
    // const chosenCounty = props.chosenLocation ? props.chosenLocation.split(";")[0] : undefined
    // const setChosenCounty = props.setChosenLocation
    const [chosenCounty, setChosenCounty] = useState()
    let columns = [] 

    if(!chosenCounty) {
        const countyArr = Object.keys(props.data.counties)
        countyArr.sort()
    
        let index = 0
        for(let i = 0; i < 4; i++) {
            const column = []
            for(let j = 0; j < 11; j++) {
                let pushed = false
                while(!pushed) {
                    const county = countyArr[index++]
               
                        column.push(county)
                        pushed = true
                    
                }
            }
            columns.push(column)
        }
    }
    else {
        const chosenCountyArray = props.data.counties[chosenCounty]
        let index = 0
        for(let i=0; i<4; i++) {
            const column = []
            for(let j=0; j<chosenCountyArray.length/4;j++) {
                if(chosenCountyArray[index]) column.push(chosenCountyArray[index++].City.replaceAll("*", "")) 
            }
            columns.push(column)
        }
    }

    let key_column = 0
    let key_county = 0
    return (
        <div className={"counties-wrapper" + (chosenCounty ? " city-menu" : "")}>
            <div className="counties-title">
                {
                    chosenCounty ? <>
                        <span onClick={() => {setChosenCounty(undefined)}}>Alege alt judet</span>
                        <span onClick={() => props.setChosenLocation(chosenCounty)}>Toate anunturile din judet »</span>
                    </> :
                    <span onClick={() => props.setChosenLocation("Toata Romania" + Math.random())}>Toata Romania</span>
                }
                </div>
            <div className="counties">
                {
                    columns.map(column => {
                        return (<div key={key_column++} className="counties-column">
                            {
                                column.map(county => {
                                    return (
                                        <div 
                                            style={!county ? {"display": "none"} : undefined} 
                                            onClick={() => !chosenCounty ? setChosenCounty(county) : 
                                                props.setChosenLocation(chosenCounty + ";" + county)} 
                                            key={key_county++} 
                                            className={"county"} 
                                        >
                                            <span>{county}</span>
                                            {!chosenCounty ? <iconify-icon icon="akar-icons:chevron-right"></iconify-icon> 
                                                : <></>}
                                        </div>)
                                })
                            }
                        </div>)
                    })
                }
            </div>
        </div>
    ) 
}