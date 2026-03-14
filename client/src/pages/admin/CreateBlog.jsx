import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdDriveFolderUpload } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";
import coverImg from "../../assets/cover-img.png";
import { generateSlug } from "../../hooks/admin/generateSlug";
import Editor from "../../components/admin/Editor";
import api from "../../utils/api";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  content: Yup.string().required("Content is required"),
  category: Yup.string().required("Category is required"),
  tags: Yup.array().of(Yup.string()),
  image: Yup.string().required("Image is required"),
});

const CreateBlog = () => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      image: "",
      tags: [],
      category: "real-estate",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await api.post("/blogs", values);
        resetForm();
        setPreview(null);
        toast.success("Blog created successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to create blog.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);

      // Send to your backend endpoint
      const res = await api.post("/blogs/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      formik.setFieldValue("image", res.data.secure_url);
      setPreview(res.data.secure_url);
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  // Handle tags
  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault();
      formik.setFieldValue("tags", [
        ...formik.values.tags,
        e.target.value.trim(),
      ]);
      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    formik.setFieldValue(
      "tags",
      formik.values.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <form className="w-full h-full" onSubmit={formik.handleSubmit}>
      <div className="w-full p-4 bg-white dark:bg-gray-900 dark:text-white">
        <h2 className="text-xl font-bold mb-4">Create Blog Post</h2>
        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formik.values.title}
          onChange={(e) => {
            formik.handleChange(e);
            formik.setFieldValue("slug", generateSlug(e.target.value));
          }}
          className="w-full p-2 text-black dark:bg-gray-600 outline-none border rounded"
        />
        {formik.touched.title && formik.errors.title && (
          <div className="text-red-500">{formik.errors.title}</div>
        )}

        <label className="block mt-4 mb-2">Slug</label>
        <input
          type="text"
          name="slug"
          value={formik.values.slug}
          readOnly
          className="w-full p-2 border rounded text-black outline-none bg-gray-100 dark:bg-gray-500"
        />

        <label className="block mt-4 mb-2">Description</label>
        <textarea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          className="w-full p-2 text-black dark:bg-gray-600 outline-none border rounded"
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-500">{formik.errors.description}</div>
        )}

        <label className="block mt-4 mb-2">Content</label>
        <Editor
          value={formik.values.content}
          onChange={(val) => formik.setFieldValue("content", val)}
          className="mb-4"
        />
        {formik.touched.content && formik.errors.content && (
          <div className="text-red-500">{formik.errors.content}</div>
        )}

        <label className="block mt-4 mb-2">Cover Photo</label>
        <div
          className="border-2 border-dotted p-6 text-center cursor-pointer"
          onClick={() => document.getElementById("fileInput").click()}
        >
          {preview ? (
            <div className="flex flex-col items-center ">
              <div className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="lg:w-full lg:h-44 w-full h-36 object-cover rounded-md"
                />
                <LiaTimesSolid
                  size={20}
                  className="absolute bg-red-700 rounded-xl p-1 -right-2 -top-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    formik.setFieldValue("image", "");
                  }}
                />
              </div>
              <p className="text-green-600 mt-2">Uploaded</p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <img src={coverImg} className="w-[10%]" alt="" />
              <div className="flex gap-1 items-center">
                <MdDriveFolderUpload size={25} />
                Upload a file or drag and drop
              </div>
              <p className="text-gray-500 text-xs">PNG, JPG, JPEG up to 10MB</p>
            </div>
          )}
        </div>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleImageUpload}
          disabled={uploading}
        />
        {formik.touched.image && formik.errors.image && (
          <div className="text-red-500">{formik.errors.image}</div>
        )}

        <label className="block mt-4 mb-2">Tags</label>
        <input
          type="text"
          onKeyDown={handleTagInput}
          placeholder="Press Enter to add tag"
          className="w-full p-2 text-black dark:bg-gray-600 outline-none border rounded"
        />
        <div className="flex flex-wrap mt-2">
          {formik.values.tags.map((tag, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white flex items-center px-2 py-1 rounded m-1"
            >
              {tag}{" "}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1"
              >
                <LiaTimesSolid />
              </button>
            </div>
          ))}
        </div>

        <label className="block mt-4 mb-2">Category</label>
        <select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          className="w-full p-2 text-black dark:bg-gray-600 outline-none border rounded"
        >
          <option value="real-estate">Real Estate</option>
          <option value="insurance">Insurance</option>
          <option value="financial-education">Financial Education</option>
          <option value="life">Life</option>
        </select>
        {formik.touched.category && formik.errors.category && (
          <div className="text-red-500">{formik.errors.category}</div>
        )}

        <button
          type="submit"
          className="mt-6 w-[100px] bg-blue-600 text-white py-2 rounded"
          disabled={loading || uploading}
        >
          {loading ? "Submitting..." : uploading ? "Uploading..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default CreateBlog;
