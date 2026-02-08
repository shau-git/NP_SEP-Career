import { Link as LinkIcon,  Mail as Email } from 'lucide-react';
import {MoreMenu} from "./utils_config"//"@/components/user/utils/utils_config"

const AnchorTag = ({token, linkTypes, url, linkType, onEdit = () => {}, onDelete = () => {}, status}) => {
    // Link types from your schema
    const {session , user_id} = status

    // // Get icon for link type
    const getLinkIcon = (type) => {
        const linkType = linkTypes.find(lt => lt.value === type);
        return linkType ? linkType.icon : <LinkIcon className="w-5 h-5" />;
    };

    // Get display name for URL
    const getDisplayUrl = (url) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    return (
        <div
            className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
        >
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 text-white">
                {getLinkIcon(linkType)}
            </div>
            {/* Link Data */}
            <div className="flex-1 min-w-0">
                <div className="text-white/50 text-xs">{linkType}</div>
                <a
                    href={linkType==="Email"?`mailto:${url}`:url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 transition-colors truncate block font-medium"
                >
                {getDisplayUrl(url)}
                </a>
            </div>

            {/* More Menu */}
            {
                (token && session?.user_id == user_id) &&
                (linkType !== "Email" && 
                <MoreMenu
                    onEdit={onEdit}
                    onDelete={onDelete}
                />)
            }
        </div>
    )
}

export default AnchorTag