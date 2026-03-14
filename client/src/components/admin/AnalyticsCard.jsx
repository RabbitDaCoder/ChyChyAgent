import PropTypes from "prop-types";

const AnalyticsCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="flex gap-10 items-center my-3 lg:my-2 lg:w-full lg:h-full ">
      <div className="border rounded-lg cursor-pointer flex flex-col items-center px-2 py-4 border-stone-400 w-[130px] h-[100px] lg:w-[200px] lg:h-[90px]">
        <div className=" flex flex-col lg:flex-row gap-2 items-center text-gray-600">
          <Icon className="lg:text-xl  dark:text-white" size={17} />{" "}
          <span className="text-gray-400 text-xs lg:text-start text-center">
            {title}
          </span>
        </div>
        <h1 className="font-extrabold lg:text-xl text-sm">{value}</h1>
      </div>
    </div>
  );
};
AnalyticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AnalyticsCard;
