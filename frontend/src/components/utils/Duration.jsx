import { formatEmploymentType } from "../../utils/formatting"//'@/util/formating'

const Duration = ({design, duration}) => {
    return (
        <div className="flex gap-2 mb-1">
            <span className={`px-2.5 py-0.5 border ${design} rounded-full text-[12px] text-purple-200 capitalize`}>
                {formatEmploymentType(duration)}
            </span>
        </div>
    )
}

export default Duration
