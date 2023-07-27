import { Icon } from "@iconify/react";
import { icfyINFO } from "icones";
import { useEffect } from "react";

export const AlertInfo = ({ message }) => {
  return (
    <div className="toast">
      <div className="alert alert-info min-w-[300px]">
        <div className="text-white flex items-center">{message}</div>
      </div>
    </div>
  );
};

export const AlertError = ({ message, setter }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setter(null);
    }, 3000);

    // Assurez-vous de nettoyer le timeout lors du démontage du composant
    return () => clearTimeout(timeoutId);
  }, [message]);
  return (
    <div className="toast">
      <div className="alert alert-error min-w-[300px]">
        <div className="text-white flex items-center">
          <Icon icon={icfyINFO} className="text-2xl mr-3" /> {message}
        </div>
      </div>
    </div>
  );
};
