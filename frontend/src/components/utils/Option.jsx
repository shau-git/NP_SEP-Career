const Option = ({value}) => {

    let capitalized = value.charAt(0).toUpperCase() + value.slice(1);
    if (value === "github") {
        capitalized = "GitHub";
    } else if (value === "linkedin") {
        capitalized = "LinkedIn";
    } else if (value === "full time") {
        capitalized = "Full Time"
    } else if (value === "part time") {
        capitalized = "Part Time"
    } else if (value[0] === "0" || parseInt(value[0])) {
        capitalized = value + " years"
    }

    return (
        <option value={`${value}`} className="text-white bg-purple-400">{capitalized}</option>
    )
}

export default Option