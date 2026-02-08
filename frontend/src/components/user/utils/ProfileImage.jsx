import {CldWidget} from "./utils_config"
import  {Building2} from "lucide-react"

const fallback = (tableName, data) => {
    if(tableName === "user") {
        return <div>{data.name.split(' ').map(n => n[0]).join('')}</div>
    } else {
        return (<div className=" rounded-xl flex items-center justify-center text-purple-950"
        >
            <Building2 size={50}/>
        </div>)
    }
}

const ProfileImage = ({show, changeImage, data, tableName, token}) => {
    return (
        <div className="relative">
            <div className="relative overflow-hidden w-36 h-36 rounded-full bg-linear-to-r from-[rgb(102,126,234)] to-[rgb(118,75,162)] flex items-center justify-center text-4xl font-bold text-white border-4 border-[rgba(102,126,234,0.5)]">
                {data.image ? (
                    <img src={data.image} alt={data.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        fallback(tableName, data)
                )}
            </div>

            {/* The camera button to upload image */}
            { show && <CldWidget {...{changeImage, token, tableName}} company_id={tableName==="company" && data.company_id}/>}
        </div>
    )
}

export default ProfileImage
