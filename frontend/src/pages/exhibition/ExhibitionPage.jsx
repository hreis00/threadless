import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Exhibition from "../../components/common/Exhibition";

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

  return (
    <div className="w-full">
      {exhibition && <Exhibition exhibition={exhibition} />}
    </div>
  );
};

export default ExhibitionPage;
