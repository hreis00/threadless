import { useQuery } from "@tanstack/react-query";

import Users from "../../../components/common/Users";

const People = ({ feedType }) => {
  const { data: people } = useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      return data;
    },
  });

  return (
    <>
      {people && feedType === "people" && (
        <div className="">
          <Users />
        </div>
      )}
    </>
  );
};

export default People;
