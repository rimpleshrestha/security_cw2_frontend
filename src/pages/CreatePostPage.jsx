import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axiosinstance";
import toast from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skinType, setSkinType] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const params = useParams();
  console.log(params);
  useEffect(() => {
    if (params.id) {
      console.log(params.id);
      axiosInstance
        .get(`/post/${params.id}`)
        .then((response) => {
          if (response.status === 200) {
            setTitle(response.data.post.title);
            setDescription(response.data.post.description);
            setSkinType(response.data.post.skin_type);
            setImageUrl(response.data.post.image);
          }
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
        });
    }
  }, [params.id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (params.id) {
      const response = await axiosInstance.put(`/post/${params.id}`, {
        title,
        description,
        skin_type: skinType,
        image: imageUrl,
      });
      if (response.status === 404) {
        toast.error("Post not found! or not authorized.");
      }
      if (response.status === 200) {
        toast.success("Post updated successfully!");
        setTitle("");
        setDescription("");
        setSkinType("");
        setImageUrl("");
      } else {
        toast.error("Post update failed!");
      }
      return;
    }
    const response = await axiosInstance.post("/post", {
      title,
      description,
      skin_type: skinType,
      image: imageUrl,
    });
    if (response.status === 201) {
      toast.success("Post created successfully!");
      setTitle("");
      setDescription("");
      setSkinType("");
      setImageUrl("");
    } else {
      toast.error("Post creation failed!");
    }
  };

  return (
    <div className="bg-gradient-to-b h-full min-h-screen w-full from-[#fad1e3] to-[#ff65aa]/10 flex flex-col items-center justify-center font-kaisei">
      <h1
        className="mb-8 text-3xl font-bold text-[#A55166]"
        style={{ fontFamily: "'Julius Sans One', sans-serif" }}
      >
        Create Post for SkinMusers
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-[600px] p-8 rounded-2xl shadow-lg bg-opacity-25 backdrop-blur-md border bg-[#A55166]"
      >
        <div className="mb-4">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Post Title:
          </label>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 shadow-md rounded-xl bg-white focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Description:
          </label>
          <textarea
            placeholder="Write a short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 shadow-md rounded-xl bg-white focus:outline-none h-24 resize-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Skin Type:
          </label>
          <select
            value={skinType}
            onChange={(e) => setSkinType(e.target.value)}
            className="w-full p-3 shadow-md rounded-xl bg-white focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              Select skin type
            </option>
            <option value="Oily">Oily</option>
            <option value="Dry">Dry</option>
            <option value="Combination">Combination</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Image URL:
          </label>
          <input
            type="text"
            placeholder="Paste image URL here"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 shadow-md rounded-xl bg-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#A55166] text-white py-3 rounded-xl font-bold font-inter hover:bg-[#914257] transition"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
