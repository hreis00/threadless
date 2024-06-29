import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { formatDate } from "../../utils/date";

const ExhibitionPage = () => {
  const { slug } = useParams();

  const { data: exhibition } = useQuery({
    queryKey: ["exhibition"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/exhibitions/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const formattedExhibitionDate = formatDate(exhibition?.createdAt);

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {exhibition && (
        <div className="flex items-start gap-2 p-4 border-b border-gray-700">
          <div className="flex flex-col flex-1">
            <div className="flex flex-col items-start gap-2 p-4 border-gray-700">
              <div className="flex items-center gap-2">
                <span className="font-bold">{exhibition?.name}</span>
                <span className="flex gap-1 text-sm text-gray-700">
                  <span>·</span>
                  <span>{formattedExhibitionDate}</span>
                </span>
              </div>
              <span className="text-sm">{exhibition?.description}</span>
              <div className="w-fit">
                <button
                  onClick={() =>
                    document.getElementById("image-selected").showModal()
                  }
                >
                  <img
                    src={exhibition.image}
                    className="object-contain border border-gray-700 rounded-lg cursor-pointer h-80"
                    alt=""
                  />
                </button>
                <dialog id="image-selected" className="p-4 modal">
                  <div className="w-fit p-0 modal-box max-w-[1200px]">
                    <form method="dialog">
                      <button className="absolute top-1 right-1 btn btn-sm btn-circle hover:btn-error">
                        ✕
                      </button>
                    </form>
                    <img src={exhibition.image} alt="" className="rounded " />
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button className="outline-none">Close</button>
                  </form>
                </dialog>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitionPage;
