import React, { useEffect, useState } from "react";
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
  const [searchParams, setSearchParams] = useSearchParams();

  // ================== AUTHENTICATION HANDLING ==================
  const tokenStr = sessionStorage.getItem("access-token");
  let loggedInUserId = sessionStorage.getItem("userId");
  let userRole = sessionStorage.getItem("role");

  if (tokenStr) {
    try {
      const decoded = jwtDecode(tokenStr);
      loggedInUserId = decoded?.id || loggedInUserId;
    } catch (err) {
      console.error("Token invalid or expired");
    }
  }

  // ================== FETCH PRODUCTS (NO LEADING SLASHES) ==================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const skinType = searchParams.get("skinType");
        // FIXED: Using "post" instead of "/post/" to prevent 404
        let url = "post";

        if (skinType && skinType !== "all") {
          url += `?type=${encodeURIComponent(skinType)}`;
        }

        const response = await axiosInstance.get(url);
        if ([200, 201].includes(response.status)) {
          // Backend returns { posts: [...] }
          setProductData(response.data.posts || []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load products from server.");
      }
    };
    fetchProducts();
  }, [searchParams.get("skinType")]);

  // ================== COMMENT LOGIC ==================
  const openModal = async (product) => {
    setSelectedProduct(product);
    setNewComment("");
    setEditingCommentId(null);
    setEditingText("");

    try {
      // FIXED: Relative path "comments/post/..."
      const response = await axiosInstance.get(`comments/post/${product._id}`);
      if (response.status === 200) {
        setComments(
          response.data.map((c) => ({
            id: c._id,
            author:
              c.user?._id === loggedInUserId
                ? "You"
                : c.user?.name || "Unknown",
            userId: c.user?._id,
            text: c.comment,
          })),
        );
      }
    } catch (error) {
      setComments([]);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setComments([]);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!tokenStr) return toast.error("Please login to comment");

    try {
      const response = await axiosInstance.post(
        `comments/${selectedProduct._id}`,
        {
          comment: newComment.trim(),
        },
      );
      if (response.status === 201) {
        setComments((prev) => [
          ...prev,
          {
            id: response.data._id,
            author: "You",
            userId: loggedInUserId,
            text: response.data.comment,
          },
        ]);
        setNewComment("");
      }
    } catch (error) {
      toast.error("Could not post comment.");
    }
  };

  const deleteComment = async (id) => {
    try {
      await axiosInstance.delete(`comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const saveEditing = async (id) => {
    if (!editingText.trim()) return;
    try {
      await axiosInstance.put(`comments/${id}`, { comment: editingText });
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, text: editingText } : c)),
      );
      setEditingCommentId(null);
      toast.success("Comment updated");
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  // ================== PRODUCT ACTIONS (SAVE/DELETE) ==================
  const handleSaveProduct = async (isSaved, id = selectedProduct?._id) => {
    if (!tokenStr) return toast.error("Please login to save products");
    try {
      if (isSaved) {
        await axiosInstance.delete(`post/unsave/${id}`);
        toast.success("Product unsaved");
      } else {
        await axiosInstance.post(`post/save/${id}`);
        toast.success("Product saved!");
      }

      // Update local state for UI sync
      const updatedData = productData.map((p) =>
        p._id === id ? { ...p, isSaved: !isSaved } : p,
      );
      setProductData(updatedData);

      if (selectedProduct?._id === id) {
        setSelectedProduct({ ...selectedProduct, isSaved: !isSaved });
      }
    } catch (error) {
      toast.error("Action failed.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (userRole !== "admin") return toast.error("Admin access required.");
    try {
      await axiosInstance.delete(`post/${id}`);
      setProductData((prev) => prev.filter((p) => p._id !== id));
      closeModal();
      toast.success("Product removed permanently.");
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  // ================== RENDER UI ==================
  return (
    <div className="bg-[#FAF8F7] min-h-screen w-full flex flex-col items-center py-16 px-6">
      {/* Header Section */}
      <div className="max-w-7xl w-full text-center mb-16">
        <h1
          className="text-4xl md:text-5xl text-[#332B2D] font-light mb-6"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          Curated for{" "}
          <select
            className="bg-transparent border-b-2 border-[#A55166] text-[#A55166] font-bold outline-none uppercase text-3xl md:text-4xl cursor-pointer"
            value={searchParams.get("skinType") || "all"}
            onChange={(e) => setSearchParams({ skinType: e.target.value })}
          >
            <option value="all">All Skins</option>
            <option value="oily">Oily</option>
            <option value="dry">Dry</option>
            <option value="combination">Combination</option>
            <option value="normal">Normal</option>
          </select>
        </h1>
        <p className="text-[#7A6B6E] tracking-[0.3em] uppercase text-[10px] font-bold">
          Discover your perfect match
        </p>
      </div>

      {/* Product Grid */}
      {productData.length > 0 ? (
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {productData.map((product) => (
            <div
              key={product._id}
              onClick={() => openModal(product)}
              className="group bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#F2E8E4] cursor-pointer hover:-translate-y-2 transition-all p-4 duration-300"
            >
              <div className="relative h-64 overflow-hidden rounded-2xl mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="text-[#332B2D] font-bold text-lg text-center uppercase tracking-tight">
                {product.title}
              </h3>
              <p className="text-[#7A6B6E] text-sm text-center line-clamp-2 mt-2 font-light">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-[#7A6B6E] italic">
            No products available for this selection.
          </p>
        </div>
      )}

      {/* Modal View */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#332B2D]/40 backdrop-blur-md"
            onClick={closeModal}
          />

          <div className="bg-white rounded-[40px] shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative z-10 animate-in fade-in zoom-in duration-200">
            {/* Left: Image */}
            <div className="md:w-1/2 bg-[#FCFAFA] flex items-center justify-center p-8 relative border-r border-[#F2E8E4]">
              <img
                src={selectedProduct.image}
                alt=""
                className="max-h-[50vh] object-contain drop-shadow-xl"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveProduct(selectedProduct.isSaved);
                }}
                className={`absolute top-6 left-6 p-4 rounded-full transition-all hover:scale-110 ${selectedProduct.isSaved ? "bg-red-500 text-white" : "bg-white text-red-500 shadow-md"}`}
              >
                <BiHeart size={24} />
              </button>
            </div>

            {/* Right: Content & Comments */}
            <div className="md:w-1/2 flex flex-col p-8 md:p-12 overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-xl hover:rotate-90 transition-transform"
              >
                ✕
              </button>

              <h2
                className="text-3xl font-light mb-4 uppercase"
                style={{ fontFamily: "'Julius Sans One', sans-serif" }}
              >
                {selectedProduct.title}
              </h2>
              <p className="text-[#7A6B6E] text-sm leading-relaxed mb-6 font-light">
                {selectedProduct.description}
              </p>

              {userRole === "admin" && (
                <div className="flex gap-4 mb-6 border-b border-[#F2E8E4] pb-4">
                  <button
                    onClick={() =>
                      navigate(`/create-post/${selectedProduct._id}`)
                    }
                    className="text-[10px] font-bold tracking-widest text-[#A55166] hover:underline"
                  >
                    EDIT PRODUCT
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(selectedProduct._id)}
                    className="text-[10px] font-bold tracking-widest text-red-400 hover:underline"
                  >
                    DELETE PRODUCT
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#332B2D]">
                  Discussion
                </h4>
                <FaListUl
                  className="text-[#A55166] cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => navigate("/product-list")}
                />
              </div>

              {/* Comments Scroll Area */}
              <div className="space-y-4 flex-1 mb-6">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-[#FAF8F7] p-4 rounded-2xl relative group transition-all"
                    >
                      <p className="text-[10px] font-bold text-[#A55166] uppercase mb-1">
                        {c.author}
                      </p>
                      {editingCommentId === c.id ? (
                        <div className="mt-2">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:border-[#A55166]"
                          />
                          <div className="flex gap-2 mt-2 justify-end">
                            <button
                              onClick={() => saveEditing(c.id)}
                              className="text-[10px] font-bold text-[#A55166]"
                            >
                              SAVE
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="text-[10px] font-bold text-gray-400"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-[#332B2D] font-light">
                            {c.text}
                          </p>
                          {c.userId === loggedInUserId && (
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingCommentId(c.id);
                                  setEditingText(c.text);
                                }}
                                className="text-[10px] font-bold text-gray-400 hover:text-[#332B2D]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteComment(c.id)}
                                className="text-[10px] font-bold text-gray-400 hover:text-red-500"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#7A6B6E] italic font-light">
                    No comments yet. Be the first to share!
                  </p>
                )}
              </div>

              {/* New Comment Input */}
              <div className="flex gap-3 border-t border-[#F2E8E4] pt-6">
                <textarea
                  rows={1}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-[#FAF8F7] border border-[#F2E8E4] rounded-xl p-3 text-sm focus:outline-none focus:border-[#A55166] transition-all"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-[#332B2D] text-white px-5 rounded-xl hover:bg-[#A55166] transition-all active:scale-95"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
