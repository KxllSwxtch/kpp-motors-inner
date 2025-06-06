import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import CarCard from "./CarCard"

const url =
  "https://encar-proxy-main.onrender.com/api/catalog/?count=true&q=(And.Hidden.N._.CarType.A._.SellType.%EC%9D%BC%EB%B0%98.)&sr=|ModifiedDate|0|4"

const CatalogSection = () => {
  const [cars, setCars] = useState([])
  const [usdKrwRate, setUsdKrwRate] = useState(0)
  useEffect(() => {
    const fetchUsdKrwRate = async () => {
      try {
        const response = await axios.get(
          "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
        )

        if (response.status === 200) {
          const jsonData = response.data
          const rate = jsonData["usd"]["krw"]

          console.log(rate)

          setUsdKrwRate(rate)
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchUsdKrwRate()
  }, [])

  useEffect(() => {
    const fetchCars = async () => {
      const res = await axios.get(url)
      setCars(res.data?.SearchResults)
    }
    fetchCars()
  }, [])

  return (
    <div id="fresh-cars">
      <h1 className="text-2xl font-bold text-center mb-4">
        8 свежих автомобилей
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {cars.map((car) => (
          <CarCard key={car.Id} car={car} usdKrwRate={usdKrwRate} />
        ))}
      </div>
      <Link
        to="/catalog"
        className="block w-fit mx-auto mt-8 px-6 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300 shadow-md text-center"
      >
        Посмотреть все автомобили
      </Link>
    </div>
  )
}

export default CatalogSection
