export interface Root {
    recipes: Recipe[];
    total: number;
    skip: number;
    limit: number;
}

export interface Recipe {
    id: number;
    name: string;
    ingredients: string[];
    instructions: string[];
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    caloriesPerServing: number;
    tags: string[];
    userId: number;
    image: string;
    rating: number;
    reviewCount: number;
    mealType: string[];
}

// https://transform.tools/json-to-typescript

export interface DataResponse {
    recipes: Recipe[];
    total: number;
    skip: number;
    limit: number;
}
