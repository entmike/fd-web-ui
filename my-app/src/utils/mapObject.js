const mapObject = ({ keyMapper, valueMapper, mapee }) => {
  let newObject = {};

  Object.entries(mapee).forEach(([key, value]) => {
    const newKey = keyMapper ? keyMapper(key) : key;
    const newValue = valueMapper ? valueMapper(value) : value;
    newObject[newKey] = newValue;
  });

  return newObject;
};

export default mapObject;
