
export default (field) => function (next) {
    this.populate(field);
    next();
  };