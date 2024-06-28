import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const imgRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            image,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setName("");
      setDescription("");
      setImage(null);
      setIsChecked(false);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ name, description, image });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser.profileImage || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col w-full gap-2" onSubmit={handleSubmit}>
        <div className="border-b border-gray-700">
          <textarea
            className="w-full p-0 text-lg border-none resize-none textarea focus:outline-none"
            placeholder="Name your art"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="border-b border-gray-700">
          <textarea
            className="w-full p-0 text-lg border-none resize-none textarea focus:outline-none"
            placeholder="Describe your art"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {image && (
          <div className="relative mx-auto w-72">
            <IoCloseSharp
              className="absolute top-0 right-0 w-5 h-5 text-white bg-gray-800 rounded-full cursor-pointer"
              onClick={() => {
                setImage(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={image}
              className="object-contain w-full mx-auto rounded h-72"
            />
          </div>
        )}

        <div className="flex justify-between py-2">
          <div className="flex items-center gap-1">
            <CiImageOn
              className="w-6 h-6 cursor-pointer fill-primary"
              onClick={() => imgRef.current.click()}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <div className="flex gap-1">
            <label htmlFor="isPostPrivate" className="flex items-center px-2 ">
              <input
                type="checkbox"
                className="mr-2"
                id="isPostPrivate"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              I agree with the terms and conditions.
            </label>
            <button
              className="px-4 text-white rounded-full btn btn-primary btn-sm"
              disabled={!isChecked}
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CreatePost;
