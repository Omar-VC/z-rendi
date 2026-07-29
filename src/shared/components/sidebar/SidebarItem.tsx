import { useLocation, useNavigate } from "react-router-dom";


interface Props {
  label: string;
  icon?: string;
  path: string;
  onNavigate?: () => void;
}


export default function SidebarItem({
  label,
  icon,
  path,
  onNavigate,
}: Props) {

  const location = useLocation();
  const navigate = useNavigate();


  const activo =
    location.pathname === path;



  function handleClick() {
    navigate(path);
    onNavigate?.();
  }



  return (

    <button
      onClick={handleClick}
      className={`
        w-full

        flex
        items-center
        gap-3

        px-4
        py-3

        rounded-xl

        transition-all
        duration-200


        ${
          activo
            ? `
              bg-white/15
              text-white
              border
              border-white/10
            `
            : `
              text-white/70
              hover:bg-white/10
              hover:text-white
            `
        }

      `}
    >


      <span className="text-lg">
        {icon}
      </span>


      <span className="font-medium">
        {label}
      </span>


    </button>

  );
}