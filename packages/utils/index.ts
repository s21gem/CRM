export const classNames = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
