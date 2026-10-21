import { updateTypePredicateNode } from "typescript";
import api from "./BaseUrl";
import { subDays } from "react-datepicker/dist/date_utils";

export const fetchExpenses = async () => {
    //   const response = await fetch("/api/expense/find-all");
    const { data } = await api.get('/expense/find-all');
    return data;
};

export const categorizeExpense = async (updateCategoryRequest: {
    expenseId: Number,
    categoryName: String,
    subcategoryName?: String
}) => {
    // const response = await fetch("/api/expense/update-category");
    const { data } = await api.put("/expense/update-subcategory", {
        expenseId: updateCategoryRequest.expenseId,
        categoryName: updateCategoryRequest.categoryName,
        subcategoryName: updateCategoryRequest.subcategoryName,
    });
    return data;
};

export const updateExpense = async (updateExpenseRequest: {
    expenseId: number,
    vendor: string,
    cost: number,
    date: string,
    subcategoryId: number
}) => {


    const { data } = await api.put("/expense/update-expense", {
        expenseId: updateExpenseRequest.expenseId,
        vendor: updateExpenseRequest.vendor,
        cost: updateExpenseRequest.cost,
        date: updateExpenseRequest.date,
        subcategoryId: updateExpenseRequest.subcategoryId
    })
    return data;
};

export const createExpense = async (createExpenseRequest: {
    vendor: string,
    cost: number,
    date: string
    category: string,
    subcategory: string,
}) => {
    const { data } = await api.post("/expense/create-expense", {
        vendor: createExpenseRequest.vendor,
        cost: createExpenseRequest.cost,
        date: createExpenseRequest.date,
        category: createExpenseRequest.category,
        subcategory: createExpenseRequest.subcategory,
    });
    return data;
}

export const deleteExpense = async (expenseId) => {
    const resp = await api.delete("/expense/delete-expense/"+expenseId);
    return resp;
}

export { }