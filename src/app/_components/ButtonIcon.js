import Link from "next/link";

export default function ButtonIcon({ icon, isActive = false, href='#', onClick }) {
    return (
        <Link onClick={onClick} className="flex justify-center self-center h-full w-full relative" href={ isActive ? '#' : href }>
            {icon}
            {isActive && (
                <div className="absolute block text-primary bottom-[-48%] justify-center rounded-full">
                    •
                </div>
            )}
        </Link>
    );
}