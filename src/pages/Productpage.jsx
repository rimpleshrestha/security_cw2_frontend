// ...imports
import React from "react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axiosinstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaListUl } from "react-icons/fa"; // added for the list icon
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
        // Unsave the product
        response = await axiosInstance.delete(`/post/unsave/${id}`);
        if (response.status === 200) {
          setSelectedProduct((prev) =>
            prev && prev._id === id ? { ...prev, isSaved: false } : prev
          );
          setProductData((prev) =>
            prev.map((p) => (p._id === id ? { ...p, isSaved: false } : p))
          );
          toast.success("Product unsaved successfully!");
        }
      } else {
        // Save the product
        response = await axiosInstance.post(`/post/save/${id}`);
        if (response.status === 200) {
          setSelectedProduct((prev) =>
            prev && prev._id === id ? { ...prev, isSaved: true } : prev
          );
          setProductData((prev) =>
            prev.map((p) => (p._id === id ? { ...p, isSaved: true } : p))
          );
          toast.success("Product saved successfully!");
        }
      }
    } catch (error) {
      console.error("Error saving/unsaving product:", error);
    }
  };
  const handleDeleteProduct = async (id) => {
    try {
      if (sessionStorage.getItem("role") !== "admin") {
        toast.error("You do not have permission to delete this product.");
        return;
      }
      const response = await axiosInstance.delete(`/post/${id}`);
      if (response.status === 200) {
        setProductData((prev) => prev.filter((p) => p._id !== id));
        if (selectedProduct?._id === id) {
          closeModal();
        }
        toast.success("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };
  return (
    <div className="bg-gradient-to-b min-h-screen w-full from-[#fad1e3] to-[#ff65aa]/10 flex flex-col items-center font-kaisei py-10">
      <h1
        className="text-4xl font-bold text-[#A55166] mb-10"
        style={{ fontFamily: "'Julius Sans One', sans-serif" }}
      >
        Products for{" "}
        <select
          className="ml-2 border-none outline-none bg-transparent w-fit text-[#A55166] font-bold rounded-lg p-2"
          onChange={(e) => {
            const skinType = e.target.value;
            // Handle skin type change logic here
            searchParams.set("skinType", skinType);
            setSearchParams(searchParams);
          }}
        >
          <option value="all">All</option>
          <option value="oily">Oily</option>
          <option value="dry">Dry</option>
          <option value="combination">Combination</option>
          <option value="combination">normal</option>
        </select>
      </h1>

      {productData.length > 0 ? (
        <div className="w-[90%] max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productData.map((product, idx) => (
            <div
              key={idx}
              onClick={() => openModal(product)}
              className="bg-white rounded-2xl relative shadow-lg p-4 flex flex-col cursor-pointer hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt=""
                className="rounded-xl object-cover w-full h-44 mb-4"
              />
              <div
                className={`min-h-[2rem] mb-2 text-center font-inter font-semibold text-lg ${
                  product.title ? "text-[#A55166]" : "text-gray-400"
                }`}
              >
                {product.title || "Title"}
              </div>
              <div
                className={`min-h-[3rem] line-clamp-3 text-center font-inter text-sm ${
                  product.description ? "text-[#A55166]/80" : "text-gray-400"
                }`}
              >
                {product.description || "Description"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-20">
          <p className="text-2xl text-gray-400 font-semibold mb-2">
            No products found.
          </p>
          <span className="text-5xl">🛒</span>
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeModal}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-auto">
            <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto flex flex-col md:flex-row  relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold z-10"
                aria-label="Close modal"
              >
                &times;
              </button>

              {/* Image Section (List icon removed from here) */}
              <div className="md:w-1/2 relative w-full flex items-center justify-center bg-[#fad1e3] p-4">
                <img
                  src={selectedProduct.image}
                  alt=""
                  className="rounded-xl object-contain max-h-[80vh] w-full"
                />
                {selectedProduct.isSaved ? (
                  <span
                    onClick={() => {
                      handleSaveProduct(true);
                    }}
                    className="p-4 rounded-full bg-red-500 absolute top-10 left-10"
                  >
                    <BiHeart size={30} fill="white" />
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      handleSaveProduct(false);
                    }}
                    className="p-4 rounded-full bg-white absolute top-10 left-10"
                  >
                    <BiHeart size={30} fill="red" />
                  </span>
                )}
                {sessionStorage.getItem("role") === "admin" && (
                  <div className="absolute bottom-10 left-10 flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/create-post/${selectedProduct._id}`)
                      }
                      className="text-sm text-[#A55166] hover:text-[#914257] font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(selectedProduct._id)}
                      className="text-sm text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Comments Section with List Icon */}

              <div className="md:w-1/2 w-full flex flex-col p-6">
                {selectedProduct?.description && (
                  <>
                    {" "}
                    <h2
                      className="text-2xl font-semibold text-[#A55166]"
                      style={{ fontFamily: "'Julius Sans One', sans-serif" }}
                    >
                      Description
                    </h2>
                    <p>{selectedProduct?.description}</p>
                  </>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="text-2xl font-semibold text-[#A55166]"
                    style={{ fontFamily: "'Julius Sans One', sans-serif" }}
                  >
                    Comments
                  </h2>
                  <button
                    onClick={() => navigate("/product-list")}
                    className="text-[#A55166] hover:text-[#914257]"
                    title="View My Product List"
                  >
                    <FaListUl className="text-2xl" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto mb-4 space-y-3 border border-gray-300 rounded-md p-4">
                  {comments.length === 0 && (
                    <p className="text-gray-500 italic">No comments yet.</p>
                  )}
                  {comments.map(({ id, author, userId, text }) => (
                    <div
                      key={id}
                      className={`p-2 rounded relative ${
                        author === "You"
                          ? "bg-[#ff65aa]/20 self-end"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className="text-sm font-semibold text-[#A55166]">
                        {author}
                      </p>

                      {editingCommentId === id ? (
                        <>
                          <textarea
                            rows={2}
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-1 resize-none focus:outline-none focus:ring-2 focus:ring-[#A55166]"
                          />
                          <div className="mt-1 flex gap-2 justify-end">
                            <button
                              onClick={() => saveEditing(id)}
                              className="bg-[#A55166] text-white px-3 py-1 rounded font-semibold hover:bg-[#914257] transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-300 text-gray-700 px-3 py-1 rounded font-semibold hover:bg-gray-400 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-700 break-words">{text}</p>
                          {userId === loggedInUserId && (
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                onClick={() => startEditing(id, text)}
                                className="text-sm text-[#A55166] hover:text-[#914257] font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteComment(id)}
                                className="text-sm text-red-500 hover:text-red-700 font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="flex-1 border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#A55166]"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-[#A55166] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#914257] transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
