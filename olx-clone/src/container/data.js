import { useEffect, useRef } from "react"

async function fetchData (data, limit) {
    const response = await fetch(`https://dummyjson.com/${data}?limit=${limit}`)
    if(response.ok) {
        const json = await response.json()
        return json
    }
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
    const categories = useRef()
    useEffect(() => {
        fetchData("products", 100).then(data => {
            products.current = data
            categories.current = indexProductsByCategories(products.current)
            props.setData({products: products.current, categories:categories.current})
        })
    }, [])
    return(<></>)
}