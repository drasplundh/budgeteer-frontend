import { updateTypePredicateNode } from "typescript";
import api from "./BaseUrl";

export const fetchExpenses = async () => {
//   const response = await fetch("/api/expense/find-all");
  const { data } = await api.get('/expense/find-all');
  return data;
};

export const updateExpense = async (updateCategoryRequest: {
    expenseId: Number, 
    categoryName: String, 
    subcategoryName?: String
}) => {
    // const response = await fetch("/api/expense/update-category");
    const { data } = await api.put("/expense/update-category", {
        id: updateCategoryRequest.expenseId,
        categoryName: updateCategoryRequest.categoryName,
        subCategoryName: updateCategoryRequest.subcategoryName,
    });
    return data;
};

export {}