const slug = (name = '') =>
  name
    .toLocaleLowerCase()
    .replace(/\s/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default slug;
