import {useState, useEffect} from 'react'
import { useParams , useNavigate} from 'react-router-dom';
import {getUser, getCompanies, createCompany} from "../utils/fetch_data/fetch_config"
import Loading from "../components/Loading"
import {toast} from "react-toastify"
import {MapPin, Briefcase, Search, Building2, ChevronRight, X} from "lucide-react"
import {PlusButton, InputTag, SelectTag, TextAreaTag, ActionsButton} from "../components/company/utils/company_util_config"

const UserCompany = ({setFetchCount}) => {

    let {user_id} = useParams();
	user_id = parseInt(user_id)

    const navigate = useNavigate()
    const [session, setSession] = useState(JSON.parse(localStorage.getItem('user')))
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [userCompanies, setUserCompanies] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        name: '',
        industry: 'IT & Technology',
        location: '',
        description: ''
    });

    // Industry options (matching your schema)
    const industries = [
        'IT & Technology',
        'Healthcare',
        'Finance & Business',
        'F&B (Food & Bev)',
        'Creative & Media',
        'Education',
        'Engineering',
        'Retail & Sales',
        'Logistics & Trades'
    ];

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (showCreateModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showCreateModal]);

    const fetchUser = async () => {
        const response = await getUser(user_id, token)
        const data = await response.json();

        if(response.status === 200) {
            // only need the company_member data 
            const company = data.data.company_members.filter(com => (
                com.removed === false
            ))
            setUserCompanies(company)
            setIsLoading(false)
        } else if (response.status === 404) {
            toast.error(data.message)
            return navigate('/')
        } else {
            toast.error(data.message)
        }
    }

    useEffect(() => {
        if(!user_id) {
            toast.error("User Id must be a number")
            return navigate('/')
        }
        const token = localStorage.getItem('token')
        const session = JSON.parse(localStorage.getItem('user'))

		if(!token || !session || session.user_id !== user_id){
			return navigate('/')
		} 

        setSession(session)
        setToken(token)
        setIsLoading(true)
        fetchUser()
    }, [])

    // handle searching query
    useEffect(() => {
        // If the query is empty, hide the dropdown and don't fetch
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        // 1. Set a timer to wait 500ms after the last keystroke
        const delayDebounceFn = setTimeout(async () => {
            try {
                // 2. Fetch from backend using the name query param
                const response = await getCompanies(`name=${searchQuery}`);
                const data = await response.json();
                
                if (response.status === 200) {
                    setSearchResults(data.data);
                }
            } catch (error) {
                toast.error(data.message)
                console.error("Search failed:", error);
            } 
        }, 500);

        // 3. Cleanup function: clears the timer if the user types again within 500ms
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Navigate to company detail
    const handleViewCompany = (companyId) => {
        // TODO: Replace with actual navigation
        navigate(`/company/${companyId}`);
    };

    // Create company form handlers
    const handleCreateChange = (field, value) => {
        setCreateFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateCreateForm = () => {
        const newErrors = {};

        if (!createFormData.name?.trim()) {
            newErrors.name = 'Company name is required';
        } else if (createFormData.name.length > 50) {
            newErrors.name = 'Name cannot exceed 50 characters';
        }

        if (!createFormData.industry) {
            newErrors.industry = 'Industry is required';
        }

        if (!createFormData.location?.trim()) {
            newErrors.location = 'Location is required';
        } else if (createFormData.location.length > 50) {
            newErrors.location = 'Location cannot exceed 50 characters';
        }

        if (!createFormData.description?.trim()) {
            newErrors.description = 'Description is required';
        } else if (createFormData.description.length > 500) {
            newErrors.description = 'Description cannot exceed 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateCompany = async () => {
        if (!validateCreateForm()) {
            return;
        }

        try {
            // TODO: Replace with actual API call
            const response = await createCompany(createFormData,token)
            const data = await response.json();
            if(response.status === 201){
                // update user state
                setUserCompanies( prevCom => {
                    return [...prevCom, data.data]
                });
                // clear new skill draft
                toast.success(data.message);
                handleCloseCreateModal()
            } else {
                toast.error(data.message)
            }     
        } catch (error) {
            console.error('Failed to create company:', error);
            setErrors({ submit: 'Failed to create company. Please try again.' });
        }

        // fetch latest unread notification count
        setFetchCount(true)
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setCreateFormData({ name: '', industry: 'IT & Technology', location: '', description: '' });
        setErrors({});
    };

    // Get role badge color
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'owner': return 'bg-purple-500/20 text-purple-400';
            case 'admin': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    if(isLoading) return <Loading />
    
    return (
        <div className="min-h-screen bg-gray-950 text-white">

        <div className="max-w-7xl mx-auto pt-25">
            {/* Page Title & Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-6 gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Companies</h1>
                    <p className="text-gray-400">Manage your companies and discover new opportunities</p>
                </div>
                <PlusButton 
                    title="Create Company"
                    handleAdd={() => setShowCreateModal(true)}
                />
            </div>

            {/* Search Section */}
            <div className="mb-8">
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Search Other Companies</h2>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by company name"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                        <Search className="w-5 h-5 absolute left-4 top-1/2 text-gray-400  transform -translate-y-1/2"/>
                        <X onClick={() => setSearchQuery("")} className="cursor-pointer w-5 h-5 absolute right-4 top-1/2 text-gray-400  transform -translate-y-1/2"/>
                    </div>

                    {/* Search Results Dropdown*/}
                    {searchQuery && (
                    <div className="mt-4 bg-gray-800 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            searchResults.map((company) => (
                            <div
                                key={company.company_id}
                                onClick={() => handleViewCompany(company.company_id)}
                                className="p-4 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-700 rounded-lg shrink-0 overflow-hidden">
                                        {company.image ? (
                                            <img src={company.image} alt={company.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <Building2 className="w-6 h-6"/>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{company.name}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4"/>
                                                {company.industry}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {company.location}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{company.description}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500"/>
                                </div>
                            </div>
                        ))
                        ) : (
                        <div className="p-8 text-center text-gray-500">
                            No companies found matching "{searchQuery}"
                        </div>
                        )}
                    </div> 
                    )}
                </div>
            </div>

            {/* My Companies Section */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                <h2 className="text-2xl font-bold mb-6">My Companies</h2>
                
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">
                    Loading your companies...
                    </div>
                ) : userCompanies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userCompanies.map((company) => {
                            const {company_id, image, name, industry, location} = company.company
                            return (
                            <div
                                key={company_id}
                                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                                onClick={() => handleViewCompany(company_id)}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-700 rounded-lg shrink-0 overflow-hidden">
                                        {image ? (
                                            <img src={image} alt={name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <Building2 className="w-8 h-8"/>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-semibold text-white">{name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(company.role)}`}>
                                                {company.role}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4"/>
                                                {industry}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    )}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                        <p className="text-lg mb-2">You're not part of any companies yet</p>
                        <p className="text-sm">Create a company or join an existing one to get started</p>
                    </div>
                )}
            </div>
        </div>

        {/* Create Company Modal */}
        {showCreateModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
                <div className="bg-gray-900 rounded-lg max-w-2xl w-full border border-gray-700">
                    {/* Header */}
                    <div className="border-b border-gray-700 p-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Create New Company</h2>
                        <button
                            onClick={handleCloseCreateModal}
                            className="cursor-pointer text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6"/>
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-6 space-y-4">
                        {/* Company Name */}
                        <InputTag 
                            title="Company Name" 
                            type="text"
                            value={createFormData.name} 
                            placeholder="e.g. Google" 
                            maxLength={50}
                            handleChange={(e) => handleCreateChange('name', e.target.value)}
                            errors={errors.name} 
                        />

                        {/* Industry */}
                        <SelectTag 
                                title="Industry"
                                value={createFormData.industry}
                                handleChange={(e) => handleCreateChange('industry', e.target.value)}
                                options={industries}
                                errors={errors.industry}
                            />

                        {/* Location */}
                        <InputTag 
                            title="Location" 
                            type="text"
                            value={createFormData.location} 
                            handleChange={(e) => handleCreateChange('location', e.target.value)}
                            placeholder="e.g. Singapore CBD" 
                            maxLength={50}
                            errors={errors.location} 
                        />

                        {/* Description */}
                        <TextAreaTag 
                            title="Description"
                            value={createFormData.description}
                            handleChange={(e) => handleCreateChange('description', e.target.value)}
                            rows={4}
                            maxLength={500}
                            placeholder="Tell us about your company..."
                            errors={errors.description}
                        />

                        {/* Error message */}
                        {errors.submit && (
                            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500">
                            {errors.submit}
                            </div>
                        )}

                        {/* Actions */}
                        <ActionsButton title="Create Company" handleCancel={handleCloseCreateModal} handleSubmit={handleCreateCompany}/>
                    </div>
                </div>
            </div>
        )}
    </div> )
}

export default UserCompany