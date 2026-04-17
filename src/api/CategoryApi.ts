import api from './BaseUrl';

export const fetchCategories = async () => {
  // const response = await fetch("/api/category/find-all");
  const {data} = await api.get("/category/find-all");
  return data;
};

export {}