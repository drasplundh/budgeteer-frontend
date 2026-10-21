export interface IExpense {
    expenseId: number,
    vendor: string,
    cost: number,
    username: string,
    date: string,
    user: string,
    subcategory?: {
        subcategoryName: string,
        subcategoryId: number,
        category?: {
            categoryName: string
            categoryId: number,
        }
    }
}