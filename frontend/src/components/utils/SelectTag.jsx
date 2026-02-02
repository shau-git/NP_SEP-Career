import {Option} from "./utils_config"//"@/components/user/utils/utils_config"

const SelectTag = ({
    field,
    name,
    value,
    handleChangeFunc,
    options
}) => {
    return (
        <div>
            <label className="block text-white/80 font-medium mb-2 text-sm">
                {field}
            </label>
            <select
                name={name}
                value={value}
                onChange={handleChangeFunc}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            >
                {/* <Option value="full time"/>
                <Option value="part time"/> */}
                {/* Map through the passed options */}
                {options.map((opt) => (
                    <Option key={opt} value={opt} />
                ))}
            </select>
        </div>
    )
}

export default SelectTag