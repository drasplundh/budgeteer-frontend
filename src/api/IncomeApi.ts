import { updateTypePredicateNode } from "typescript";
import api from "./BaseUrl";

export const fetchIncome = async () => {
//   const response = await fetch("/api/expense/find-all");
  const { data } = await api.get('/income/find-all');
  return data;
};

// export const updateExpense = async (updateCategoryRequest: {
//     expenseId: Number, 
//     categoryName: String, 
//     subcategoryName?: String
// }) => {
//     // const response = await fetch("/api/expense/update-category");
//     const { data } = await api.put("/expense/update-subcategory", {
//         expenseId: updateCategoryRequest.expenseId,
//         categoryName: updateCategoryRequest.categoryName,
//         subcategoryName: updateCategoryRequest.subcategoryName,
//     });
//     return data;
// };

export const createIncome = async (createExpenseRequest: {
    amount: number,
    date: string
    category: string,
    subcategory: string,
}) => {
    const { data } = await api.post("/income/create-income", {
        amount: createExpenseRequest.amount,
        date: createExpenseRequest.date,
        category: createExpenseRequest.category,
        subcategory: createExpenseRequest.subcategory,
    });
    return data;
}

export {}