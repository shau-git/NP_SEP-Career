import { Hero, Stats, Quote , Category, Features} from "../components/home/home_config"

const Home = () => {
    return (
        <div className="bg-[#0f0f1e] min-h-screen text-white overflow-hidden">
            <Hero/>
            <Quote />
            <Stats/>
            <Category/>
            <Features/>
        </div>
    )
}

export default Home