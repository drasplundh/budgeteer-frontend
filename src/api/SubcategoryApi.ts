import api from './BaseUrl';

export const fetchSubcategories = async () => {
  const {data} = await api.get("/subcategory/find-all");
  return data;
};

export {}