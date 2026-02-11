import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Clock, Bookmark, Heart, Filter, X, ChevronDown } from 'lucide-react';

export default function SearchJobs() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get search parameters from URL
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const industryFilter = searchParams.get('industry') || '';

    const [searchQuery, setSearchQuery] = useState(query);
    const [searchLocation, setSearchLocation] = useState(location);
    const [savedJobs, setSavedJobs] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [filters, setFilters] = useState({
        jobType: [],
        experience: [],
        salary: [],
        industry: industryFilter ? [industryFilter] : []
    });

    // Update local state when URL params change
    useEffect(() => {
        setSearchQuery(query);
        setSearchLocation(location);
        if (industryFilter) {
            setFilters(prev => ({
                ...prev,
                industry: [industryFilter]
            }));
        }
    }, [query, location, industryFilter]);

    // Sample job data
    const jobs = [
        {
            id: 1,
            title: "LMS Administrator",
            company: "EduPrimary",
            logo: "🎓",
            location: "Onsite",
            type: "Full-Time",
            salary: "$4k - $5.5k",
            industry: "Education",
            experience: "0-2 years",
            description: "Maintain the technical platform that powers our online learning.",
            postedDays: 26,
            bgColor: "bg-purple-100"
        },
        {
            id: 2,
            title: "Fleet Maintenance Manager",
            company: "CargoFast",
            logo: "🚚",
            location: "Onsite",
            type: "Full-Time",
            salary: "$4.5k - $6.5k",
            industry: "Logistics & Trades",
            experience: "0-2 years",
            description: "Ensure the safety and efficiency of our global delivery fleet.",
            postedDays: 26,
            bgColor: "bg-blue-100"
        },
        {
            id: 3,
            title: "Senior Frontend Developer",
            company: "TechCorp",
            logo: "💻",
            location: "Remote",
            type: "Full-Time",
            salary: "$6k - $9k",
            industry: "IT & Technology",
            experience: "3-5 years",
            description: "Build stunning user interfaces with React and modern web technologies.",
            postedDays: 12,
            bgColor: "bg-cyan-100"
        },
        {
            id: 4,
            title: "Visual Merchandiser",
            company: "RetailKing",
            logo: "🛍️",
            location: "Onsite",
            type: "Full-Time",
            salary: "$3.5k - $5k",
            industry: "Retail & Sales",
            experience: "1-3 years",
            description: "Create visually stunning store displays that drive customer traffic.",
            postedDays: 26,
            bgColor: "bg-orange-100"
        },
        {
            id: 5,
            title: "Pastry Specialist",
            company: "Food Paradise",
            logo: "🍰",
            location: "Onsite",
            type: "Full-Time",
            salary: "$3k - $4.5k",
            industry: "F&B (Food & Bev)",
            experience: "2-4 years",
            description: "Create artisanal desserts and baked goods for our flagship location.",
            postedDays: 26,
            bgColor: "bg-pink-100"
        },
        {
            id: 6,
            title: "Financial Analyst",
            company: "InvestPro",
            logo: "💼",
            location: "Hybrid",
            type: "Full-Time",
            salary: "$5k - $7.5k",
            industry: "Finance & Business",
            experience: "2-4 years",
            description: "Analyze financial data and provide strategic insights for investment decisions.",
            postedDays: 18,
            bgColor: "bg-green-100"
        },
        {
            id: 7,
            title: "Mechanical Engineer",
            company: "BuildTech",
            logo: "⚙️",
            location: "Onsite",
            type: "Full-Time",
            salary: "$5.5k - $8k",
            industry: "Engineering",
            experience: "3-5 years",
            description: "Design and optimize mechanical systems for industrial applications.",
            postedDays: 15,
            bgColor: "bg-gray-100"
        },
        {
            id: 8,
            title: "Registered Nurse",
            company: "HealthCare Plus",
            logo: "🏥",
            location: "Onsite",
            type: "Full-Time",
            salary: "$4.5k - $6k",
            industry: "Healthcare",
            experience: "1-3 years",
            description: "Provide compassionate patient care in a modern medical facility.",
            postedDays: 8,
            bgColor: "bg-red-100"
        }
    ];

    const toggleSaveJob = (jobId) => {
        setSavedJobs(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    const handleSearchRefinement = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (searchLocation) params.append('location', searchLocation);
        setSearchParams(params);
    };

    const handleJobClick = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    const filterOptions = {
        jobType: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote', 'Hybrid', 'Onsite'],
        experience: ['0-2 years', '1-3 years', '2-4 years', '3-5 years', '5+ years'],
        salary: ['$3k - $5k', '$5k - $7k', '$7k - $10k', '$10k+'],
        industry: [
            'IT & Technology', 'Finance & Business', 'Engineering', 'Healthcare', 'Creative & Media',
            'F&B (Food & Bev)', 'Retail & Sales', 'Logistics & Trades', 'Education'
        ]
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            {/* <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                        >
                            CareerHub
                        </button>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                <Briefcase className="w-6 h-6 text-slate-300" />
                            </button>
                            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                <Heart className="w-6 h-6 text-slate-300" />
                            </button>
                            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-full" />
                            </button>
                        </div>
                    </div>
                </div>
            </header> */}

            {/* Search Bar Section */}
            <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <form onSubmit={handleSearchRefinement} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Job title, keywords, or company"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Location"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100 mb-1">Search Results</h2>
                        <p className="text-slate-400">Found <span className="text-purple-400 font-semibold">{jobs.length}</span> opportunities matching your criteria</p>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>

                    {/* Desktop Sort */}
                    <div className="hidden lg:flex items-center gap-3">
                        <span className="text-slate-400 text-sm">Sort by:</span>
                        <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Most Relevant</option>
                            <option>Most Recent</option>
                            <option>Salary: High to Low</option>
                            <option>Salary: Low to High</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-slate-100">Filters</h3>
                                <button className="text-sm text-purple-400 hover:text-purple-300">Clear all</button>
                            </div>

                            {/* Job Type Filter */}
                            <div className="mb-6">
                                <button className="flex items-center justify-between w-full mb-3">
                                    <h4 className="text-sm font-medium text-slate-200">Job Type</h4>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                                <div className="space-y-2">
                                    {filterOptions.jobType.map(type => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-slate-300 group-hover:text-slate-100">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Filter */}
                            <div className="mb-6">
                                <button className="flex items-center justify-between w-full mb-3">
                                    <h4 className="text-sm font-medium text-slate-200">Experience Level</h4>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                                <div className="space-y-2">
                                    {filterOptions.experience.map(exp => (
                                        <label key={exp} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-slate-300 group-hover:text-slate-100">{exp}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Salary Filter */}
                            <div className="mb-6">
                                <button className="flex items-center justify-between w-full mb-3">
                                    <h4 className="text-sm font-medium text-slate-200">Salary Range</h4>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                                <div className="space-y-2">
                                    {filterOptions.salary.map(range => (
                                        <label key={range} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-slate-300 group-hover:text-slate-100">{range}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Industry Filter */}
                            <div>
                                <button className="flex items-center justify-between w-full mb-3">
                                    <h4 className="text-sm font-medium text-slate-200">Industry</h4>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                                <div className="space-y-2">
                                    {filterOptions.industry.slice(0, 6).map(industry => (
                                        <label key={industry} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-slate-300 group-hover:text-slate-100">{industry}</span>
                                        </label>
                                    ))}
                                    <button className="text-sm text-purple-400 hover:text-purple-300 mt-2">
                                        Show more...
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filters Overlay */}
                    {showMobileFilters && (
                        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
                            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-slate-900 shadow-2xl overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-slate-100">Filters</h3>
                                        <button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5 text-slate-300" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Job Type */}
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-200 mb-3">Job Type</h4>
                                            <div className="space-y-2">
                                                {filterOptions.jobType.map(type => (
                                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500" />
                                                        <span className="text-sm text-slate-300">{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Experience */}
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-200 mb-3">Experience Level</h4>
                                            <div className="space-y-2">
                                                {filterOptions.experience.map(exp => (
                                                    <label key={exp} className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500" />
                                                        <span className="text-sm text-slate-300">{exp}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Salary */}
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-200 mb-3">Salary Range</h4>
                                            <div className="space-y-2">
                                                {filterOptions.salary.map(range => (
                                                    <label key={range} className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500" />
                                                        <span className="text-sm text-slate-300">{range}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Industry */}
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-200 mb-3">Industry</h4>
                                            <div className="space-y-2">
                                                {filterOptions.industry.map(industry => (
                                                    <label key={industry} className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500" />
                                                        <span className="text-sm text-slate-300">{industry}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
                                            Clear all
                                        </button>
                                        <button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="flex-1 px-4 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Listings */}
                    <main className="flex-1 min-w-0">
                        <div className="space-y-4">
                            {jobs.map(job => (
                                <div
                                    key={job.id}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group"
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-16 h-16 ${job.bgColor} rounded-xl flex items-center justify-center text-3xl shrink-0`}>
                                            {job.logo}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-semibold text-slate-100 mb-1 group-hover:text-purple-400 transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-slate-400">{job.company}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleSaveJob(job.id)}
                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
                                                >
                                                    <Bookmark
                                                        className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-purple-500 text-purple-500' : 'text-slate-400'}`}
                                                    />
                                                </button>
                                            </div>

                                            <p className="text-slate-300 mb-4 line-clamp-2">{job.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs text-slate-300 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {job.location}
                                                </span>
                                                <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs text-slate-300 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {job.type}
                                                </span>
                                                <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-xs text-green-400 flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    {job.salary}
                                                </span>
                                                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400">
                                                    {job.industry}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                                    <span>Exp: {job.experience}</span>
                                                    <span>•</span>
                                                    <span>{job.postedDays} days ago</span>
                                                </div>
                                                <button
                                                    onClick={() => handleJobClick(job.id)}
                                                    className="px-6 py-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                                                >
                                                    Visit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium">
                                1
                            </button>
                            <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
                                3
                            </button>
                            <span className="px-3 text-slate-400">...</span>
                            <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
                                10
                            </button>
                            <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
                                Next
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}