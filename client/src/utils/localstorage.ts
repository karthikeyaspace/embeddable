// content stored in local storage - user_id, token, expires_at

type LCSetTypes = "user_id" | "token" | "expires_at";

export const setLs = (key: LCSetTypes, value: string) => {
  localStorage.setItem(`embeddable.${key}`, value);
};

export const getLs = (key: string) => {
  return localStorage.getItem(`embeddable.${key}`);
};
