import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axiosinstance";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skinType, setSkinType] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const params = useParams();

  useEffect(() => {
    if (params.id) {
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

  const labelStyles =
    "block mb-2 text-[#A55166] text-[10px] font-bold tracking-[0.2em] uppercase ml-1";
  const inputStyles =
    "w-full p-4 border border-[#F2E8E4] rounded-2xl text-[#3D3436] bg-[#FCFAFA] focus:outline-none focus:border-[#A55166]/50 transition-all duration-300 placeholder:text-gray-300 shadow-sm";

  return (
    <div className="min-h-screen bg-[#FCFAFA] flex flex-col items-center justify-center px-6 py-20 font-inter relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FAD1E3]/30 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-light text-[#3D3436] mb-4"
            style={{ fontFamily: "'Julius Sans One', sans-serif" }}
          >
            {params.id ? "Refine Your" : "Create Your"}{" "}
            <span className="text-[#A55166] italic font-bold">Masterpiece</span>
          </h1>
          <p className="text-[#7A6B6E] font-light tracking-wide">
            Share your beauty secrets and skin insights with the MakeupMuse
            community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-12 rounded-[40px] shadow-[0_20px_40px_rgba(165,81,102,0.05)] border border-[#F2E8E4]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title */}
            <div className="md:col-span-2">
              <label className={labelStyles}>Post Title</label>
              <input
                type="text"
                placeholder="Enter a captivating title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputStyles}
                required
              />
            </div>

            {/* Skin Type Selection */}
            <div className="md:col-span-1">
              <label className={labelStyles}>Skin Type Focus</label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                className={`${inputStyles} cursor-pointer appearance-none`}
                required
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

            {/* Image URL */}
            <div className="md:col-span-1">
              <label className={labelStyles}>Visual Link (Image URL)</label>
              <input
                type="text"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={inputStyles}
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className={labelStyles}>The Narrative (Description)</label>
              <textarea
                placeholder="Tell your story or share your routine..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputStyles} h-32 resize-none`}
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full bg-[#3D3436] text-white py-5 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#A55166] transition-all shadow-xl mt-10"
          >
            {params.id ? "Update Post" : "Publish to Community"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePostPage;
