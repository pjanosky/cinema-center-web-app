export type ListEntry = {
  movieId: string;
  description: string;
};

export type List = {
  _id: string;
  date: string;
  userId: string;
  title: string;
  description: string;
  entries: ListEntry[];
};

export type NewList = {
  title: string;
  description: string;
};

export type UpdateList = {
  _id: string;
  title: string;
  description: string;
};
