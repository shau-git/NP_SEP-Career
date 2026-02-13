const asyncWrapper = require("./utils/wrapper");
const User = require("../models/user")
const Company = require("../models/company")
const JobPost = require("../models/jobpost")
const JobApplicant = require("../models/jobapplicant")

const getPlatformStats = asyncWrapper(async (req, res) => {
    // 1. Get today's date for the daily count
    const today = new Date().toISOString().split('T')[0];

    // 2. Fetch all counts in parallel
    const [
        totalJobs, 
        totalCompanies, 
        totalUsers, 
        totalApplications, 
        acceptedHires, 
        newJobsToday
    ] = await Promise.all([
        JobPost.count({ where: { removed: false } }),
        Company.count(),
        User.count(),
        JobApplicant.count(), // Total number of applications sent
        JobApplicant.count({ where: { status: 'ACCEPTED' } }), // Successful hires
        JobPost.count({ where: { created_at: today, removed: false } })
    ]);

    // 3. Calculate Rate using totalApplications as the denominator
    // We use Math.ceil to round up to the nearest whole number
    const successRate = totalApplications > 0 
        ? Math.ceil((acceptedHires / totalApplications) * 100) 
        : 0;

    res.status(200).json({
        success: true,
        data: {
            jobs: totalJobs,
            companies: totalCompanies,
            users: totalUsers,
            newToday: newJobsToday,
            successRate: successRate // Percentage of applications that are ACCEPTED
        }
    });
});

module.exports = { getPlatformStats };