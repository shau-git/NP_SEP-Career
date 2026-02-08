import backend_domain from "../../../utils/fetch_data/backend_domain"//"../../utils/fetch_data/backend_domain"; //
import {Camera} from "lucide-react"
import {toast} from "react-toastify"
import {motion} from "framer-motion"
const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET  // env var must start with VITE_
const api_key = import.meta.env.VITE_CLOUDINARY_API_KEY;

const CldWidget = ({ changeImage, token, tableName , company_id=null}) => { //setUser, token
    
    const showWidget = () => {
        // Initialize the widget
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: cloud_name,
                uploadPreset: preset,
                apiKey: api_key,
                // This replaces signatureEndpoint
                uploadSignature: async (callback, paramsToSign) => {
                    const res = await fetch(`${backend_domain}/api/image/sign-image`, {
                        method: "POST",
                        body: JSON.stringify({ paramsToSign }),
                        headers: { 
                            "Content-Type": "application/json" ,
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await res.json();
                    callback(data.signature);
                },
                folder: "profile_pics",
            },
            async (error, result) => {
                if (!error && result && result.event === "success") {

                    // Step 3: Save to your Express backend
                    let endpoint = `${backend_domain}/api/image/uploadimage`
                    if(tableName === "company") endpoint += `/company/${company_id}`

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json' ,
                            'Authorization': `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            newImageUrl: result.info.secure_url,
                            newPublicId: result.info.public_id
                        })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        toast.success(data.message)
                        // setUser(prev => ({ ...prev, image: data.data.image }));
                        changeImage(data.data.image)
                    } else {
                        toast.error(data.message)
                    }
                } else if (error){
                    toast.error("Image upload failed")
                }
            }
        );
        widget.open();
    };

    return (
        <motion.button 
            whileHover={{
                boxShadow: "0 5px 15px rgba(102,126,234,0.5)",
                scale: 1.1,
                transition: {duration: 0.3}
            }}
            onClick={showWidget} 
            className="cursor-pointer absolute bottom-2 right-1 w-11 h-11 bg-linear-to-r from-[rgb(102,126,234)] to-[rgb(118,75,162)] rounded-full flex items-center justify-center border-3 border-slate-900"
        >
            <Camera className="w-4.5 h-4.5 text-white" />
        </motion.button>
    );
};

export default CldWidget