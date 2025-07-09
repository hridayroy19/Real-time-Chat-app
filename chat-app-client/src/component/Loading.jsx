import { Atom } from "react-loading-indicators";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#d1cece]">
      <p className="text-xl font-semibold text-gray-600">
        <Atom color="#7624a6" size="large" text="" textColor="#9033a9" />
      </p>
    </div>
  );
};

export default Loading;
