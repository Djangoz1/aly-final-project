export const AlertInfo = ({ message }) => {
  return (
    <div className="toast">
      <div className="alert alert-info min-w-[300px]">
        <div className="text-white flex items-center">{message}</div>
      </div>
    </div>
  );
};
