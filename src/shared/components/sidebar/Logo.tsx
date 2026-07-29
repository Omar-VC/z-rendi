export default function Logo() {

  return (

    <div className="
      mb-10
    ">


      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <img
          src="/logo.jpeg"
          alt="Z-Rendi"
          className="
            w-14
            h-14
            object-cover
            rounded-xl
            border
            border-white/10
          "
        />


        <div>

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            Z-Rendi
          </h2>


          <p
            className="
              text-sm
              text-white/60
            "
          >
            Preparación física
          </p>


        </div>


      </div>


    </div>

  );
}