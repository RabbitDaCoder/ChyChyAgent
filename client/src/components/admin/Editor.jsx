import { useRef, useMemo } from "react";
import PropTypes from "prop-types";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";

// Register Image Uploader Module
Quill.register("modules/imageUploader", ImageUploader);

// Register Custom Fonts
const Font = Quill.import("formats/font");
Font.whitelist = [
  "dancing-script",
  "pacifico",
  "lobster", // Stylish
  "oswald",
  "montserrat",
  "bebas-neue", // Bold
  "merriweather",
  "lora",
  "playfair", // Formal
];
Quill.register(Font, true);

const Editor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: "1" }, { header: "2" }, { font: Font.whitelist }], // Fix: Properly reference fonts
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
      ],
      imageUploader: {
        upload: (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        },
      },
    }),
    []
  );

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      theme="snow"
    />
  );
};

Editor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Editor;
