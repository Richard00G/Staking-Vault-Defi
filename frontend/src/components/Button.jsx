export default function Button( {children, onClick, color = "green"}) {

    const colors = {
        green: "bg-green-500 hover:bg-green-600",
        blue: "bg-blue-500 hover: bg-blue-600",
        red: "bg-red-500 hover: bg-red-600",
    };

    return (
        <button
          onClick={onClick}
          className={`${colors[color]} p-3 rounded-lg font-semibold transition w-full`}>
         
        {children}
       </button>    
   );

}