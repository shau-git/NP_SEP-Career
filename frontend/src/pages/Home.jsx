import { Hero, Stats, Quote , Category, Features} from "../components/home/home_config"
import {useState} from "react"

const Home = () => {
    const [jobPost, setJobPost] = useState(null)
    const [industry, setIndustry] = useState({
        'IT & Technology': 0,
        'Finance & Business': 0,
        'Engineering': 0,
        'Healthcare': 0,
        'Creative & Media': 0,
        'F&B (Food & Bev)': 0,
        'Retail & Sales': 0,
        'Logistics & Trades': 0,
        'Education': 0
    })
    return (
        <div className="bg-[#0f0f1e] min-h-screen text-white overflow-hidden">
            <Hero/>
            <Quote />
            <Stats/>
            <Category {...{industry}}/>
            <Features {...{jobPost, setJobPost, setIndustry}}/>
        </div>
    )
}

export default Home