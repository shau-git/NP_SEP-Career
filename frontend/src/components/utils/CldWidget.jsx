import backend_domain from "../../utils/fetch_data/backend_domain"; //
import {Camera} from "lucide-react"
import {toast} from "react-toastify"
const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET  // env var must start with VITE_
const api_key = import.meta.env.VITE_CLOUDINARY_API_KEY;

const CldWidget = ({ setUser, token }) => {
    
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
                    const response = await fetch(`${backend_domain}/api/image/uploadimage`, {
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
                        setUser(prev => ({ ...prev, image: data.data.image }));
                    } else {
                        toast.error("Image Upload failed! " + data.message)
                    }
                } else if (error){
                    toast.error("Image upload failed")
                }
            }
        );
        widget.open();
    };

    return (
        // ... rest of your profile UI
        <button onClick={showWidget} className="cursor-pointer absolute bottom-2 right-1 w-11 h-11 bg-linear-to-r from-[rgb(102,126,234)] to-[rgb(118,75,162)] rounded-full flex items-center justify-center border-3 border-slate-900 hover:scale-110 transition-transform hover:shadow-[0_5px_15px_rgba(102,126,234,0.5)]">
            <Camera className="w-4.5 h-4.5 text-white" />
        </button>
    );
};

export default CldWidget