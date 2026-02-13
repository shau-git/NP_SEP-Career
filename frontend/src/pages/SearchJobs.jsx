import {useId, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X,  Loader2 , ArrowLeft} from 'lucide-react';
import {getJobPost} from "../utils/fetch_data/fetch_config"
import {toast} from "react-toastify"
import { JobCards } from '../components/home/home_config';
import {FilterSection, ApplyButton, ClearButton} from "../components/searchjob/searchjob_config"


export default function SearchResults({setFetchCount}) {
    const key = useId()
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()

    // Get search parameters from URL
    const title = searchParams.get('title') || '';
    const industryFilter = searchParams.get('industry') || '';
    const [searching, setSearching] = useState(true)
    const [searchTitle, setSearchTitle] = useState(title);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortBy, setSortBy] = useState('recent');
    const [filters, setFilters] = useState({
        employment_type: [],
        experience: [],
        industry: industryFilter ? [industryFilter] : []
    });

    // NEW: State for API data
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalResults, setTotalResults] = useState(0);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showMobileFilters) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showMobileFilters]);

    // FETCH JOBS FROM BACKEND - This runs whenever search params or filters change
    useEffect(() => {
        if(!searching) return 
        fetchJobs();
        setSearching(false)

        // get notification count at every fileter,search,sort change
        if(localStorage.getItem("token")) setFetchCount(true)
    }, [searching, filters, sortBy]);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);

        try {
            // Build query parameters for API
            const params = new URLSearchParams();

            // Search parameters
            if (searchTitle) params.append('title', searchTitle);

            // Filter parameters
            if (filters.employment_type.length > 0) {
                filters.employment_type.forEach(type => params.append('employment_type', type));
            }
            if (filters.experience.length > 0) {
                filters.experience.forEach(exp => params.append('experience', exp)); 
            }
            
            if (filters.industry.length > 0) {
                filters.industry.forEach(ind => params.append('industry', ind));
            }

            // Sorting and pagination
            params.append('sortBy', sortBy);
            // console.log(params.toString())
            const response = await getJobPost(params.toString())
            const data = await response.json()
            // console.log(data)

            if(response.status === 200) {
                setJobs(data.data || []);
                setTotalResults(data.total || 0);
                toast.success(data.message)
            } 
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError(err.message);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            const currentFilters = prev[filterType];
            const newFilters = currentFilters.includes(value)
                ? currentFilters.filter(item => item !== value)
                : [...currentFilters, value];

            return {
                ...prev,
                [filterType]: newFilters
            };
        });
    };

    const clearAllFilters = () => {
        setFilters({
            employment_type: [],
            experience: [],
            industry: []
        });
    };

    // clear query function
    const clearQuery = () => {
        setSearchTitle('');
        setSearchParams(new URLSearchParams());
        // to re query all data
        setSearching(true)
    }

    const getActiveFilterCount = () => {
        return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        setSearching(true)
    };

    const industryList = [
        'IT & Technology', 
        'Finance & Business', 
        'Engineering', 
        'Healthcare', 
        'Creative & Media',
        'F&B (Food & Bev)', 
        'Retail & Sales', 
        'Logistics & Trades', 
        'Education'
    ];

    const filterOptions = {
        employment_type: [
            { label: 'Full-Time', value: 'full time' },
            { label: 'Part-Time', value: 'part time' },
        ],
        experience: [
            { label: '0-2 years', value: '0-2' },
            { label: '2-5 years', value: '2-5' },
            { label: '5-8 years', value: '5-8' },
            { label: '8+ years', value: '8+' }
        ],
        industry: industryList.map(name => ({ label: name, value: name }))
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

            {/* Search Bar Section */}
            <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-2 sm:pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="cursor-pointer p-0 mb-0 sm:p-2 sm:mb-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Job title, keywords, or company"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && setSearching(true)}
                                disabled={loading}
                                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                            />
                            <X onClick={() => clearQuery()} className="cursor-pointer w-5 h-5 absolute right-4 top-1/2 text-gray-400  transform -translate-y-1/2"/>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => setSearching(true)}
                            className="cursor-pointer px-8 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                'Search'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100 mb-1">Search Results</h2>
                        <p className="text-slate-400">
                            {loading ? (
                                'Searching...'
                            ) : (
                                <>
                                    Found <span className="text-purple-400 font-semibold">{totalResults}</span> opportunities
                                    {getActiveFilterCount() > 0 && (
                                        <span> with <span className="text-purple-400 font-semibold">{getActiveFilterCount()}</span> filters applied</span>
                                    )}
                                </>
                            )}
                        </p>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors relative"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {getActiveFilterCount() > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">
                                {getActiveFilterCount()}
                            </span>
                        )}
                    </button>

                    {/* Desktop Sort  at top left of the job post card*/}
                    <div className="hidden lg:flex items-center gap-3">
                        <span className="text-slate-400 text-sm">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            disabled={loading}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="salary-high">Salary: High to Low</option>
                            <option value="salary-low">Salary: Low to High</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 shrink-0 ">
                        <div className=" bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sticky top-24">
                            <h3 className="text-lg font-semibold text-slate-100 mb-6">Filters</h3>

                            <FilterSection {...{title: 'Job Type', filterType: 'employment_type', options: filterOptions.employment_type, filters, loading, handleFilterChange}}/>
                            <FilterSection {...{title: 'Experience Level',  filterType: 'experience', options: filterOptions.experience, filters, loading, handleFilterChange}}/>
                            <FilterSection {...{title: 'Industry', filterType: 'industry', options: filterOptions.industry,  filters, loading, handleFilterChange}}/>
                            <div className="mt-6 flex gap-3">
                                <ClearButton handleClick={() => {clearAllFilters(); setSearching(true)}}/>
                                <ApplyButton handleClick={() => setSearching(true)} title={`Apply (${totalResults})`}/>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filters Overlay */}
                    {showMobileFilters && (
                        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50  ">
                            <div className=" absolute right-0 top-0 h-full w-full max-w-sm bg-slate-900 shadow-2xl overflow-y-scroll">
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
                                        <FilterSection {...{title: 'Job Type', filterType: 'employment_type', options: filterOptions.employment_type, filters, loading, handleFilterChange}}/>
                                        <FilterSection {...{title: 'Experience Level',  filterType: 'experience', options: filterOptions.experience, filters, loading, handleFilterChange}}/>
                                        <FilterSection {...{title: 'Industry', filterType: 'industry', options: filterOptions.industry,  filters, loading, handleFilterChange}}/>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <ClearButton handleClick={() => {clearAllFilters(); setSearching(true)}}/>
                                        <ApplyButton handleClick={() => { setShowMobileFilters(false); setSearching(true)}} title={`Apply (${totalResults})`}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Listings */}
                    <main className="flex-1 min-w-0">
                        {loading && (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
                                <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-100 mb-2">Loading jobs...</h3>
                                <p className="text-slate-400">Please wait while we fetch the latest opportunities</p>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/50 rounded-xl p-12 text-center">
                                <div className="text-6xl mb-4">⚠️</div>
                                <h3 className="text-xl font-semibold text-slate-100 mb-2">Error loading jobs</h3>
                                <p className="text-slate-400 mb-6">{error}</p>
                                <button
                                    onClick={fetchJobs}
                                    className="cursor-pointer px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {!loading && !error && jobs.length === 0 && (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-slate-100 mb-2">No jobs found</h3>
                                <p className="text-slate-400 mb-6">Try adjusting your filters or search criteria</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}

                        {!loading && !error && jobs.length > 0 && (
                            <div className="">
                                <div className="py-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-8">{/* max-h-screen overflow-y-scroll  */}
                                    
                                    {
                                        jobs.map((data, i) => (
                                            <JobCards {...{data}} key={`${key}-${i}`}/>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}