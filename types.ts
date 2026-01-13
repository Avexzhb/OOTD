
export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export interface UserInput {
  city: string;
  age: number;
  gender: Gender | null;
}

export interface GenerationState {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}
