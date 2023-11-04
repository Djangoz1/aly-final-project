import { CodeEditor } from "components/myComponents/MyEditor";
import React, { useEffect, useState } from "react";

export function FileDisplay({ blob, style }) {
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(blob);
  }, [blob]);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = fileContent;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [fileContent]);

  return (
    <div className="w-screen absolute  h-screen debug top-0 left-0">
      <div className="" id="dynamic-component"></div>
    </div>
  );

  //   return <DynamicComponent fileContent={fileContent} />;
}
