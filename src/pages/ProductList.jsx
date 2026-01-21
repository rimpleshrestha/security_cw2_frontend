import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axiosinstance";
import toast from "react-hot-toast";
import { BiHeart } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaListUl } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
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
          toast.success("Product removed from Muse list");
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
          toast.success("Added to Muse list");
        }
      }
    } catch (error) {
      console.error("Error saving/unsaving product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      if (sessionStorage.getItem("role") !== "admin") {
        toast.error("Admin access required.");
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

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axiosInstance.post("/post/saved");
      const data = await response.data;
      setProducts(data.savedPosts || []);
    };
    fetchProducts();
  }, []);

  const inputStyles =
    "w-full p-3 border border-[#F2E8E4] rounded-xl text-black bg-[#FCFAFA] focus:outline-none focus:border-[#A55166] transition-all text-sm";

  return (
    <div className="bg-[#FAF8F7] min-h-screen py-16 px-6 md:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1
          className="text-4xl md:text-5xl text-[#332B2D] font-light mb-4"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          The <span className="italic font-bold text-[#A55166]">Muse</span>{" "}
          Collection
        </h1>
        <p className="text-[#7A6B6E] tracking-[0.2em] uppercase text-xs font-bold">
          Your Saved Essentials
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-[#F2E8E4]">
            <p className="text-[#7A6B6E] italic font-light">
              Your collection is currently empty.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, idx) => (
              <div
                key={idx}
                onClick={() => openModal(product)}
                className="group bg-white rounded-[32px] overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-[#F2E8E4] cursor-pointer hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveProduct(true, product._id);
                      }}
                      className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <BiHeart size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-[#332B2D] font-bold text-lg mb-2 truncate">
                    {product.title || "Untitled Product"}
                  </h3>
                  <p className="text-[#7A6B6E] text-sm line-clamp-2 font-light leading-relaxed">
                    {product.description || "No description available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
          <div
            className="absolute inset-0 bg-[#332B2D]/60 backdrop-blur-sm"
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

            {/* Left: Product Image */}
            <div className="md:w-1/2 bg-[#FCFAFA] flex items-center justify-center p-8 border-r border-[#F2E8E4]">
              <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                <img
                  src={selectedProduct.image}
                  alt=""
                  className="rounded-2xl object-contain max-h-[60vh] w-full shadow-lg"
                />

                <button
                  onClick={() => handleSaveProduct(selectedProduct.isSaved)}
                  className={`absolute top-0 left-0 p-4 rounded-full shadow-xl transition-all ${
                    selectedProduct.isSaved
                      ? "bg-red-500 text-white"
                      : "bg-white text-red-500"
                  }`}
                >
                  <BiHeart size={28} />
                </button>
              </div>
            </div>

            {/* Right: Info & Comments */}
            <div className="md:w-1/2 flex flex-col h-full bg-white">
              <div className="p-8 md:p-12 overflow-y-auto flex-1">
                <div className="mb-10">
                  <h2
                    className="text-3xl text-[#332B2D] font-light mb-4"
                    style={{ fontFamily: "'Julius Sans One', sans-serif" }}
                  >
                    {selectedProduct.title}
                  </h2>
                  <p className="text-[#7A6B6E] text-sm leading-relaxed font-light">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="border-t border-[#F2E8E4] pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[#332B2D] text-xs font-bold tracking-widest uppercase">
                      Discussion ({comments.length})
                    </h4>
                  </div>

                  <div className="space-y-4 mb-8">
                    {comments.length === 0 ? (
                      <p className="text-[#7A6B6E] text-sm italic">
                        Be the first to leave a comment...
                      </p>
                    ) : (
                      comments.map(({ id, author, userId, text }) => (
                        <div
                          key={id}
                          className={`group p-4 rounded-2xl transition-colors ${
                            author === "You"
                              ? "bg-[#FAF8F7]"
                              : "bg-white border border-[#F2E8E4]"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#A55166]">
                              {author}
                            </span>
                            {userId === loggedInUserId && (
                              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditing(id, text)}
                                  className="text-[10px] uppercase font-bold text-gray-400 hover:text-[#332B2D]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteComment(id)}
                                  className="text-[10px] uppercase font-bold text-gray-400 hover:text-red-500"
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
                                className={inputStyles}
                                rows={2}
                              />
                              <div className="flex gap-2 mt-2 justify-end">
                                <button
                                  onClick={() => saveEditing(id)}
                                  className="text-[10px] font-bold text-[#A55166] uppercase"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-[10px] font-bold text-gray-400 uppercase"
                                >
                                  Cancel
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

              {/* Sticky Comment Input */}
              <div className="p-6 border-t border-[#F2E8E4] bg-[#FCFAFA]">
                <div className="flex gap-3 items-center">
                  <textarea
                    rows={1}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className={`${inputStyles} resize-none py-4 px-6 rounded-[20px]`}
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-[#332B2D] text-white p-4 rounded-full hover:bg-[#A55166] transition-colors shadow-lg active:scale-90"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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

export default ProductList;
