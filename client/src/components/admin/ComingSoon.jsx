import comingSoon from "../../assets/Underconstruction.png";
const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen bg-white dark:bg-gray-950 text-center px-4">
      <img
        src={comingSoon}
        alt="Under Construction"
        className="w-full h-[350px] object-contain mb-6"
      />
      <h1 className="text-xl md:text-4xl font-bold text-gray-800 dark:text-white">
        This page is under construction.
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        We're working hard to bring you something awesome. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;
