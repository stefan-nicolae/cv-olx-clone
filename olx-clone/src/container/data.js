import { useEffect, useRef } from "react"
import * as container_func from "./container"
import { ORASE } from "./orase";

function randomDate(start, end, startHour, endHour) {
    var date = new Date(+start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
  }

const randomNumber = container_func.randomNumber

async function fetchData (data, limit) {
    const response = await fetch(`https://dummyjson.com/${data}?limit=${limit}`)
    if(response.ok) {
        const json = await response.json()
        return json
    } 
}

async function addPropertiesToUsersAndProducts(fetchedUsers, fetchedProducts) {
    //user: locations dates user_ratings
    //products: dates
        const counties = {}
        const users = []
        const products = {}
        products.products = []

        
        ORASE.forEach(cityObj => {
            if(cityObj["County"] === "—") { 
                counties["Bucuresti"] = [cityObj]
            }
            else {
                if(counties[cityObj["County"]] === undefined) counties[cityObj["County"]] = []
                counties[cityObj["County"]].push(cityObj)
            }
            
        })
        
        const countiesArr = Object.keys(counties)
        fetchedUsers.users.forEach(fetchedUser => {
            const address = {}
            address.county = countiesArr[randomNumber(0, countiesArr.length-1)]

            address.city = counties[address.county][randomNumber(0, counties[address.county].length-1)]

            const user = fetchedUser
            user.address = address
            user.dateJoined = randomDate(new Date(2019, 0, 1), new Date(), 0, 23)
            user.rating = (randomNumber(1, 10) ===1) ? randomNumber(1,2) : randomNumber(3, 5)
            users.push(user)
        })

        fetchedProducts.products.forEach(fetchedProduct => {
            const product = fetchedProduct
            const userIndex = randomNumber(0, users.length-1)
            const user = users[userIndex]
            product.userID = user.id
            product.county = user.address.county
            product.city = user.address.city
            product.dateAdded = randomDate(user.dateJoined, new Date(), 0, 23)
            product.rating = user.rating
            
            delete product.discountPercentage
            delete product.stock 

            products.products.push(product)
            
            if(users[userIndex].products === undefined) users[userIndex].products = []
            users[userIndex].products.push(product)
        })

        return [products, counties, users]
}


function indexProductsByCategories(products) {
    const categories = {}
        products.products.forEach(product => {
        const category = product.category
        if(categories[category] === undefined) categories[category] = []
        categories[category].push(product)
    })
    return categories
}


export default function Data (props) {  
    const products = useRef()
    const counties = useRef()
    const users = useRef()
    const categories = useRef()
    const cities = useRef([])

    useEffect(() => {
        fetchData("products", 100).then(fetchedProducts => {
            fetchData("users", 100).then(fetchedUsers => {
                addPropertiesToUsersAndProducts(fetchedUsers, fetchedProducts).then(res => {
                    products.current = res[0]
                    counties.current = res[1]
                    Object.keys(counties.current).forEach(county => {
                        counties.current[county].forEach(city => {
                            cities.current.push(city)
                        })
                    })
                    users.current = res[2]
                    categories.current = indexProductsByCategories(products.current)
                    products.current.products.sort((a, b) => -(a.dateAdded.getTime() - b.dateAdded.getTime()))
                    props.setData({products:products.current, categories:categories.current, 
                        counties:counties.current, users:users.current, cities:cities.current})
                })
            })
        })
    }, [])
    return(<></>)
}