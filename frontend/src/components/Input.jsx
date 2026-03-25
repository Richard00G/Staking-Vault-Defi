export default function Input({value, onChange, placeholder }) {
    return(
        <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="number"
        className="
        w-full p-3 rounded-lg
        bg-gray-800 text-white
        border border-gray-700
        focus: outline-none
        focus:border-green-500"/>
    );
}