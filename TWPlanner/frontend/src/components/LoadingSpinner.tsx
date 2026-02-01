import spinner from '../imgs/other/spinner.webp?inline';

const LoadingSpinner = ({ loadingText = 'Loading...' }: { loadingText?: string }) => {
  return (
    <div className="grow flex flex-col place-items-center mt-[20vh]">
      <p className="text-center text-4xl text-gray-200">{loadingText}</p>
      <img
        src={spinner}
        alt="loadingSpinner"
        width="40"
        height="40"
        draggable={false}
        className="loading-spinner w-20 h-20"
      />
    </div>
  );
};

export default LoadingSpinner;
