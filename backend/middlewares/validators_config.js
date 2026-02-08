const {createSkillSchema, updateSkillSchema} = require("../middlewares/validators/skill.schema")
const {createExperienceSchema, updateExperienceSchema} = require("../middlewares/validators/experience.schema")
const {createEducationSchema, updateEducationSchema} = require("../middlewares/validators/education.schema")
const {createCompanySchema, updateCompanySchema} = require("../middlewares/validators/company.schema")
const {createCompanyMemberSchema, updateCompanyMemberSchema} = require("../middlewares/validators/company_member.schema")
const {createJobPostSchema, updateJobPostSchema} = require("../middlewares/validators/job_post.schema")
const {createJobApplicantsSchema, updateJobApplicantSchema} = require("../middlewares/validators/job_applicant.schema")
const { updateNotificationSchema } = require("../middlewares/validators/notification.schema")
const {createUserSchema, updateUserSchema} = require("../middlewares/validators/user.schema")
const {createLanguageSchema, updateLanguageSchema} = require("../middlewares/validators/language.schema")
const {createLinkSchema, updateLinkSchema} = require("../middlewares/validators/link.schema")
const {validateSignIn, validateUpdate} = require("../middlewares/validators/image.schema")


module.exports =  {
    createSkillSchema,
    updateSkillSchema,

    createExperienceSchema,
    updateExperienceSchema,

    createEducationSchema,
    updateEducationSchema,

    createCompanySchema,
    updateCompanySchema,

    createCompanyMemberSchema,
    updateCompanyMemberSchema,

    createJobPostSchema,
    updateJobPostSchema,

    createJobApplicantsSchema,
    updateJobApplicantSchema,

    updateNotificationSchema,

    createUserSchema,
    updateUserSchema,

    createLanguageSchema,
    updateLanguageSchema,
    
    createLinkSchema,
    updateLinkSchema,

    validateSignIn,
    validateUpdate 
}