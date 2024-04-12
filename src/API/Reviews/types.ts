export type Rating = 1 | 2 | 3 | 4 | 5;

export type Review = {
  _id: string;
  date: string;
  rating: Rating;
  title: string;
  content: string;
  userId: string;
  movieId: string;
  likes: string[];
};

export type NewReview = {
  rating: Rating;
  title: string;
  content: string;
  movieId: string;
};

export type UpdateReview = {
  _id: string;
  rating: Rating;
  title: string;
  content: string;
};
