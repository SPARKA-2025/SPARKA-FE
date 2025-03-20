import SearchIcon from "/public/assets/icon/search.svg"

export default function SearchBar({placeholder='cari...'}){
    return(
        <div className="flex h-[48px] text-xl w-[80%] bg-white border-gray-300 border-2 pl-4 pr-8 items-center gap-2 rounded-full">
            <SearchIcon className="h-full fill-current text-gray-400" />
            <input type="text" id="simple-search" className="text-gray-400 w-full bg-inherit" placeholder={placeholder}/>
        </div>
    )
}