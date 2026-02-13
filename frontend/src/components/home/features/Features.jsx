import {useState, useEffect, useId} from 'react'
import {JobCards} from "../home_config"
import {getJobPost} from "../../../utils/fetch_data/fetch_config"
import {toast} from "react-toastify"

const Features = ({jobPost, setJobPost, setIndustry}) => {
    const key = useId()

    const fetchJobPost = async () => {
        const response = await getJobPost()
        const data = await response.json();
        if(response.status === 200) {
            setJobPost(data)

            // Counts the total number of jobs per industry
            const counts = data.data.reduce((acc, job) => {
                const ind = job.industry;
                acc[ind] += 1
                return acc;
            }, {
                'IT & Technology': 0,
                'Finance & Business': 0,
                'Engineering': 0,
                'Healthcare': 0,
                'Creative & Media': 0,
                'F&B (Food & Bev)': 0,
                'Retail & Sales': 0,
                'Logistics & Trades': 0,
                'Education': 0
            });

            setIndustry(counts);
        } else {
            toast.error(data.message)
        }
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
                        <div className="mb-2 font-semibold max-w-7xl mx-auto">Total: {jobPost.total}</div>
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            
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