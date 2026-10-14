import api from './BaseUrl';

interface IUpdateCategoryRequest {
  categoryId: number;
  categoryName: string;
}

export const fetchCategories = async () => {
  // const response = await fetch("/api/category/find-all");
  const {data} = await api.get("/category/find-all");
  return data;
};

export const updateCategory = async (updateCategoryRequest: IUpdateCategoryRequest) => {
  const {data} = await api.put("/category/update-category", updateCategoryRequest);
  return data;
}

export {}