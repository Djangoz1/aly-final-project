export const recastDescription = (description) => {
  if (description) {
    const newObj = description.split("__/");
    const arr = {};
    for (let i = 0; i < newObj.length; i++) {
      const elem = newObj[i].split(":");
      if (elem[0] !== "" && elem[1] !== undefined) {
        arr[elem[0]] = elem[1];
      }
    }
    return arr;
  }
};
