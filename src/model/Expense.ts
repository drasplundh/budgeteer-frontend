export interface IExpense {
    expenseId: number,
    vendor: string,
    cost: number,
    username: string,
    date: string,
    user: string,
    subcategory?: {
        subcategoryName: string,
        category?: {
            categoryName: string
        }
    }
}