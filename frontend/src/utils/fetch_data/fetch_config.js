import {getJobPost, getOneJobPost, updateJobPost, createJobPost} from "./fetch_job_post"
import {getUser, updateUser, addUserData, deleteUserData, authUser} from "./fetch_user"
import {getOneCompany, updateCompany, createCompany, getCompanyStats, getCompanies} from "./fetch_company"
import {getJobApplicantCompany, getJobApplicantUser, updateApplicant, createApplicant} from "./fetch_job_applicant"
import {getCompanyMember, updateCompanyMember, createCompanyMember} from "./fetch_member"
import {getNotification, putOneNotification, putAllNotification, getUnreadNotificationCount} from "./fecth_notification"
import getPlatformStats from "./fetch_platform_stats"

export {
    getJobPost,
    getOneJobPost,
    updateJobPost,
    createJobPost,

    getUser,
    addUserData,
    updateUser,
    deleteUserData,
    authUser,

    getOneCompany,
    updateCompany,
    createCompany,
    getCompanyStats,
    getCompanies,

    getJobApplicantCompany,
    getJobApplicantUser,
    updateApplicant,
    createApplicant,

    getCompanyMember,
    updateCompanyMember,
    createCompanyMember,

    getNotification,
    putOneNotification,
    putAllNotification,
    getUnreadNotificationCount,

    getPlatformStats
}