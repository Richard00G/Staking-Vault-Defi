export default function Card({ children }) {
    return (
        <div className="
        bg-gradient-to-br from-gray-900 to-black
        border border-gray-800
        rounded-2x1 p-6
        backdrop-blur-x1">
            {children}
        </div>
    );
}