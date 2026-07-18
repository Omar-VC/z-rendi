import BibliotecaLibros from "../components/BibliotecaLibros";
import { useAuth } from "../../../../auth/useAuth";

export default function BibliotecaPageV2() {

  const { user, usuario } = useAuth();

  if (!user || !usuario) {
    return null;
  }


  return (
    <div className="p-6">

      <BibliotecaLibros
        preparadorId={user.uid}
      />

    </div>
  );
}