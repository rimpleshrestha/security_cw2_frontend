import React from "react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axiosinstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaListUl } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { BiHeart } from "react-icons/bi";
import toast from "react-hot-toast";

const ProductPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();

  const token = jwtDecode(sessionStorage.getItem("access-token"));
  const loggedInUserId = token?.id || sessionStorage.getItem("userId");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    (async () => {
      const skinType = searchParams.get("skinType");
      let url = `/post/`;
      if (skinType && skinType !== "all") {
        url += `?type=${encodeURIComponent(skinType)}`;
      }
      const response = await axiosInstance.get(url);
      if ([200, 201].includes(response.status)) {
        setProductData(response?.data?.posts);
      }
    })();
  }, [searchParams.get("skinType")]);

  const openModal = async (product) => {
    setSelectedProduct(product);
    setNewComment("");
    setEditingCommentId(null);
    setEditingText("");

    try {
      const response = await axiosInstance.get(
        `/comments/post/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          },
        }
      );

      if (response.status === 200) {
        setComments(
          response.data.map((c) => {
            const userIdStr = c.user?._id?.toString();
            const isOwner = userIdStr === loggedInUserId;

            return {
              id: c._id,
              author: isOwner ? "You" : c.user?.name || "Unknown",
              userId: userIdStr,
              text: c.comment,
            };
          })
        );
      }
    } catch (error) {
      console.error("Error fetching comments for product:", error);
      setComments([]);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setEditingCommentId(null);
    setEditingText("");
    setComments([]);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(
        `/comments/${selectedProduct._id}`,
        { comment: newComment.trim() },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          },
        }
      );

      if (response.status === 201) {
        const savedComment = response.data;
        setComments((prev) => [
          ...prev,
          {
            id: savedComment._id,
            author: "You",
            userId: loggedInUserId,
            text: savedComment.comment,
          },
        ]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (id) => {
    try {
      const response = await axiosInstance.delete(`/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      });

      if (response.status === 200) {
        setComments((prev) => prev.filter((comment) => comment.id !== id));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const startEditing = (id, currentText) => {
    setEditingCommentId(id);
    setEditingText(currentText);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const saveEditing = async (id) => {
    if (!editingText.trim()) return;

    try {
      const response = await axiosInstance.put(
        `/comments/${id}`,
        { comment: editingText.trim() },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          },
        }
      );

      if (response.status === 200) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === id
              ? { ...comment, text: editingText.trim() }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditingText("");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleSaveProduct = async (isSaved, id = selectedProduct?._id) => {
    try {
      let response;
      if (isSaved) {
        response = await axiosInstance.delete(`/post/unsave/${id}`);
        if (response.status === 200) {
          setSelectedProduct((prev) =>
            prev && prev._id === id ? { ...prev, isSaved: false } : prev
          );
          setProductData((prev) =>
            prev.map((p) => (p._id === id ? { ...p, isSaved: false } : p))
          );
          toast.success("Product unsaved!");
        }
      } else {
        response = await axiosInstance.post(`/post/save/${id}`);
        if (response.status === 200) {
          setSelectedProduct((prev) =>
            prev && prev._id === id ? { ...prev, isSaved: true } : prev
          );
          setProductData((prev) =>
            prev.map((p) => (p._id === id ? { ...p, isSaved: true } : p))
          );
          toast.success("Product saved!");
        }
      }
    } catch (error) {
      console.error("Error saving/unsaving product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      if (sessionStorage.getItem("role") !== "admin") {
        toast.error("Admin permission required.");
        return;
      }
      const response = await axiosInstance.delete(`/post/${id}`);
      if (response.status === 200) {
        setProductData((prev) => prev.filter((p) => p._id !== id));
        if (selectedProduct?._id === id) closeModal();
        toast.success("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  return (
    <div className="bg-[#FAF8F7] min-h-screen w-full flex flex-col items-center py-16 px-6">
      {/* Header & Filter */}
      <div className="max-w-7xl w-full text-center mb-16">
        <h1
          className="text-4xl md:text-5xl text-[#332B2D] font-light mb-6"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          Curated for{" "}
          <span className="relative inline-block">
            <select
              className="appearance-none bg-transparent border-b-2 border-[#A55166] pb-1 pr-8 text-[#A55166] font-bold cursor-pointer outline-none hover:text-[#914257] transition-colors uppercase tracking-widest text-3xl md:text-4xl"
              value={searchParams.get("skinType") || "all"}
              onChange={(e) => {
                const skinType = e.target.value;
                searchParams.set("skinType", skinType);
                setSearchParams(searchParams);
              }}
            >
              <option value="all">All Skins</option>
              <option value="oily">Oily</option>
              <option value="dry">Dry</option>
              <option value="combination">Combination</option>
              <option value="normal">Normal</option>
            </select>
            <div className="absolute right-0 bottom-3 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                stroke="#A55166"
                strokeWidth="2"
              >
                <path d="M1 1l5 5 5-5" />
              </svg>
            </div>
          </span>
        </h1>
        <p className="text-[#7A6B6E] tracking-[0.3em] uppercase text-[10px] font-bold">
          Discover your perfect match
        </p>
      </div>

      {/* Product Grid */}
      {productData.length > 0 ? (
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {productData.map((product, idx) => (
            <div
              key={idx}
              onClick={() => openModal(product)}
              className="group bg-white rounded-[32px] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-[#F2E8E4] cursor-pointer hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={product.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-[#332B2D] font-bold text-lg mb-2 uppercase tracking-tight">
                  {product.title || "Untitled"}
                </h3>
                <p className="text-[#7A6B6E] text-sm line-clamp-2 font-light leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-[40px] border border-dashed border-[#F2E8E4] flex flex-col items-center justify-center py-24 text-center">
          <span className="text-4xl mb-4 grayscale">💄</span>
          <p className="text-[#7A6B6E] font-light italic">
            No products currently listed for this skin type.
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-[#332B2D]/40 backdrop-blur-md"
            onClick={closeModal}
          />

          <div className="bg-white rounded-[40px] shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative z-10 animate-in fade-in zoom-in duration-300">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-[#332B2D] hover:rotate-90 transition-transform duration-300 z-20"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Left Image Section */}
            <div className="md:w-1/2 bg-[#FCFAFA] flex items-center justify-center p-8 border-r border-[#F2E8E4]">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={selectedProduct.image}
                  alt=""
                  className="rounded-2xl object-contain max-h-[50vh] md:max-h-[60vh] w-full drop-shadow-2xl"
                />
                <button
                  onClick={() => handleSaveProduct(selectedProduct.isSaved)}
                  className={`absolute top-0 left-0 p-5 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95 ${
                    selectedProduct.isSaved
                      ? "bg-red-500 text-white"
                      : "bg-white text-red-500"
                  }`}
                >
                  <BiHeart size={28} />
                </button>
              </div>
            </div>

            {/* Right Content Section */}
            <div className="md:w-1/2 flex flex-col h-full bg-white">
              <div className="p-8 md:p-12 overflow-y-auto flex-1">
                <div className="mb-10">
                  <h2
                    className="text-3xl text-[#332B2D] font-light mb-4"
                    style={{ fontFamily: "'Julius Sans One', sans-serif" }}
                  >
                    {selectedProduct.title}
                  </h2>
                  <p className="text-[#7A6B6E] text-sm leading-relaxed font-light mb-6">
                    {selectedProduct.description}
                  </p>

                  {sessionStorage.getItem("role") === "admin" && (
                    <div className="flex gap-4 border-t border-[#F2E8E4] pt-4">
                      <button
                        onClick={() =>
                          navigate(`/create-post/${selectedProduct._id}`)
                        }
                        className="text-[10px] uppercase font-bold tracking-widest text-[#A55166] hover:underline"
                      >
                        Edit Product
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(selectedProduct._id)}
                        className="text-[10px] uppercase font-bold tracking-widest text-red-400 hover:underline"
                      >
                        Delete Product
                      </button>
                    </div>
                  )}
                </div>

                {/* Comments */}
                <div className="border-t border-[#F2E8E4] pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[#332B2D] text-xs font-bold tracking-widest uppercase">
                      Discussion
                    </h4>
                    <button
                      onClick={() => navigate("/product-list")}
                      className="text-[#A55166] hover:scale-110 transition-transform"
                    >
                      <FaListUl size={18} />
                    </button>
                  </div>

                  <div className="space-y-4 mb-4">
                    {comments.length === 0 ? (
                      <p className="text-[#7A6B6E] text-sm italic font-light">
                        No thoughts shared yet.
                      </p>
                    ) : (
                      comments.map(({ id, author, userId, text }) => (
                        <div
                          key={id}
                          className={`group p-4 rounded-[20px] transition-all ${
                            author === "You"
                              ? "bg-[#FAF8F7]"
                              : "bg-white border border-[#F2E8E4]"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#A55166]">
                              {author}
                            </span>
                            {userId === loggedInUserId && (
                              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditing(id, text)}
                                  className="text-[10px] font-bold text-gray-400 hover:text-[#332B2D]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteComment(id)}
                                  className="text-[10px] font-bold text-gray-400 hover:text-red-500"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          {editingCommentId === id ? (
                            <div className="mt-2">
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full p-3 text-sm border border-[#F2E8E4] rounded-xl focus:outline-none focus:border-[#A55166]"
                                rows={2}
                              />
                              <div className="flex gap-3 mt-2 justify-end">
                                <button
                                  onClick={() => saveEditing(id)}
                                  className="text-[10px] font-bold text-[#A55166]"
                                >
                                  SAVE
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-[10px] font-bold text-gray-400"
                                >
                                  CANCEL
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[#332B2D] text-sm font-light leading-relaxed">
                              {text}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Comment Input */}
              <div className="p-6 border-t border-[#F2E8E4] bg-[#FCFAFA]">
                <div className="flex gap-3 items-center">
                  <textarea
                    rows={1}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="flex-1 bg-white border border-[#F2E8E4] rounded-[20px] py-3 px-5 text-sm focus:outline-none focus:border-[#A55166] transition-all"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-[#332B2D] text-white p-4 rounded-full hover:bg-[#A55166] transition-all active:scale-90 shadow-lg"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
