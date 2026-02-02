import {useState, useEffect, useId} from 'react'
import {JobCards} from "../home_config"
import {getJobPost} from "../../../utils/fetch_data/fetch_config"

const Features = () => {
    const [jobPost, setJobPost] = useState(null)
    const key = useId()

    const fetchJobPost = async () => {
        const data = await getJobPost()
        setJobPost(data)
    }

    useEffect(() => {
        fetchJobPost()
    }, [])

    return (
        <section className="">
            {
                jobPost?.total > 0 ? 
                    <div className="py-24 px-6 bg-white/5">
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-linear-to-r from-[rgb(102,126,234)] to-[rgb(118,75,162)] bg-clip-text text-transparent">
                            Featured Opportunities
                        </h2>
                        <div className="mb-2 font-semibold">Total: {jobPost.total}</div>
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                            {
                                jobPost.data.map((data, i) => (
                                    <JobCards {...{data}} key={`${key}-${i}`}/>
                                ))
                            }
                        </div>
                    </div>
                : <p>No Job Post</p>
            }
        </section>
    )
}

export default Features