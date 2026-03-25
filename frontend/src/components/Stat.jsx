export default function Stat({ label, value }) {
    return (
        <div className="bg-gray-800 p-4 rounded-x1 text-center">
            
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-x1 font-bold text-green-400">{value}</p>

        </div>
    );
}