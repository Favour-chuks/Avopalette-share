const ColorGrid = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-center">Color Grid</h2>
      <div className="grid grid-cols-5 gap-2 mt-4">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded-full bg-gray-200"></div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-4"></div>
    </div>
  );
};

export default ColorGrid;
