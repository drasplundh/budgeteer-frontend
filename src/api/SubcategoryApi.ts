import api from './BaseUrl';

interface IUpdateSubcategoryRequest {
  subcategoryId: number;
  subcategoryName: string;
}

export const fetchSubcategories = async () => {
  const {data} = await api.get("/subcategory/find-all");
  return data;
};

export const updateSubcategory = async (updateSubcategoryRequest: IUpdateSubcategoryRequest) => {
  const {data} = await api.put("/subcategory/update-subcategory", updateSubcategoryRequest);
  return data;
}

export {}